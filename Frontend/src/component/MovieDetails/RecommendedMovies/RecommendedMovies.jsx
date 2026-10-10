import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ALL_SYSTEM_MOVIES, MOVIE_DETAILS } from "../../../utils/movieData";
import "./RecommendedMovies.css";

const IMAGE_INTERVAL = 2500;

const RecommendedMovies = ({ movieId }) => {
    const listRef = useRef(null);

    const rawRecommendedIds = MOVIE_DETAILS[movieId]?.recommendedIds ?? [];
    let recommendedMovies = rawRecommendedIds
        .map((id) => ALL_SYSTEM_MOVIES.find((movie) => movie.id === id))
        .filter(Boolean);

    if (recommendedMovies.length === 0) {
        recommendedMovies = ALL_SYSTEM_MOVIES.filter(
            (movie) => movie.id !== movieId
        ).slice(0, 6);
    }

    const [hoveredMovie, setHoveredMovie] = useState(null);
    const [activeImages, setActiveImages] = useState(
        () => recommendedMovies.map(() => 0)
    );
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        setActiveImages(recommendedMovies.map(() => 0));
        setCurrentIndex(0);
    }, [movieId, recommendedMovies.length]);

    useEffect(() => {
        if (hoveredMovie !== null || recommendedMovies.length === 0) return;

        const timer = window.setInterval(() => {
            setActiveImages((prev) =>
                prev.map((imgIdx, mIdx) => {
                    if (mIdx === currentIndex) {
                        const imgs = recommendedMovies[mIdx]?.images || [recommendedMovies[mIdx]?.image];
                        return (imgIdx + 1) % imgs.length;
                    }
                    return imgIdx;
                })
            );

            setCurrentIndex((prev) => (prev + 1) % recommendedMovies.length);
        }, IMAGE_INTERVAL);

        return () => window.clearInterval(timer);
    }, [currentIndex, hoveredMovie, recommendedMovies]);

    const scrollMovies = (direction) => {
        listRef.current?.scrollBy({
            left: direction * 300,
            behavior: "smooth",
        });
    };

    if (recommendedMovies.length === 0) return null;

    return (
        <section className="recommended-movies">
            <div className="recommended-movies-heading">
                <h2>You Might Also Like</h2>

            </div>

            <div className="recommended-movies-list" ref={listRef}>
                {recommendedMovies.map((movie, index) => {
                    const images = movie.images?.length ? movie.images : [movie.image];
                    const visibleImage = activeImages[index] % images.length;
                    const isHovered = hoveredMovie === movie.id;

                    const genreText = Array.isArray(movie.genres)
                        ? movie.genres.join(" / ")
                        : movie.genres || movie.language || "";

                    return (
                        <Link
                            className={`recommended-movie-card${isHovered ? " is-hovered" : ""}`}
                            to={`/movie/${movie.id}`}
                            key={movie.id}
                            onMouseEnter={() => setHoveredMovie(movie.id)}
                            onMouseLeave={() => setHoveredMovie(null)}
                        >
                            <div className="recommended-movie-poster">
                                {images.map((img, imgIdx) => (
                                    <img
                                        className={`recommended-movie-image${imgIdx === visibleImage ? " is-active" : ""}`}
                                        src={img}
                                        alt={movie.title}
                                        key={`${img}-${imgIdx}`}
                                        loading="lazy"
                                    />
                                ))}

                                {movie.rating && (
                                    <div className="recommended-movie-rating">
                                        <span>★</span>
                                        <span>{movie.rating}</span>
                                        {movie.votes && (
                                            <span className="recommended-movie-votes">
                                                {movie.votes}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <h3>{movie.title}</h3>
                            <p>{genreText}</p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default RecommendedMovies;