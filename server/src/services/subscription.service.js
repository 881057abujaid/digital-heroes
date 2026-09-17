import prisma from "../lib/prisma.js";
import stripe from "../config/stripe.js";

export const getCurrentSubscription = async (userId) => {
    const subscription = await prisma.subscription.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            plan: true,
            status: true,
            stripeSubscriptionId: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
            cancelAtPeriodEnd: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return subscription;
};

export const createCheckoutSession = async ({ userId, plan }) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
        },
    });

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const priceId =
        plan === "MONTHLY"
            ? process.env.STRIPE_MONTHLY_PRICE_ID
            : process.env.STRIPE_YEARLY_PRICE_ID;

    if (!priceId) {
        const error = new Error(
            `Stripe price ID not configured for ${plan}`
        );
        error.statusCode = 500;
        throw error;
    }

    const existingSubscription = await prisma.subscription.findFirst({
        where: {
            userId,
            status: "ACTIVE",
        },
    });

    if (existingSubscription) {
        const error = new Error(
            "You already have an active subscription"
        );
        error.statusCode = 400;
        throw error;
    }

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",

        customer_email: user.email,

        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],

        metadata: {
            userId,
            plan,
        },

        success_url:
            `${process.env.CLIENT_URL}/dashboard/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
            `${process.env.CLIENT_URL}/dashboard/subscription?canceled=true`,
    });

    return {
        sessionId: session.id,
        checkoutUrl: session.url,
    };
};

export const handleCheckoutCompleted = async (session) => {
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;
    const stripeSubscriptionId = session.subscription;

    if (!userId || !plan || !stripeSubscriptionId) {
        throw new Error("Missing subscription data in checkout session");
    }

    // Fetch the complete subscription details from Stripe
    const stripeSubscription =
        await stripe.subscriptions.retrieve(stripeSubscriptionId);

    const subscription = await prisma.subscription.upsert({
        where: {
            stripeSubscriptionId,
        },

        update: {
            status: "ACTIVE",
            plan,
            currentPeriodStart: stripeSubscription.current_period_start
                ? new Date(stripeSubscription.current_period_start * 1000)
                : null,
            currentPeriodEnd: stripeSubscription.current_period_end
                ? new Date(stripeSubscription.current_period_end * 1000)
                : null,
            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        },

        create: {
            userId,
            plan,
            status: "ACTIVE",
            stripeSubscriptionId,

            currentPeriodStart: stripeSubscription.current_period_start
                ? new Date(stripeSubscription.current_period_start * 1000)
                : null,

            currentPeriodEnd: stripeSubscription.current_period_end
                ? new Date(stripeSubscription.current_period_end * 1000)
                : null,

            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        },
    });

    return subscription;
};

export const syncStripeSubscription = async (stripeSubscription) => {
    const stripeSubscriptionId = stripeSubscription.id;

    const existingSubscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId },
    });

    if (!existingSubscription) {
        console.warn(`Subscription not found: ${stripeSubscriptionId}`);
        return null;
    }

    const status =
        stripeSubscription.status === "active"
            ? "ACTIVE"
            : "LAPSED";

    const currentPeriodStart =
        stripeSubscription.items?.data?.[0]?.current_period_start;

    const currentPeriodEnd =
        stripeSubscription.items?.data?.[0]?.current_period_end;

    return prisma.subscription.update({
        where: { stripeSubscriptionId },

        data: {
            status,

            currentPeriodStart: currentPeriodStart
                ? new Date(currentPeriodStart * 1000)
                : null,

            currentPeriodEnd: currentPeriodEnd
                ? new Date(currentPeriodEnd * 1000)
                : null,

            cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        },
    });
};

export const handleStripeSubscriptionDeleted = async (
    stripeSubscription
) => {
    const subscription = await prisma.subscription.findUnique({
        where: {
            stripeSubscriptionId: stripeSubscription.id,
        },
    });

    if (!subscription) {
        console.warn(
            `Subscription not found: ${stripeSubscription.id}`
        );

        return null;
    }

    return prisma.subscription.update({
        where: {
            stripeSubscriptionId: stripeSubscription.id,
        },
        data: {
            status: "LAPSED",
            cancelAtPeriodEnd: false,
            currentPeriodStart: stripeSubscription.current_period_start
                ? new Date(
                    stripeSubscription.current_period_start * 1000
                )
                : null,
            currentPeriodEnd: stripeSubscription.current_period_end
                ? new Date(
                    stripeSubscription.current_period_end * 1000
                )
                : null,
        },
    });
};