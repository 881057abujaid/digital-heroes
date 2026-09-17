import prisma from "../lib/prisma.js";

export const getAdminDashboardSummary = async () => {
    const [
        totalUsers,
        activeSubscribers,
        subscriptionStats,
        drawStats,
        winnerStats,
        totalCharities,
        activeCharities,
    ] = await Promise.all([
        // Total users
        prisma.user.count(),

        // Users with an active subscription
        prisma.subscription.findMany({
            where: {
                status: "ACTIVE",
            },
            select: {
                userId: true,
            },
            distinct: ["userId"],
        }),

        // Subscription status counts
        prisma.subscription.groupBy({
            by: ["status"],
            _count: {
                _all: true,
            },
        }),

        // Draw status counts
        prisma.draw.groupBy({
            by: ["status"],
            _count: {
                _all: true,
            },
        }),

        // Winner status counts
        prisma.winner.groupBy({
            by: ["status"],
            _count: {
                _all: true,
            },
        }),

        // Total charities
        prisma.charity.count(),

        // Active charities
        prisma.charity.count({
            where: {
                isActive: true,
            },
        }),
    ]);

    const getGroupCount = (groups, key, value) => {
        const group = groups.find((item) => item[key] === value);

        return group?._count?._all ?? 0;
    };

    return {
        users: {
            total: totalUsers,
            subscribers: activeSubscribers.length,
        },

        subscriptions: {
            active: getGroupCount(
                subscriptionStats,
                "status",
                "ACTIVE"
            ),

            canceled: getGroupCount(
                subscriptionStats,
                "status",
                "CANCELED"
            ),

            lapsed: getGroupCount(
                subscriptionStats,
                "status",
                "LAPSED"
            ),
        },

        draws: {
            total: drawStats.reduce(
                (total, group) => total + group._count._all,
                0
            ),

            published: getGroupCount(
                drawStats,
                "status",
                "PUBLISHED"
            ),

            completed: getGroupCount(
                drawStats,
                "status",
                "COMPLETED"
            ),
        },

        winners: {
            total: winnerStats.reduce(
                (total, group) => total + group._count._all,
                0
            ),

            pendingProof: getGroupCount(
                winnerStats,
                "status",
                "PENDING_PROOF"
            ),

            proofSubmitted: getGroupCount(
                winnerStats,
                "status",
                "PROOF_SUBMITTED"
            ),

            approved: getGroupCount(
                winnerStats,
                "status",
                "APPROVED"
            ),

            paid: getGroupCount(
                winnerStats,
                "status",
                "PAID"
            ),
        },

        charities: {
            total: totalCharities,
            active: activeCharities,
        },
    };
};

