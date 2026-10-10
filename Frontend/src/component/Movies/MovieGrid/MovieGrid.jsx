
import React from "react";
import MovieCard from "./MovieCard";
import "./MovieGrid.css";

const MovieGrid = ({ movies = [] }) => {
    if (movies.length === 0) {
        return (
            <div className="pp-movie-grid-empty">
                <div className="pp-movie-grid-empty-icon">🎬</div>
                <h3>No movies found</h3>
                <p>
                    Try changing your filters to discover more movies.
                </p>
            </div>
        );
    }

    return (
        <div className="pp-movie-grid">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
};

export default MovieGrid;
