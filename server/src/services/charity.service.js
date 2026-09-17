import prisma from "../lib/prisma.js";

export const getCharities = async ({
    search,
    featured,
}) => {
    const where = {
        isActive: true,
    };

    if (search) {
        where.name = {
            contains: search,
            mode: "insensitive",
        };
    }

    if (featured !== undefined) {
        where.isFeatured = featured;
    }

    return prisma.charity.findMany({
        where,
        orderBy: [
            {
                isFeatured: "desc",
            },
            {
                name: "asc",
            },
        ],
        select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            websiteUrl: true,
            isFeatured: true,
        },
    });
};

export const getCharityById = async (charityId) => {
    const charity = await prisma.charity.findFirst({
        where: {
            id: charityId,
            isActive: true,
        },
        select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            websiteUrl: true,
            isFeatured: true,
        },
    });

    if (!charity) {
        const error = new Error("Charity not found");
        error.statusCode = 404;
        throw error;
    }

    return charity;
};