import { Router } from "express";

import {
    handleStripeWebhook,
} from "../controllers/stripe-webhook.controller.js";

const router = Router();

router.post("/", handleStripeWebhook);

export default router;