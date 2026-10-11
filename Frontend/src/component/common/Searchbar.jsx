import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Searchbar.css";
import BorderGlow from "./Borderglow";
import { ALL_SYSTEM_MOVIES } from "../../utils/movieData";
import { searchAllCinemas } from "../../utils/cinemaData";

const Searchbar = ({ onSearch, placeholder = "Search for movies or cinemas...", onFocusChange }) => {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const handleFocus = () => {
        if (onFocusChange) onFocusChange(true);
        if (query.trim()) setIsOpen(true);
    };

    const handleBlur = () => {
        if (onFocusChange) onFocusChange(false);
    };

    const filteredMovies = query.trim()
        ? ALL_SYSTEM_MOVIES.filter((movie) => {
            const q = query.toLowerCase().trim();
            const titleMatch = movie.title.toLowerCase().includes(q);
            const langMatch = movie.language.toLowerCase().includes(q);
            const genreMatch = Array.isArray(movie.genres)
                ? movie.genres.some((g) => g.toLowerCase().includes(q))
                : movie.genres.toLowerCase().includes(q);
            return titleMatch || langMatch || genreMatch;
        })
        : [];

    const filteredCinemas = query.trim()
        ? searchAllCinemas(query.trim())
        : [];

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setIsOpen(true);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleClear = () => {
        setQuery("");
        setIsOpen(false);
        if (onSearch) {
            onSearch("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && query.trim()) {
            setIsOpen(false);
            if (onFocusChange) onFocusChange(false);
            if (filteredMovies.length === 0 && filteredCinemas.length > 0) {
                navigate(`/cinemas?cinema=${filteredCinemas[0].id}`);
            } else {
                navigate(`/movies?search=${encodeURIComponent(query.trim())}`);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
            if (onFocusChange) onFocusChange(false);
        }
    };

    const handleSelectMovie = (movieId) => {
        setIsOpen(false);
        setQuery("");
        if (onFocusChange) onFocusChange(false);
        navigate(`/movie/${movieId}`);
    };

    const handleSelectCinema = (cinemaId) => {
        setIsOpen(false);
        setQuery("");
        if (onFocusChange) onFocusChange(false);
        navigate(`/cinemas?cinema=${cinemaId}`);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                if (onFocusChange) onFocusChange(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onFocusChange]);

    return (
        <div className="searchbar-container" ref={containerRef}>
            <BorderGlow
                backgroundColor="#0f172a"
                borderRadius={10}
                glowRadius={25}
                coneSpread={25}
                colors={["#7c3aed", "#ec4899", "#38bdf8"]}
                fillOpacity={0.35}
            >
                <div className="searchbar">
                    {/* Search Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="search-icon"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                        />
                    </svg>

                    {/* Search Input */}
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                    />

                    {/* Clear Button */}
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            aria-label="Clear search"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="clear-icon"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </BorderGlow>

            {/* Live Search Results Dropdown */}
            {isOpen && query.trim().length > 0 && (
                <div className="search-dropdown">
                    {filteredMovies.length > 0 || filteredCinemas.length > 0 ? (
                        <div className="search-results-list">
                            {/* Movies Section */}
                            {filteredMovies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="search-result-item"
                                    onClick={() => handleSelectMovie(movie.id)}
                                >
                                    <img
                                        src={movie.image}
                                        alt={movie.title}
                                        className="search-result-poster"
                                    />
                                    <div className="search-result-info">
                                        <div className="search-result-title">{movie.title}</div>
                                        <div className="search-result-meta">
                                            <span>
                                                {Array.isArray(movie.genres)
                                                    ? movie.genres.join(" / ")
                                                    : movie.genres}
                                            </span>
                                            <span className="dot">•</span>
                                            <span>{movie.language}</span>
                                        </div>
                                    </div>
                                    <div className="search-result-badge">
                                        {movie.isUpcoming
                                            ? "Coming Soon"
                                            : `★ ${movie.rating}`}
                                    </div>
                                </div>
                            ))}

                            {/* Cinemas Section */}
                            {filteredCinemas.length > 0 && (
                                <>
                                    <div className="search-section-divider">
                                        <span>Cinemas & Theaters</span>
                                    </div>
                                    {filteredCinemas.slice(0, 5).map((cinema) => (
                                        <div
                                            key={cinema.id}
                                            className="search-result-item cinema-result-item"
                                            onClick={() => handleSelectCinema(cinema.id)}
                                        >
                                            <div className="search-result-cinema-icon">
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                                                    <line x1="7" y1="2" x2="7" y2="22" />
                                                    <line x1="17" y1="2" x2="17" y2="22" />
                                                    <line x1="2" y1="12" x2="22" y2="12" />
                                                    <line x1="2" y1="7" x2="7" y2="7" />
                                                    <line x1="2" y1="17" x2="7" y2="17" />
                                                    <line x1="17" y1="17" x2="22" y2="17" />
                                                    <line x1="17" y1="7" x2="22" y2="7" />
                                                </svg>
                                            </div>
                                            <div className="search-result-info">
                                                <div className="search-result-title">{cinema.name}</div>
                                                <div className="search-result-meta">
                                                    <span>{cinema.address}</span>
                                                    <span className="dot">•</span>
                                                    <span>{cinema.city}</span>
                                                </div>
                                            </div>
                                            <div className="search-result-badge cinema-pill-badge">
                                                Cinema Details ›
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}

                            {filteredMovies.length > 0 && (
                                <div
                                    className="search-view-all"
                                    onClick={() => {
                                        setIsOpen(false);
                                        navigate(`/movies?search=${encodeURIComponent(query.trim())}`);
                                    }}
                                >
                                    View all movie results for "{query.trim()}" →
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="search-no-results">
                            <span>🎬</span> No movies or cinemas found matching "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Searchbar;
