import { Router } from "express";
import {
    simulateDrawController,
    generateDrawEntriesController,
    calculateDrawResultsController,
    createDrawWinnersController,
    publishDrawController,
    completeDrawController,
    getLatestDrawController
} from "../controllers/draw.controller.js";
import {
    authenticate,
    requireAdmin,
} from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { simulateDrawSchema } from "../validators/draw.validator.js";

const router = Router();

router.get(
    "/latest",
    authenticate,
    getLatestDrawController
);

router.post(
    "/simulate",
    authenticate,
    requireAdmin,
    validate(simulateDrawSchema),
    simulateDrawController
);

router.post(
    "/:drawId/entries",
    authenticate,
    requireAdmin,
    generateDrawEntriesController
);

router.post(
    "/:drawId/results",
    authenticate,
    requireAdmin,
    calculateDrawResultsController
);

router.post(
    "/:drawId/winners",
    authenticate,
    requireAdmin,
    createDrawWinnersController
);

router.post(
    "/:drawId/publish",
    authenticate,
    requireAdmin,
    publishDrawController
);

router.post(
    "/:drawId/complete",
    authenticate,
    requireAdmin,
    completeDrawController
);

export default router;