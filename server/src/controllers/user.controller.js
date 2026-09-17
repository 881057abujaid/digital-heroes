import { updateUserCharity } from "../services/user.service.js";

export const updateCharity = async (req, res, next) => {
    try {
        const result = await updateUserCharity({
            userId: req.user.userId,
            charityId: req.body.charityId,
            charityPercentage: req.body.charityPercentage,
        });

        return res.status(200).json({
            success: true,
            message: "Charity preferences updated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};