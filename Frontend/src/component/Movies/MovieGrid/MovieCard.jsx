
import React from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";

const MovieCard = ({ movie }) => {
    if (!movie) return null;

    const isUpcoming = movie.isUpcoming || Boolean(movie.releaseDate);

    return (
        <Link
            to={`/movie/${movie.id}`}
            className="pp-movie-card"
            aria-label={`View details for ${movie.title}`}
        >
            <div className="pp-movie-card-poster">
                <img
                    src={movie.image}
                    alt={`${movie.title} poster`}
                    loading="lazy"
                />

                {isUpcoming && movie.releaseDate ? (
                    <div className="pp-movie-card-release-date">
                        {movie.releaseDate}
                    </div>
                ) : (
                    movie.rating && (
                        <div className="pp-movie-card-rating">
                            <span className="pp-movie-card-star">★</span>
                            <span className="pp-movie-card-rating-value">
                                {movie.rating}/10
                            </span>
                            {movie.votes && (
                                <span className="pp-movie-card-votes">
                                    {movie.votes}
                                </span>
                            )}
                        </div>
                    )
                )}
            </div>

            <div className="pp-movie-card-details">
                <h3>{movie.title}</h3>

                {isUpcoming ? (
                    <div className="pp-movie-card-upcoming-info">
                        {movie.genres && (
                            <p className="pp-movie-card-genres">
                                {Array.isArray(movie.genres)
                                    ? movie.genres.join("/")
                                    : movie.genres}
                            </p>
                        )}
                        {movie.likes && (
                            <div className="pp-movie-card-likes">

                                <span>{movie.likes}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="pp-movie-card-meta">
                        {movie.certificate && (
                            <span>{movie.certificate}</span>
                        )}

                        {movie.certificate && movie.language && (
                            <span className="pp-movie-card-dot">·</span>
                        )}

                        {movie.language && (
                            <span>{movie.language}</span>
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default MovieCard;
