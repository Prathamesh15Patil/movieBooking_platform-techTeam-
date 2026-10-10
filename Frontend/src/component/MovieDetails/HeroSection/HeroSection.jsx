
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = ({ movie }) => {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);

    if (!movie) return null;

    const {
        id: movieId,
        title,
        language,
        certificate,
        rating,
        votes,
        releaseDate,
        image,
    } = movie;

    const {
        backdrop,
        video,
        duration,
        synopsis,
        shortDescription,
        tagline,
    } = movie.details || {};

    // Reload video whenever movie changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [movieId, video]);

    const heroDescription =
        shortDescription ||
        movie.shortDescription ||
        tagline ||
        (synopsis ? (synopsis.length > 140 ? synopsis.slice(0, 137) + "..." : synopsis) : "");

    const toggleMute = () => {
        if (videoRef.current) {
            const nextMuted = !videoRef.current.muted;
            videoRef.current.muted = nextMuted;
            setIsMuted(nextMuted);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    return (
        <section className="movie-hero">
            {/* Background trailer or fallback poster */}
            <div className="movie-hero-background">
                {video ? (
                    <video
                        key={movieId}
                        ref={videoRef}
                        className="movie-hero-video"
                        src={video}
                        autoPlay
                        muted={isMuted}
                        loop
                        playsInline
                        poster={backdrop || image}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    >
                        <source src={video} type="video/mp4" />
                    </video>
                ) : (
                    <img
                        className="movie-hero-poster"
                        src={backdrop || image}
                        alt={title}
                    />
                )}
            </div>

            <div className="movie-hero-overlay" />

            <div className="movie-hero-content">
                <span className="movie-hero-label">
                    {language || "Movie"}
                </span>

                <h1>{title}</h1>

                {heroDescription && (
                    <p className="movie-hero-short-desc">
                        {heroDescription}
                    </p>
                )}

                <div className="movie-hero-meta">
                    {certificate && <span>{certificate}</span>}
                    {duration && <span>{duration}</span>}
                    {releaseDate && <span>{releaseDate}</span>}
                    {rating && (
                        <span>
                            ★ {rating}
                            {votes ? ` · ${votes} ` : ""}
                        </span>
                    )}
                </div>

                <div className="movie-hero-actions">
                    <button
                        className="movie-book-button"
                        onClick={() => navigate("/booking")}
                    >
                        Book Tickets
                    </button>

                    {video && (
                        <>
                            <button
                                className="movie-trailer-button"
                                onClick={togglePlay}
                            >
                                {isPlaying ? "Pause Trailer" : "Play Trailer"}
                            </button>

                            <button
                                className="movie-sound-button"
                                onClick={toggleMute}
                                aria-label={isMuted ? "Unmute video" : "Mute video"}
                            >
                                {isMuted ? (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                            <line x1="23" y1="9" x2="17" y2="15"></line>
                                            <line x1="17" y1="9" x2="23" y2="15"></line>
                                        </svg>
                                        <span>Unmute</span>
                                    </>
                                ) : (
                                    <>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                        </svg>
                                        <span>Mute</span>
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

