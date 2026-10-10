import Show from "../models/Show.js";
import Theatre from "../models/Theatre.js";

// GET /api/movies/:movieId/shows
export const getShowsForMovie = async (req, res, next) => {
  try {
    const shows = await Show.find({
      movie: req.params.movieId,
      startTime: { $gte: new Date() },
    })
      .select("-seats")
      .populate("theater")
      .sort({ startTime: 1 });
    res.json(shows);
  } catch (err) {
    next(err);
  }
};

// GET /api/shows/:showId
export const getShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.showId)
      .select("-seats")
      .populate("movie")
      .populate("theater");
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.json(show);
  } catch (err) {
    next(err);
  }
};

// POST /api/shows (admin)
export const createShow = async (req, res, next) => {
  try {
    const { movie, theater, startTime, language, ticketPrice } = req.body;
    if (!movie || !theater || !startTime || !ticketPrice) {
      return res.status(400).json({ message: "movie, theater, startTime and ticketPrice are required" });
    }

    const theatre = await Theatre.findById(theater);
    if (!theatre) return res.status(404).json({ message: "Theatre not found" });

    // Rows A, B, C... and columns 1..seatsPerRow
    const seats = [];
    for (let r = 0; r < theatre.totalRows; r++) {
      const row = String.fromCharCode(65 + r);
      for (let c = 1; c <= theatre.seatsPerRow; c++) {
        seats.push({ seatId: `${row}${c}` });
      }
    }

    const show = await Show.create({ movie, theater, startTime, language, ticketPrice, seats });
    res.status(201).json({ _id: show._id });
  } catch (err) {
    next(err);
  }
};

// GET /api/shows/:showId/seats
export const getSeats = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.showId).select("seats");
    if (!show) return res.status(404).json({ message: "Show not found" });

    res.json(show.seats.map(({ seatId, status }) => ({ seatId, status })));
  } catch (err) {
    next(err);
  }
};