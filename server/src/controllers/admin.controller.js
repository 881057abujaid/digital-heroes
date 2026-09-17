import {
    getAdminDashboardSummary,
    getAdminUsers,
    getAdminSubscriptions,
    getAdminDraws,
    getAdminWinners,
    getAdminCharities,
    getAdminReports
} from "../services/admin.service.js";

export const getAdminDashboardController = async (req, res, next) => {
    try {
        const summary = await getAdminDashboardSummary();

        return res.status(200).json({
            success: true,
            message: "Admin dashboard summary fetched successfully",
            data: summary,
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminUsersController = async (req, res, next) => {
    try {
        const page = Math.max(
            Number.parseInt(req.query.page, 10) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number.parseInt(req.query.limit, 10) || 10,
                1
            ),
            100
        );

        const search = req.query.search?.trim() || "";

        const result = await getAdminUsers({
            page,
            limit,
            search,
        });

        return res.status(200).json({
            success: true,
            message: "Admin users fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminSubscriptionsController = async (
    req,
    res,
    next
) => {
    try {
        const page = Math.max(
            Number.parseInt(req.query.page, 10) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number.parseInt(req.query.limit, 10) || 10,
                1
            ),
            100
        );

        const status = req.query.status?.trim().toUpperCase() || "";
        const plan = req.query.plan?.trim().toUpperCase() || "";

        const result = await getAdminSubscriptions({
            page,
            limit,
            status,
            plan,
        });

        return res.status(200).json({
            success: true,
            message: "Admin subscriptions fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminDrawsController = async (req, res, next) => {
    try {
        const page = Math.max(
            Number.parseInt(req.query.page, 10) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number.parseInt(req.query.limit, 10) || 10,
                1
            ),
            100
        );

        const status = req.query.status?.trim().toUpperCase() || "";
        const mode = req.query.mode?.trim().toUpperCase() || "";

        const result = await getAdminDraws({
            page,
            limit,
            status,
            mode,
        });

        return res.status(200).json({
            success: true,
            message: "Admin draws fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminWinnersController = async (req, res, next) => {
    try {
        const page = Math.max(
            Number.parseInt(req.query.page, 10) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number.parseInt(req.query.limit, 10) || 10,
                1
            ),
            100
        );

        const status = req.query.status?.trim().toUpperCase() || "";
        const tier = req.query.tier?.trim().toUpperCase() || "";

        const result = await getAdminWinners({
            page,
            limit,
            status,
            tier,
        });

        return res.status(200).json({
            success: true,
            message: "Admin winners fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminCharitiesController = async (req, res, next) => {
    try {
        const page = Math.max(
            Number.parseInt(req.query.page, 10) || 1,
            1
        );

        const limit = Math.min(
            Math.max(
                Number.parseInt(req.query.limit, 10) || 10,
                1
            ),
            100
        );

        const search = req.query.search?.trim() || "";

        const featured =
            req.query.featured !== undefined
                ? req.query.featured === "true"
                : undefined;

        const active =
            req.query.active !== undefined
                ? req.query.active === "true"
                : undefined;

        const result = await getAdminCharities({
            page,
            limit,
            search,
            featured,
            active,
        });

        return res.status(200).json({
            success: true,
            message: "Admin charities fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getAdminReportsController = async (req, res, next) => {
    try {
        const reports = await getAdminReports();

        return res.status(200).json({
            success: true,
            message: "Admin reports fetched successfully",
            data: reports,
        });
    } catch (error) {
        next(error);
    }
};