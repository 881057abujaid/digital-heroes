import {
    getCurrentSubscription,
    createCheckoutSession,
} from "../services/subscription.service.js";

export const getMySubscription = async (req, res, next) => {
    try {
        const subscription = await getCurrentSubscription(
            req.user.userId
        );

        return res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        next(error);
    }
};

export const createSubscriptionCheckout = async (req, res, next) => {
    try {
        const { plan } = req.body;

        const result = await createCheckoutSession({
            userId: req.user.userId,
            plan,
        });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};