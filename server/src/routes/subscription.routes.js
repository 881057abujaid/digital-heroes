import { Router } from "express";

import {
    getMySubscription,
    createSubscriptionCheckout,
} from "../controllers/subscription.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
    createCheckoutSchema,
} from "../validators/subscription.validator.js";

const router = Router();

router.get(
    "/me",
    authenticate,
    getMySubscription
);

router.post(
    "/checkout",
    authenticate,
    validate(createCheckoutSchema),
    createSubscriptionCheckout
);

export default router;