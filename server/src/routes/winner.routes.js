import { Router } from "express";

import { authenticate, requireAdmin } from "../middleware/auth.middleware.js";

import {
    submitWinnerProofController,
    reviewWinnerProofController,
    markWinnerAsPaidController,
    uploadWinnerProofController,
    getMyWinningsController
} from "../controllers/winner.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.get(
    "/me",
    authenticate,
    getMyWinningsController
);

router.post(
    "/:winnerId/proof",
    authenticate,
    submitWinnerProofController
);

router.patch(
    "/:winnerId/proof/review",
    authenticate,
    requireAdmin,
    reviewWinnerProofController
);

router.patch(
    "/:winnerId/pay",
    authenticate,
    requireAdmin,
    markWinnerAsPaidController
);

router.post(
    "/:winnerId/proof/upload",
    authenticate,
    upload.single("proof"),
    uploadWinnerProofController
);

export default router;