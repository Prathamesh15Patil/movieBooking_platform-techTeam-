import Theatre from "../models/Theatre.js";

// GET /api/theatres
export const getTheatres = async (req, res, next) => {
  try {
    res.json(await Theatre.find());
  } catch (err) {
    next(err);
  }
};

// GET /api/theatres/:theatreId
export const getTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.theatreId);
    if (!theatre) return res.status(404).json({ message: "Theatre not found" });
    res.json(theatre);
  } catch (err) {
    next(err);
  }
};