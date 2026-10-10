import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Searchbar.css";
import BorderGlow from "./Borderglow";
import { ALL_SYSTEM_MOVIES } from "../../utils/movieData";

const Searchbar = ({ onSearch, placeholder = "Search for movies...", onFocusChange }) => {
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
            navigate(`/movies?search=${encodeURIComponent(query.trim())}`);
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
                    {filteredMovies.length > 0 ? (
                        <div className="search-results-list">
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
                            <div
                                className="search-view-all"
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate(`/movies?search=${encodeURIComponent(query.trim())}`);
                                }}
                            >
                                View all results for "{query.trim()}" →
                            </div>
                        </div>
                    ) : (
                        <div className="search-no-results">
                            <span>🎬</span> No movies found matching "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Searchbar;
