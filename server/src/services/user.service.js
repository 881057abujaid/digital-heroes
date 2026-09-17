import prisma from "../lib/prisma.js";

export const updateUserCharity = async ({
    userId,
    charityId,
    charityPercentage,
}) => {
    const charity = await prisma.charity.findFirst({
        where: {
            id: charityId,
            isActive: true,
        },
        select: {
            id: true,
            name: true,
        },
    });

    if (!charity) {
        const error = new Error("Charity not found or inactive");
        error.statusCode = 404;
        throw error;
    }

    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            charityId,
            charityPercentage,
        },
        select: {
            id: true,
            name: true,
            email: true,
            charityId: true,
            charityPercentage: true,
            updatedAt: true,
        },
    });

    return {
        user,
        charity,
    };
};