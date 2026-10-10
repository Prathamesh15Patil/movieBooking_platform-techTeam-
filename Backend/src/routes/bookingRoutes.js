import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { createBooking, getMyBookings, getBooking } from "../controllers/bookingController.js";

const router = Router();

router.use(protect); // every booking route needs a logged-in user

router.post("/", createBooking);
router.get("/my", getMyBookings); // must stay above /:bookingId
router.get("/:bookingId", getBooking);

export default router;