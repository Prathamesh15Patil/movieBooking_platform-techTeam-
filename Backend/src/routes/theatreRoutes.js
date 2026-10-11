import { Router } from "express";
import { getTheatres, getTheatre } from "../controllers/theatreController.js";

const router = Router();

router.get("/", getTheatres);
router.get("/:theatreId", getTheatre);

export default router;