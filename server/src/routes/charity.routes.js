import { Router } from "express";

import {
    listCharities,
    getCharity,
} from "../controllers/charity.controller.js";

const router = Router();

router.get("/", listCharities);

router.get("/:id", getCharity);

export default router;