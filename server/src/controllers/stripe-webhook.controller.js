import stripe from "../config/stripe.js";
import {
    handleCheckoutCompleted,
    syncStripeSubscription,
    handleStripeSubscriptionDeleted
} from "../services/subscription.service.js";

export const handleStripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.error("Stripe webhook signature verification failed:", error.message);

        return res.status(400).json({
            success: false,
            message: "Invalid webhook signature",
        });
    }

    console.log("Stripe webhook event:", event.type);

    switch (event.type) {
        case "checkout.session.completed": {
            await handleCheckoutCompleted(event.data.object);

            console.log(
                "Subscription synchronized:",
                event.data.object.id
            );

            break;
        }

        case "customer.subscription.updated": {
            await syncStripeSubscription(event.data.object);

            console.log(
                "Stripe subscription updated:",
                event.data.object.id
            );

            break;
        }

        case "customer.subscription.deleted": {
            await handleStripeSubscriptionDeleted(
                event.data.object
            );

            console.log(
                "Stripe subscription marked as lapsed:",
                event.data.object.id
            );

            break;
        }

        default:
            console.log(
                `Unhandled Stripe event: ${event.type}`
            );
    }

    return res.status(200).json({
        received: true,
    });
};