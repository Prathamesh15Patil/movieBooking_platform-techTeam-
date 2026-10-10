import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ALL_SYSTEM_MOVIES, MOVIE_DETAILS } from "../utils/movieData";

import HeroSection from "../component/MovieDetails/HeroSection/HeroSection";
import AboutMovie from "../component/MovieDetails/AboutMovie/AboutMovie";
import RecommendedMovies from "../component/MovieDetails/RecommendedMovies/RecommendedMovies";

import "./MovieDetail.css";

const MovieDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const movie = ALL_SYSTEM_MOVIES.find(
        (item) => item.id === id
    );

    const details = MOVIE_DETAILS[id];

    if (!movie) {
        return (
            <main className="movie-not-found">
                <h2>Movie not found</h2>
                <button onClick={() => navigate("/movies")}>
                    Browse Movies
                </button>
            </main>
        );
    }

    // Combine the basic movie data with its extra details.
    const completeMovie = {
        ...movie,
        details,
    };

    return (
        <main className="movie-detail-page">
            <HeroSection movie={completeMovie} />

            <AboutMovie
                movie={completeMovie}
                details={details}
            />

            <RecommendedMovies movieId={id} />
        </main>
    );
};

export default MovieDetail;