export const getAdminUsers = async ({
    page = 1,
    limit = 10,
    search = "",
}) => {
    const skip = (page - 1) * limit;

    const where = search
        ? {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ],
        }
        : {};

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                charityPercentage: true,
                createdAt: true,
                updatedAt: true,

                charity: {
                    select: {
                        id: true,
                        name: true,
                    },
                },

                subscriptions: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                    select: {
                        id: true,
                        plan: true,
                        status: true,
                        currentPeriodEnd: true,
                        cancelAtPeriodEnd: true,
                    },
                },
            },
        }),

        prisma.user.count({
            where,
        }),
    ]);

    return {
        users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getAdminSubscriptions = async ({
    page = 1,
    limit = 10,
    status = "",
    plan = "",
}) => {
    const skip = (page - 1) * limit;

    const where = {};

    if (status) {
        where.status = status;
    }

    if (plan) {
        where.plan = plan;
    }

    const [subscriptions, total] = await Promise.all([
        prisma.subscription.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                plan: true,
                status: true,
                currentPeriodStart: true,
                currentPeriodEnd: true,
                cancelAtPeriodEnd: true,
                stripeSubscriptionId: true,
                createdAt: true,
                updatedAt: true,

                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        }),

        prisma.subscription.count({
            where,
        }),
    ]);

    return {
        subscriptions,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getAdminDraws = async ({
    page = 1,
    limit = 10,
    status = "",
    mode = "",
}) => {
    const skip = (page - 1) * limit;

    const where = {};

    if (status) {
        where.status = status;
    }

    if (mode) {
        where.mode = mode;
    }

    const [draws, total] = await Promise.all([
        prisma.draw.findMany({
            where,
            skip,
            take: limit,
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
                randomSeed: true,
                algorithmVersion: true,
                createdAt: true,
                publishedAt: true,
                completedAt: true,

                _count: {
                    select: {
                        entries: true,
                        winners: true,
                    },
                },
            },
        }),

        prisma.draw.count({
            where,
        }),
    ]);

    return {
        draws,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getAdminWinners = async ({
    page = 1,
    limit = 10,
    status = "",
    tier = "",
}) => {
    const skip = (page - 1) * limit;

    const where = {};

    if (status) {
        where.status = status;
    }

    if (tier) {
        where.tier = tier;
    }

    const [winners, total] = await Promise.all([
        prisma.winner.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                drawId: true,
                userId: true,
                drawEntryId: true,
                tier: true,
                prizeAmount: true,
                status: true,
                verifiedAt: true,
                paidAt: true,
                createdAt: true,

                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                draw: {
                    select: {
                        id: true,
                        drawDate: true,
                        numbers: true,
                        mode: true,
                        status: true,
                    },
                },

                proofs: {
                    orderBy: {
                        uploadedAt: "desc",
                    },
                    take: 1,
                    select: {
                        id: true,
                        fileUrl: true,
                        rejectionReason: true,
                        uploadedAt: true,
                        reviewedAt: true,
                    },
                },
            },
        }),

        prisma.winner.count({
            where,
        }),
    ]);

    return {
        winners,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getAdminCharities = async ({
    page = 1,
    limit = 10,
    search = "",
    featured,
    active,
}) => {
    const skip = (page - 1) * limit;

    const where = {};

    if (search) {
        where.name = {
            contains: search,
            mode: "insensitive",
        };
    }

    if (featured !== undefined) {
        where.isFeatured = featured;
    }

    if (active !== undefined) {
        where.isActive = active;
    }

    const [charities, total] = await Promise.all([
        prisma.charity.findMany({
            where,
            skip,
            take: limit,
            orderBy: [
                {
                    isFeatured: "desc",
                },
                {
                    createdAt: "desc",
                },
            ],
            select: {
                id: true,
                name: true,
                description: true,
                imageUrl: true,
                websiteUrl: true,
                isFeatured: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,

                _count: {
                    select: {
                        users: true,
                    },
                },
            },
        }),

        prisma.charity.count({
            where,
        }),
    ]);

    return {
        charities,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getAdminReports = async () => {
    const [
        totalUsers,
        activeSubscribers,
        totalSubscriptions,
        totalPrizePool,
        totalWinners,
        paidWinners,
        pendingPayoutAmount,
        charityStats,
    ] = await Promise.all([
        prisma.user.count(),

        prisma.subscription.count({
            where: {
                status: "ACTIVE",
            },
        }),

        prisma.subscription.count(),

        prisma.draw.aggregate({
            _sum: {
                prizePool: true,
            },
        }),

        prisma.winner.count(),

        prisma.winner.count({
            where: {
                status: "PAID",
            },
        }),

        prisma.winner.aggregate({
            _sum: {
                prizeAmount: true,
            },
            where: {
                status: {
                    not: "PAID",
                },
            },
        }),

        prisma.user.groupBy({
            by: ["charityId"],
            _count: {
                _all: true,
            },
            where: {
                charityId: {
                    not: null,
                },
            },
        }),
    ]);

    const charityIds = charityStats
        .map((item) => item.charityId)
        .filter(Boolean);

    const charities = await prisma.charity.findMany({
        where: {
            id: {
                in: charityIds,
            },
        },
        select: {
            id: true,
            name: true,
        },
    });

    const charityMap = new Map(
        charities.map((charity) => [charity.id, charity.name])
    );

    return {
        users: {
            total: totalUsers,
            activeSubscribers,
        },

        subscriptions: {
            total: totalSubscriptions,
            active: activeSubscribers,
        },

        draws: {
            totalPrizePool: totalPrizePool._sum.prizePool ?? 0,
        },

        winners: {
            total: totalWinners,
            paid: paidWinners,
            pendingPayoutAmount:
                pendingPayoutAmount._sum.prizeAmount ?? 0,
        },

        charities: charityStats.map((item) => ({
            charityId: item.charityId,
            charityName: charityMap.get(item.charityId) ?? "Unknown",
            users: item._count._all,
        })),
    };
};