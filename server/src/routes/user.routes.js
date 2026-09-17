import { Router } from "express";

import { updateCharity } from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { updateCharitySchema } from "../validators/user.validator.js";

const router = Router();

router.patch(
    "/me/charity",
    authenticate,
    validate(updateCharitySchema),
    updateCharity
);

export default router;