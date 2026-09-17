import prisma from "../lib/prisma.js";

export const createScore = async ({ userId, value, date }) => {
    const scoreDate = new Date(`${date}T00:00:00.000Z`);

    const existingScore = await prisma.score.findUnique({
        where: {
            userId_date: {
                userId,
                date: scoreDate,
            },
        },
    });

    if (existingScore) {
        const error = new Error(
            "A score already exists for this date"
        );

        error.statusCode = 409;
        throw error;
    }

    const totalScores = await prisma.score.count({
        where: {
            userId,
        },
    });

    if (totalScores >= 5) {
        const oldestScore = await prisma.score.findFirst({
            where: {
                userId,
            },
            orderBy: {
                date: "asc",
            },
        });

        if (oldestScore) {
            await prisma.score.delete({
                where: {
                    id: oldestScore.id,
                },
            });
        }
    }

    return prisma.score.create({
        data: {
            userId,
            value,
            date: scoreDate,
        },
        select: {
            id: true,
            value: true,
            date: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const getMyScores = async (userId) => {
    return prisma.score.findMany({
        where: {
            userId,
        },
        orderBy: {
            date: "desc",
        },
        take: 5,
        select: {
            id: true,
            value: true,
            date: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const updateScore = async ({
    userId,
    scoreId,
    value,
    date,
}) => {
    const score = await prisma.score.findUnique({
        where: {
            id: scoreId,
        },
    });

    if (!score || score.userId !== userId) {
        const error = new Error("Score not found");
        error.statusCode = 404;
        throw error;
    }

    const scoreDate = new Date(`${date}T00:00:00.000Z`);

    const existingScore = await prisma.score.findFirst({
        where: {
            userId,
            date: scoreDate,
            NOT: {
                id: scoreId,
            },
        },
    });

    if (existingScore) {
        const error = new Error(
            "A score already exists for this date"
        );

        error.statusCode = 409;
        throw error;
    }

    return prisma.score.update({
        where: {
            id: scoreId,
        },
        data: {
            value,
            date: scoreDate,
        },
        select: {
            id: true,
            value: true,
            date: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

export const deleteScore = async ({
    userId,
    scoreId,
}) => {
    const score = await prisma.score.findUnique({
        where: {
            id: scoreId,
        },
    });

    if (!score || score.userId !== userId) {
        const error = new Error("Score not found");
        error.statusCode = 404;
        throw error;
    }

    await prisma.score.delete({
        where: {
            id: scoreId,
        },
    });
};