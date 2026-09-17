import {
    submitWinnerProof,
    reviewWinnerProof,
    markWinnerAsPaid,
    uploadWinnerProof,
    getMyWinnings
} from "../services/winner.service.js";

export const submitWinnerProofController = async (req, res, next) => {
    try {
        const { winnerId } = req.params;
        const { fileUrl } = req.body;

        const proof = await submitWinnerProof({
            winnerId,
            userId: req.user.userId,
            fileUrl,
        });

        return res.status(201).json({
            success: true,
            message: "Winner proof submitted successfully",
            data: proof,
        });
    } catch (error) {
        next(error);
    }
};

export const reviewWinnerProofController = async (req, res, next) => {
    try {
        const { winnerId } = req.params;
        const { status, rejectionReason } = req.body;

        const winner = await reviewWinnerProof({
            winnerId,
            status,
            rejectionReason,
        });

        return res.status(200).json({
            success: true,
            message: `Winner proof ${status.toLowerCase()} successfully`,
            data: winner,
        });
    } catch (error) {
        next(error);
    }
};

export const markWinnerAsPaidController = async (req, res, next) => {
    try {
        const { winnerId } = req.params;

        const winner = await markWinnerAsPaid(winnerId);

        return res.status(200).json({
            success: true,
            message: "Winner marked as paid successfully",
            data: winner,
        });
    } catch (error) {
        next(error);
    }
};

export const uploadWinnerProofController = async (req, res, next) => {
    try {
        const { winnerId } = req.params;

        const proof = await uploadWinnerProof({
            winnerId,
            userId: req.user.userId,
            file: req.file,
        });

        return res.status(201).json({
            success: true,
            message: "Winner proof uploaded successfully",
            data: proof,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyWinningsController = async (req, res, next) => {
    try {
        const winners = await getMyWinnings(req.user.userId);

        return res.status(200).json({
            success: true,
            message: "User winnings fetched successfully",
            data: {
                winners,
            },
        });
    } catch (error) {
        next(error);
    }
};