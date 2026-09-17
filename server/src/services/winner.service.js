import prisma from "../lib/prisma.js";
import supabase from "../lib/supabase.js";

export const submitWinnerProof = async ({
    winnerId,
    userId,
    fileUrl,
}) => {
    const winner = await prisma.winner.findUnique({
        where: {
            id: winnerId,
        },
    });

    if (!winner) {
        throw new Error("Winner not found");
    }

    if (winner.userId !== userId) {
        throw new Error("You are not allowed to submit proof for this winner");
    }

    if (winner.status === "PAID") {
        throw new Error("Winner has already been paid");
    }

    const proof = await prisma.winnerProof.create({
        data: {
            winnerId,
            fileUrl,
        },
    });

    await prisma.winner.update({
        where: {
            id: winnerId,
        },
        data: {
            status: "PROOF_SUBMITTED",
        },
    });

    return proof;
};

export const reviewWinnerProof = async ({
    winnerId,
    status,
    rejectionReason,
}) => {
    const winner = await prisma.winner.findUnique({
        where: {
            id: winnerId,
        },
        include: {
            proofs: {
                orderBy: {
                    uploadedAt: "desc",
                },
                take: 1,
            },
        },
    });

    if (!winner) {
        throw new Error("Winner not found");
    }

    if (winner.status !== "PROOF_SUBMITTED") {
        throw new Error("Winner proof is not awaiting review");
    }

    if (!winner.proofs.length) {
        throw new Error("Winner proof not found");
    }

    if (status === "REJECTED" && !rejectionReason?.trim()) {
        throw new Error("Rejection reason is required");
    }

    const now = new Date();

    const updatedWinner = await prisma.winner.update({
        where: {
            id: winnerId,
        },
        data: {
            status,
            verifiedAt: status === "APPROVED" ? now : null,
        },
    });

    await prisma.winnerProof.update({
        where: {
            id: winner.proofs[0].id,
        },
        data: {
            rejectionReason:
                status === "REJECTED" ? rejectionReason.trim() : null,
            reviewedAt: now,
        },
    });

    return updatedWinner;
};

export const markWinnerAsPaid = async (winnerId) => {
    const winner = await prisma.winner.findUnique({
        where: {
            id: winnerId,
        },
    });

    if (!winner) {
        throw new Error("Winner not found");
    }

    if (winner.status !== "APPROVED") {
        throw new Error("Only approved winners can be marked as paid");
    }

    const updatedWinner = await prisma.winner.update({
        where: {
            id: winnerId,
        },
        data: {
            status: "PAID",
            paidAt: new Date(),
        },
    });

    return updatedWinner;
};

export const uploadWinnerProof = async ({
    winnerId,
    userId,
    file,
}) => {
    const winner = await prisma.winner.findUnique({
        where: {
            id: winnerId,
        },
    });

    if (!winner) {
        throw new Error("Winner not found");
    }

    if (winner.userId !== userId) {
        throw new Error("You are not allowed to submit proof for this winner");
    }

    if (!["PENDING_PROOF", "REJECTED"].includes(winner.status)) {
        throw new Error("Winner proof cannot be uploaded at this stage");
    }

    if (!file) {
        throw new Error("Proof image is required");
    }

    const extension = file.originalname
        .split(".")
        .pop()
        .toLowerCase();

    const filePath = `winners/${winnerId}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
        .from("winner-proofs")
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });

    if (uploadError) {
        throw new Error(uploadError.message);
    }

    const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
            .from("winner-proofs")
            .createSignedUrl(filePath, 60 * 60);

    if (signedUrlError) {
        throw new Error(signedUrlError.message);
    }

    const proof = await prisma.winnerProof.create({
        data: {
            winnerId,
            fileUrl: signedUrlData.signedUrl,
        },
    });

    await prisma.winner.update({
        where: {
            id: winnerId,
        },
        data: {
            status: "PROOF_SUBMITTED",
        },
    });

    return proof;
};

export const getMyWinnings = async (userId) => {
    return prisma.winner.findMany({
        where: {
            userId,
        },
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
            draw: {
                select: {
                    id: true,
                    drawDate: true,
                    numbers: true,
                    mode: true,
                    status: true,
                },
            },
            drawEntry: {
                select: {
                    id: true,
                    numbers: true,
                    matchedCount: true,
                    tier: true,
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
    });
};