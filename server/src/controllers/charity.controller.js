import {
    getCharities,
    getCharityById,
} from "../services/charity.service.js";

export const listCharities = async (req, res, next) => {
    try {
        const search = req.query.search?.trim();

        const featured =
            req.query.featured === undefined
                ? undefined
                : req.query.featured === "true";

        const charities = await getCharities({
            search,
            featured,
        });

        return res.status(200).json({
            success: true,
            data: {
                charities,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getCharity = async (req, res, next) => {
    try {
        const charity = await getCharityById(req.params.id);

        return res.status(200).json({
            success: true,
            data: {
                charity,
            },
        });
    } catch (error) {
        next(error);
    }
};