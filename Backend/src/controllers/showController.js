import Show from "../models/Show.js";
import Theatre from "../models/Theatre.js";
import { calculatePrice } from "../utils/pricing.js";
import redis, { HOLD_SECONDS, requireRedis, seatLockKey } from "../db/redis.js";

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
    requireRedis();
    const show = await Show.findById(req.params.showId).select("seats");
    if (!show) return res.status(404).json({ message: "Show not found" });

    const locks = await redis.mGet(show.seats.map((s) => seatLockKey(show._id, s.seatId)));

    res.json(
      show.seats.map((s, i) => ({
        seatId: s.seatId,
        status: s.status === "AVAILABLE" && locks[i] ? "LOCKED" : s.status,
      }))
    );
  } catch (err) {
    next(err);
  }
};

// GET /api/shows/:showId/price?seats=2
export const getPrice = async (req, res, next) => {
  try {
    const count = parseInt(req.query.seats, 10);
    if (!count || count < 1) {
      return res.status(400).json({ message: "seats must be a positive number" });
    }

    const show = await Show.findById(req.params.showId).select("ticketPrice");
    if (!show) return res.status(404).json({ message: "Show not found" });

    res.json(calculatePrice(show.ticketPrice, count));
  } catch (err) {
    next(err);
  }
};

// POST /api/shows/:showId/seats/lock   body: { seats: ["A1", "A2"] }
export const lockSeats = async (req, res, next) => {
  try {
    requireRedis();
    const { showId } = req.params;
    const { seats } = req.body;

    if (!Array.isArray(seats) || seats.length === 0 || new Set(seats).size !== seats.length) {
      return res.status(400).json({ message: "Invalid seats" });
    }

    const show = await Show.findById(showId).select("seats");
    if (!show) return res.status(404).json({ message: "Show not found" });

    const status = new Map(show.seats.map((s) => [s.seatId, s.status]));
    if (!seats.every((s) => status.get(s) === "AVAILABLE")) {
      return res.status(409).json({ message: "One or more seats unavailable" });
    }

    const userId = req.user._id.toString();
    const taken = [];
    for (const seatId of seats) {
      const key = seatLockKey(showId, seatId);
      const ok = await redis.set(key, userId, { NX: true, EX: HOLD_SECONDS });
      if (!ok && (await redis.get(key)) !== userId) {
        if (taken.length) await redis.del(taken); // undo the ones we got
        return res.status(409).json({ message: "Someone else is holding one of those seats" });
      }
      taken.push(key);
    }

    res.json({ message: "Seats held", seats, expiresInSeconds: HOLD_SECONDS });
  } catch (err) {
    next(err);
  }
};
