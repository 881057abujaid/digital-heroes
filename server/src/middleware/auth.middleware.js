import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

export const requireAdmin = (req, res, next) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }

    next();
};

export const requireActiveSubscription = async (req, res, next) => {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: req.user.userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        if (!subscription) {
            return res.status(403).json({
                success: false,
                message: "Active subscription required",
            });
        }

        if (subscription.status !== "ACTIVE") {
            return res.status(403).json({
                success: false,
                message: "Active subscription required",
            });
        }

        req.subscription = subscription;

        next();
    } catch (error) {
        next(error);
    }
};