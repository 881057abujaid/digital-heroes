import "dotenv/config";
import stripe from "./src/config/stripe.js";
import prisma from "./src/lib/prisma.js";

const stripeSubscriptionId = "sub_1UGEEcEMA3x06jgE4plLzksi";

const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

const currentPeriodStart =
    stripeSubscription.items?.data?.[0]?.current_period_start;

const currentPeriodEnd =
    stripeSubscription.items?.data?.[0]?.current_period_end;

const updatedSubscription = await prisma.subscription.update({
    where: {
        stripeSubscriptionId,
    },

    data: {
        status: stripeSubscription.status === "active"
            ? "ACTIVE"
            : "LAPSED",

        currentPeriodStart: currentPeriodStart
            ? new Date(currentPeriodStart * 1000)
            : null,

        currentPeriodEnd: currentPeriodEnd
            ? new Date(currentPeriodEnd * 1000)
            : null,

        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    },
});

console.log({
    id: updatedSubscription.id,
    status: updatedSubscription.status,
    currentPeriodStart: updatedSubscription.currentPeriodStart,
    currentPeriodEnd: updatedSubscription.currentPeriodEnd,
    cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
});

await prisma.$disconnect();