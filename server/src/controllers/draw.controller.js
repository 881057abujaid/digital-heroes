import {
  simulateDraw,
  generateDrawEntries,
  calculateDrawResults,
  createDrawWinners,
  publishDraw,
  completeDraw,
  getLatestSubscriberDraw
} from "../services/draw.service.js";

export const simulateDrawController = async (req, res, next) => {
  try {
    const { drawDate, mode } = req.body;

    const draw = await simulateDraw({
      drawDate,
      mode,
    });

    return res.status(201).json({
      success: true,
      message: "Draw simulated successfully",
      data: draw,
    });
  } catch (error) {
    next(error);
  }
};

export const generateDrawEntriesController = async (req, res, next) => {
  try {
    const { drawId } = req.params;

    const entries = await generateDrawEntries(drawId);

    return res.status(201).json({
      success: true,
      message: "Draw entries generated successfully",
      data: entries,
    });
  } catch (error) {
    next(error);
  }
};

export const calculateDrawResultsController = async (req, res, next) => {
  try {
    const { drawId } = req.params;

    const results = await calculateDrawResults(drawId);

    return res.status(200).json({
      success: true,
      message: "Draw results calculated successfully",
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export const createDrawWinnersController = async (req, res, next) => {
  try {
    const { drawId } = req.params;

    const winners = await createDrawWinners(drawId);

    return res.status(201).json({
      success: true,
      message: "Draw winners created successfully",
      data: winners,
    });
  } catch (error) {
    next(error);
  }
};

export const publishDrawController = async (req, res, next) => {
  try {
    const { drawId } = req.params;

    const draw = await publishDraw(drawId);

    return res.status(200).json({
      success: true,
      message: "Draw published successfully",
      data: draw,
    });
  } catch (error) {
    next(error);
  }
};

export const completeDrawController = async (req, res, next) => {
  try {
    const { drawId } = req.params;

    const draw = await completeDraw(drawId);

    return res.status(200).json({
      success: true,
      message: "Draw completed successfully",
      data: draw,
    });
  } catch (error) {
    next(error);
  }
};

export const getLatestDrawController = async (req, res, next) => {
  try {
    const draw = await getLatestSubscriberDraw(req.user?.userId);

    return res.status(200).json({
      success: true,
      message: "Latest draw fetched successfully",
      data: draw,
    });
  } catch (error) {
    next(error);
  }
};