import { Router } from "express";

import {
    getAdminDashboardController,
    getAdminUsersController,
    getAdminSubscriptionsController,
    getAdminDrawsController,
    getAdminWinnersController,
    getAdminCharitiesController,
    getAdminReportsController
} from "../controllers/admin.controller.js";

import {
    authenticate,
    requireAdmin,
} from "../middleware/auth.middleware.js";

const router = Router();

router.get(
    "/dashboard",
    authenticate,
    requireAdmin,
    getAdminDashboardController
);

router.get(
    "/users",
    authenticate,
    requireAdmin,
    getAdminUsersController
);

router.get(
    "/subscriptions",
    authenticate,
    requireAdmin,
    getAdminSubscriptionsController
);

router.get(
    "/draws",
    authenticate,
    requireAdmin,
    getAdminDrawsController
);

router.get(
    "/winners",
    authenticate,
    requireAdmin,
    getAdminWinnersController
);

router.get(
    "/charities",
    authenticate,
    requireAdmin,
    getAdminCharitiesController
);

router.get(
    "/reports",
    authenticate,
    requireAdmin,
    getAdminReportsController
);

export default router;