import prisma from "../lib/prisma.js";
import crypto from "node:crypto";
import { generateUniqueNumbers, generateAlgorithmicNumbers, getMonthRange } from "../utils/draw.utils.js";
import { DRAW_CONFIG } from "../config/draw.config.js";

const getPreviousJackpot = async (drawDate) => {
    const previousDraw = await prisma.draw.findFirst({
        where: {
            drawDate: {
                lt: new Date(drawDate),
            },
            status: {
                in: ["PUBLISHED", "COMPLETED"],
            },
        },
        orderBy: {
            drawDate: "desc",
        },
    });

    if (!previousDraw) {
        return 0;
    }

    const fiveMatchWinner = await prisma.winner.findFirst({
        where: {
            drawId: previousDraw.id,
            tier: "FIVE",
            status: "PAID",
        },
    });

    if (fiveMatchWinner) {
        return 0;
    }

    return Number(previousDraw.jackpotRollover);
};

export const simulateDraw = async ({ drawDate, mode }) => {
    // 1. Check whether a draw already exists for this month
    const { start, end } = getMonthRange(drawDate);

    const existingDraw = await prisma.draw.findFirst({
        where: {
            drawDate: {
                gte: start,
                lt: end,
            },
        },
    });

    if (existingDraw) {
        throw new Error("A draw already exists for this month");
    }

    // 2. Find active subscribers
    const activeSubscriptions = await prisma.subscription.findMany({
        where: {
            status: "ACTIVE",
        },
        select: {
            userId: true,
        },
    });

    const eligibleUserIds = [
        ...new Set(
            activeSubscriptions.map((subscription) => subscription.userId)
        ),
    ];

    const eligibleUserCount = eligibleUserIds.length;

    // 3. Calculate base prize pool
    // Temporary implementation.
    // Exact PRD-based calculation will be finalized separately.
    const prizePool =
        eligibleUserCount * DRAW_CONFIG.subscriptionPrizeContribution;

    // 4. Find previous completed draw
    const previousDraw = await prisma.draw.findFirst({
        where: {
            status: "COMPLETED",
            drawDate: {
                lt: start,
            },
        },
        orderBy: {
            drawDate: "desc",
        },
        include: {
            winners: {
                where: {
                    tier: "FIVE",
                },
                select: {
                    id: true,
                },
            },
        },
    });

    // 5. Calculate jackpot rollover
    let jackpotRollover = 0;

    if (previousDraw && previousDraw.winners.length === 0) {
        const previousFivePool = Number(previousDraw.prizePool) * 0.40;

        jackpotRollover =
            previousFivePool + Number(previousDraw.jackpotRollover);
    }

    // 6. Generate winning numbers
    const randomSeed = crypto.randomUUID();

    let numbers;

    if (mode === "ALGORITHMIC") {
        const scores = await prisma.score.findMany({
            select: {
                value: true,
            },
        });

        numbers = generateAlgorithmicNumbers(
            scores.map((score) => score.value),
            randomSeed,
            5
        );
    } else {
        numbers = generateUniqueNumbers(5);
    }

    // 7. Create simulated draw
    const draw = await prisma.draw.create({
        data: {
            drawDate: new Date(drawDate),
            mode,
            numbers,
            status: "SIMULATED",
            prizePool,
            jackpotRollover,
            eligibleUserCount,
            randomSeed,
            algorithmVersion: mode === "ALGORITHMIC" ? "v2" : null,
        },
    });

    return draw;
};

