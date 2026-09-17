import { Router } from "express";

import {
    addScore,
    getScores,
    editScore,
    removeScore
} from "../controllers/score.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
    createScoreSchema,
    updateScoreSchema
} from "../validators/score.validator.js";

const router = Router();

router.post(
    "/",
    authenticate,
    validate(createScoreSchema),
    addScore
);

router.get(
    "/",
    authenticate,
    getScores
);

router.patch(
    "/:id",
    authenticate,
    validate(updateScoreSchema),
    editScore
);

router.delete(
    "/:id",
    authenticate,
    removeScore
);

export default router;