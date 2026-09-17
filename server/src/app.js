import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import prisma from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import charityRoutes from "./routes/charity.routes.js";
import userRoutes from "./routes/user.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import drawRoutes from "./routes/draw.routes.js";
import winnerRoutes from "./routes/winner.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import stripeWebhookRoutes from "./routes/stripe-webhook.routes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(
    "/api/v1/subscriptions/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhookRoutes
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/scores", scoreRoutes);
app.use("/api/v1/charities", charityRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/draws", drawRoutes);
app.use("/api/v1/winners", winnerRoutes);
app.use("/api/v1/admin", adminRoutes);


app.get("/api/v1/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;

        res.status(200).json({
            success: true,
            message: "Digital Heroes API is running",
            database: "connected",
        });
    } catch (error) {
        console.error("Database health check failed:", error);

        res.status(503).json({
            success: false,
            message: "Database connection failed",
        });
    }
});

export default app;