export const generateDrawEntries = async (drawId) => {
    const draw = await prisma.draw.findUnique({
        where: {
            id: drawId,
        },
    });

    if (!draw) {
        throw new Error("Draw not found");
    }

    if (draw.status !== "SIMULATED") {
        throw new Error("Only simulated draws can generate entries");
    }

    const activeSubscriptions = await prisma.subscription.findMany({
        where: {
            status: "ACTIVE",
        },
        select: {
            userId: true,
        },
    });

    const eligibleUserIds = [
        ...new Set(
            activeSubscriptions.map((subscription) => subscription.userId)
        ),
    ];

    if (eligibleUserIds.length === 0) {
        throw new Error("No eligible subscribers found");
    }

    const entries = eligibleUserIds.map((userId) => ({
        drawId,
        userId,
        numbers: generateUniqueNumbers(5),
    }));

    await prisma.drawEntry.createMany({
        data: entries,
        skipDuplicates: true,
    });

    return prisma.drawEntry.findMany({
        where: {
            drawId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};

export const calculateDrawResults = async (drawId) => {
    const draw = await prisma.draw.findUnique({
        where: {
            id: drawId,
        },
        include: {
            entries: true,
        },
    });

    if (!draw) {
        throw new Error("Draw not found");
    }

    if (draw.status !== "SIMULATED") {
        throw new Error("Only simulated draws can calculate results");
    }

    if (!draw.numbers || draw.numbers.length !== 5) {
        throw new Error("Draw must have exactly 5 winning numbers");
    }

    const winningNumbers = new Set(draw.numbers);

    const results = [];

    for (const entry of draw.entries) {
        const matchedCount = entry.numbers.filter((number) =>
            winningNumbers.has(number)
        ).length;

        let tier = null;

        if (matchedCount === 5) {
            tier = "FIVE";
        } else if (matchedCount === 4) {
            tier = "FOUR";
        } else if (matchedCount === 3) {
            tier = "THREE";
        }

        const updatedEntry = await prisma.drawEntry.update({
            where: {
                id: entry.id,
            },
            data: {
                matchedCount,
                tier,
            },
        });

        results.push(updatedEntry);
    }

    return results;
};

export const createDrawWinners = async (drawId) => {
    const draw = await prisma.draw.findUnique({
        where: {
            id: drawId,
        },
        include: {
            entries: true,
        },
    });

    if (!draw) {
        throw new Error("Draw not found");
    }

    if (draw.status !== "SIMULATED") {
        throw new Error("Only simulated draws can create winners");
    }

    const winningEntries = draw.entries.filter(
        (entry) => entry.matchedCount >= 3
    );

    if (winningEntries.length === 0) {
        return [];
    }

    const threeMatchEntries = winningEntries.filter(
        (entry) => entry.matchedCount === 3
    );

    const fourMatchEntries = winningEntries.filter(
        (entry) => entry.matchedCount === 4
    );

    const fiveMatchEntries = winningEntries.filter(
        (entry) => entry.matchedCount === 5
    );

    const prizePool = Number(draw.prizePool);

    const threePool = prizePool * 0.25;
    const fourPool = prizePool * 0.35;
    const fivePool =
        prizePool * 0.40 + Number(draw.jackpotRollover);

    const winners = [];

    const createTierWinners = async (entries, tier, tierPool) => {
        if (entries.length === 0) {
            return;
        }

        const prizePerWinner = tierPool / entries.length;

        for (const entry of entries) {
            // Check whether a winner already exists for this entry
            const existingWinner = await prisma.winner.findUnique({
                where: {
                    drawEntryId: entry.id,
                },
            });

            if (existingWinner) {
                winners.push(existingWinner);
                continue;
            }

            const winner = await prisma.winner.create({
                data: {
                    drawId: draw.id,
                    userId: entry.userId,
                    drawEntryId: entry.id,
                    tier,
                    prizeAmount: prizePerWinner,
                    status: "PENDING_PROOF",
                },
            });

            winners.push(winner);
        }
    };

    await createTierWinners(
        threeMatchEntries,
        "THREE",
        threePool
    );

    await createTierWinners(
        fourMatchEntries,
        "FOUR",
        fourPool
    );

    await createTierWinners(
        fiveMatchEntries,
        "FIVE",
        fivePool
    );

    return winners;
};

export const publishDraw = async (drawId) => {
    const draw = await prisma.draw.findUnique({
        where: { id: drawId },
        include: {
            winners: true,
        },
    });

    if (!draw) {
        throw new Error("Draw not found");
    }

    if (draw.status !== "SIMULATED") {
        throw new Error("Only simulated draws can be published");
    }

    const publishedDraw = await prisma.draw.update({
        where: { id: drawId },
        data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
        },
    });

    return publishedDraw;
};

export const completeDraw = async (drawId) => {
    const draw = await prisma.draw.findUnique({
        where: {
            id: drawId,
        },
        include: {
            entries: true,
            winners: true,
        },
    });

    if (!draw) {
        throw new Error("Draw not found");
    }

    if (draw.status !== "PUBLISHED") {
        throw new Error("Only published draws can be completed");
    }

    if (!draw.entries.length) {
        throw new Error("Draw entries have not been generated");
    }

    const completedDraw = await prisma.draw.update({
        where: {
            id: drawId,
        },
        data: {
            status: "COMPLETED",
            completedAt: new Date(),
        },
    });

    return completedDraw;
};

export const getLatestSubscriberDraw = async (userId) => {
    const draw = await prisma.draw.findFirst({
        where: {
            status: {
                in: ["PUBLISHED", "COMPLETED"],
            },
        },
        orderBy: {
            drawDate: "desc",
        },
        select: {
            id: true,
            drawDate: true,
            mode: true,
            numbers: true,
            status: true,
            prizePool: true,
            jackpotRollover: true,
            eligibleUserCount: true,
            createdAt: true,
            publishedAt: true,
            completedAt: true,
            entries: userId
                ? {
                    where: { userId },
                    select: {
                        id: true,
                        numbers: true,
                        matchedCount: true,
                        tier: true,
                    },
                }
                : false,
            winners: userId
                ? {
                    where: { userId },
                    select: {
                        id: true,
                        tier: true,
                        prizeAmount: true,
                        status: true,
                    },
                }
                : false,
        },
    });

    if (!draw) {
        return null;
    }

    const userEntry = draw.entries?.[0] || null;
    const userWinner = draw.winners?.[0] || null;

    return {
        ...draw,
        userEntry,
        userWinner,
    };
};