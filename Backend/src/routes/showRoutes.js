import { Router } from "express";
import { protect, adminOnly } from "../middlewares/auth.js";
import { getShow, createShow, getSeats } from "../controllers/showController.js";

const router = Router();

router.get("/:showId", getShow);
router.get("/:showId/seats", getSeats);
router.post("/", protect, adminOnly, createShow);

export default router;