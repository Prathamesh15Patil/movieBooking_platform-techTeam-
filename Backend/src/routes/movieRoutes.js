import { Router } from "express";
import { protect, adminOnly } from "../middlewares/auth.js";
import { getMovies, getMovie, addMovie } from "../controllers/movieController.js";
import { getShowsForMovie } from "../controllers/showController.js";

const router = Router();

router.get("/", getMovies);
router.get("/:movieId", getMovie);
router.get("/:movieId/shows", getShowsForMovie);
router.post("/", protect, adminOnly, addMovie);

export default router;