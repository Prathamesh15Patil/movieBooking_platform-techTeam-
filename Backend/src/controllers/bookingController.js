import crypto from "crypto";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendTicketEmail from "../utils/sendTicketEmail.js";
import { calculatePrice } from "../utils/pricing.js";
import redis, { requireRedis, seatLockKey } from "../db/redis.js";

const showPopulate = {
  path: "show",
  select: "-seats",
  populate: [{ path: "movie" }, { path: "theater" }],
};

// This is the "Pay" button
export const createBooking = async (req, res, next) => {
  try {
    requireRedis();
    const { show: showId, seats } = req.body;

    const validSeats =
      Array.isArray(seats) && seats.length > 0 && new Set(seats).size === seats.length;
    if (!validSeats) return res.status(400).json({ message: "Invalid seats" });

    const show = await Show.findById(showId)
      .select("startTime ticketPrice movie theater seats.seatId")
      .populate("movie", "title")
      .populate("theater", "name location screenName");
    if (!show) return res.status(404).json({ message: "Show not found" });
    if (show.startTime < new Date()) {
      return res.status(400).json({ message: "Show has already started" });
    }

    const existing = new Set(show.seats.map((s) => s.seatId));
    if (!seats.every((s) => existing.has(s))) {
      return res.status(400).json({ message: "One or more seats don't exist in this show" });
    }

    const price = calculatePrice(show.ticketPrice, seats.length);

    const locks = await redis.mGet(seats.map((s) => seatLockKey(showId, s)));
    if (!locks.every((v) => v === req.user._id.toString())) {
      return res.status(409).json({ message: "Seats not held by you, or your hold expired" });
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

    let booking;
    try {
      booking = await Booking.create({
        user: req.user._id,
        show: showId,
        seatsBooked: seats,
        totalAmount: price.total,
        subtotal: price.subtotal,
        discount: price.discount,
        offerName: price.offer,
        paymentStatus: "Paid",
        paymentId: `PAY-${crypto.randomBytes(5).toString("hex").toUpperCase()}`,
      });
    } catch (err) {
      // booking failed after seats were taken: release them
      await Show.updateOne(
        { _id: showId },
        { $set: { "seats.$[s].status": "AVAILABLE" } },
        { arrayFilters: [{ "s.seatId": { $in: seats } }] }
      );
      throw err;
    }

     await redis.del(seats.map((s) => seatLockKey(showId, s)));

    req.app.get("io")?.to(`show:${showId}`).emit("seatsBooked", { showId, seats });

    // not awaited: a slow or failed email must not delay or undo a paid booking
    sendTicketEmail({ to: req.user.email, name: req.user.name, booking, show })
      .catch((err) => console.error("Ticket email failed:", err.message));

    res.status(201).json(booking);
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