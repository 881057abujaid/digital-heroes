import {
    createScore,
    getMyScores,
    updateScore,
    deleteScore
} from "../services/score.service.js";

export const addScore = async (req, res, next) => {
    try {
        const score = await createScore({
            userId: req.user.userId,
            value: req.body.value,
            date: req.body.date,
        });

        return res.status(201).json({
            success: true,
            message: "Score added successfully",
            data: {
                score,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getScores = async (req, res, next) => {
    try {
        const scores = await getMyScores(req.user.userId);

        return res.status(200).json({
            success: true,
            data: {
                scores,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const editScore = async (req, res, next) => {
    try {
        const score = await updateScore({
            userId: req.user.userId,
            scoreId: req.params.id,
            value: req.body.value,
            date: req.body.date,
        });

        return res.status(200).json({
            success: true,
            message: "Score updated successfully",
            data: {
                score,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const removeScore = async (req, res, next) => {
    try {
        await deleteScore({
            userId: req.user.userId,
            scoreId: req.params.id,
        });

        return res.status(200).json({
            success: true,
            message: "Score deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};