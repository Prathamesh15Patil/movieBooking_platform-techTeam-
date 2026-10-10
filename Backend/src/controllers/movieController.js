import Movie from "../models/Movie.js";

export const getMovies = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) filter.$text = { $search: search }; // uses your text index on title

    const movies = await Movie.find(filter).sort({ releaseDate: -1 });
    res.json(movies);
  } catch (err) {
    next(err);
  }
};

// GET /api/movies/:movieId
export const getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (err) {
    next(err);
  }
};

// POST /api/movies (admin)
export const addMovie = async (req, res, next) => {
  try {
    const { title, description, duration, genres, languages, releaseDate, status, assetKey } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });

    const movie = await Movie.create({
      title, description, duration, genres, languages, releaseDate, status, assetKey,
    });
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
};