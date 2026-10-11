import { Router } from "express";
import { protect, adminOnly } from "../middlewares/auth.js";
import { getShow, createShow, getSeats, getPrice } from "../controllers/showController.js";
import { lockSeats } from "../controllers/showController.js";

const router = Router();

router.get("/:showId", getShow);
router.get("/:showId/seats", getSeats);
router.get("/:showId/price", getPrice);
router.post("/", protect, adminOnly, createShow);
router.post("/:showId/seats/lock", protect, lockSeats);

export default router;