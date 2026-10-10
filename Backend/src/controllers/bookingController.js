import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

const showPopulate = {
  path: "show",
  select: "-seats",
  populate: [{ path: "movie" }, { path: "theater" }],
};

// POST /api/bookings   body: { show: "<showId>", seats: ["A1", "A2"] }
export const createBooking = async (req, res, next) => {
  try {
    const { show: showId, seats } = req.body;

    const validSeats =
      Array.isArray(seats) && seats.length > 0 && new Set(seats).size === seats.length;
    if (!validSeats) return res.status(400).json({ message: "Invalid seats" });

    const show = await Show.findById(showId).select("startTime ticketPrice seats.seatId");
    if (!show) return res.status(404).json({ message: "Show not found" });
    if (show.startTime < new Date()) {
      return res.status(400).json({ message: "Show has already started" });
    }

    const existing = new Set(show.seats.map((s) => s.seatId));
    if (!seats.every((s) => existing.has(s))) {
      return res.status(400).json({ message: "One or more seats don't exist in this show" });
    }

    // Only succeeds if NONE of the requested seats is already taken
    const result = await Show.updateOne(
      {
        _id: showId,
        seats: { $not: { $elemMatch: { seatId: { $in: seats }, status: { $ne: "AVAILABLE" } } } },
      },
      { $set: { "seats.$[s].status": "BOOKED" } },
      { arrayFilters: [{ "s.seatId": { $in: seats } }] }
    );

    if (result.modifiedCount === 0) {
      return res.status(409).json({ message: "One or more seats already booked" });
    }

    try {
      const booking = await Booking.create({
        user: req.user._id,
        show: showId,
        seatsBooked: seats,
        totalAmount: show.ticketPrice * seats.length,
      });
      res.status(201).json(booking);
    } catch (err) {
      // booking failed after seats were taken: release them
      await Show.updateOne(
        { _id: showId },
        { $set: { "seats.$[s].status": "AVAILABLE" } },
        { arrayFilters: [{ "s.seatId": { $in: seats } }] }
      );
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/my
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate(showPopulate)
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// GET /api/bookings/:bookingId
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate(showPopulate);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not your booking" });
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
};