import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ALL_SYSTEM_MOVIES, MOVIE_DETAILS } from "../utils/movieData";
import {
    getCinemasForMovie,
    getShowtimesForCinemaAndMovie,
} from "../utils/cinemaData";
import "./MovieShowtimes.css";

// 7-day calendar matching user screenshot
const DATES_LIST = [
    { day: "SUN", date: "11", month: "OCT", full: "Sun, 11 Oct 2026", isAvailable: true },
    { day: "MON", date: "12", month: "OCT", full: "Mon, 12 Oct 2026", isAvailable: true },
    { day: "TUE", date: "13", month: "OCT", full: "Tue, 13 Oct 2026", isAvailable: true },
    { day: "WED", date: "14", month: "OCT", full: "Wed, 14 Oct 2026", isAvailable: true },
    { day: "THU", date: "15", month: "OCT", full: "Thu, 15 Oct 2026", isAvailable: true },
    { day: "FRI", date: "16", month: "OCT", full: "Fri, 16 Oct 2026", isAvailable: true },
    { day: "SAT", date: "17", month: "OCT", full: "Sat, 17 Oct 2026", isAvailable: true },
];

const MovieShowtimes = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(DATES_LIST[0]);
    const [priceFilter, setPriceFilter] = useState("all");
    const [timeFilter, setTimeFilter] = useState("all");
    const [searchCinemaQuery, setSearchCinemaQuery] = useState("");
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [favorites, setFavorites] = useState({});
    const [selectedCity, setSelectedCity] = useState(
        () => localStorage.getItem("selectedCity") || "Belagavi (Belgaum)"
    );

    // Listen for city changes
    useEffect(() => {
        const handleCityChange = () => {
            const city = localStorage.getItem("selectedCity");
            if (city && city !== "Location") {
                setSelectedCity(city);
            }
        };
        window.addEventListener("cityChange", handleCityChange);
        window.addEventListener("storage", handleCityChange);
        return () => {
            window.removeEventListener("cityChange", handleCityChange);
            window.removeEventListener("storage", handleCityChange);
        };
    }, []);

    const movie =
        ALL_SYSTEM_MOVIES.find((m) => m.id === id) ||
        ALL_SYSTEM_MOVIES.find((m) => m.id === "drishyam-2") ||
        ALL_SYSTEM_MOVIES[0];

    const details = MOVIE_DETAILS[movie.id] || {};
    const duration = details.duration || "2h 30m";
    const certificate = movie.certificate ? (movie.certificate.includes("16") ? movie.certificate : `${movie.certificate}16+`) : "UA16+";
    const genres = Array.isArray(movie.genres) ? movie.genres : [movie.genres || "Drama"];

    const toggleFavorite = (cinemaId) => {
        setFavorites((prev) => ({ ...prev, [cinemaId]: !prev[cinemaId] }));
    };

    // Filter cinemas in city that screen this movie
    const cityCinemas = getCinemasForMovie(movie.id, selectedCity);

    const filteredCinemas = cityCinemas.filter((cinema) => {
        if (!searchCinemaQuery.trim()) return true;
        const q = searchCinemaQuery.toLowerCase().trim();
        return (
            cinema.name.toLowerCase().includes(q) ||
            cinema.address.toLowerCase().includes(q)
        );
    });

    const filterShowtimes = (showtimes) => {
        return showtimes.filter((st) => {
            // Price filter
            if (priceFilter === "0-200") {
                const minPrice = Math.min(st.prices?.silver || 200, st.prices?.gold || 220);
                if (minPrice > 200) return false;
            } else if (priceFilter === "201-300") {
                const maxPrice = st.prices?.sofa || 250;
                if (maxPrice > 300) return false;
            }

            // Time filter
            if (timeFilter !== "all") {
                const hour = parseInt(st.time.split(":")[0]);
                const isPM = st.time.includes("PM");
                let militaryHour = hour;
                if (isPM && hour !== 12) militaryHour += 12;
                if (!isPM && hour === 12) militaryHour = 0;

                if (timeFilter === "morning" && militaryHour >= 12) return false;
                if (timeFilter === "afternoon" && (militaryHour < 12 || militaryHour >= 16)) return false;
                if (timeFilter === "evening" && (militaryHour < 16 || militaryHour >= 20)) return false;
                if (timeFilter === "night" && militaryHour < 20) return false;
            }

            return true;
        });
    };

    const handleSelectShowtime = (cinema, st, allShowtimes) => {
        const bookingInfo = {
            movieTitle: movie.title,
            movieId: movie.id,
            movieLang: movie.language,
            cinemaId: cinema.id,
            cinemaName: cinema.name,
            cinemaAddress: cinema.address,
            cinema: cinema,
            date: selectedDate.full,
            showtime: st.time,
            sound: st.sound || "",
            prices: st.prices || { sofa: 250, platinum: 220, gold: 220, silver: 200 },
            availableShowtimes: allShowtimes,
            fromMovieShowtimes: true,
            fromCinema: false,
        };

        sessionStorage.setItem("bookingState", JSON.stringify(bookingInfo));
        sessionStorage.setItem("fromMovieShowtimes", "true");
        sessionStorage.setItem("lastMovieId", movie.id);
        sessionStorage.removeItem("fromCinema");

        navigate("/booking", {
            state: {
                fromMovieShowtimes: true,
                fromCinema: false,
                movieId: movie.id,
                cinemaId: cinema.id,
                cinema: cinema,
                showtime: st.time,
                availableShowtimes: allShowtimes,
            },
        });
    };

    return (
        <div className="movie-showtimes-page">
            {/* Top Movie Header matching screenshot */}
            <header className="showtimes-movie-header">
                <div className="showtimes-header-inner">
                    <div className="showtimes-title-block">
                        <Link to={`/movie/${movie.id}`} className="showtimes-back-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="showtimes-movie-title">
                            {movie.title} - ({movie.language})
                        </h1>
                    </div>

                    <div className="showtimes-badge-row">
                        <span className="movie-meta-pill">Movie runtime: {duration}</span>
                        <span className="movie-meta-pill cert-pill">{certificate}</span>
                        {genres.map((g) => (
                            <span key={g} className="movie-meta-pill genre-pill">
                                {g}
                            </span>
                        ))}
                    </div>
                </div>
            </header>

            {/* Date Carousel & Filter Bar */}
            <div className="showtimes-sticky-controls">
                <div className="showtimes-controls-inner">
                    {/* Left: Horizontal Date Picker */}
                    <div className="showtimes-date-picker">
                        {DATES_LIST.map((d) => {
                            const isSelected = selectedDate.date === d.date;
                            return (
                                <button
                                    key={d.date}
                                    type="button"
                                    className={`showtimes-date-tab ${isSelected ? "active" : ""}`}
                                    onClick={() => setSelectedDate(d)}
                                >
                                    <span className="date-tab-day">{d.day}</span>
                                    <span className="date-tab-num">{d.date}</span>
                                    <span className="date-tab-month">{d.month}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right: Filters & Search */}
                    <div className="showtimes-filter-controls">
                        <div className="format-indicator-pill">
                            {movie.language} - 2D
                        </div>

                        {/* Price Range Filter */}
                        <div className="filter-select-wrapper">
                            <select
                                className="filter-select-btn"
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                            >
                                <option value="all">Price Range</option>
                                <option value="0-200">₹0 - ₹200</option>
                                <option value="201-300">₹201 - ₹300</option>
                            </select>
                        </div>

                        {/* Preferred Time Filter */}
                        <div className="filter-select-wrapper">
                            <select
                                className="filter-select-btn"
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                            >
                                <option value="all">Preferred Time</option>
                                <option value="morning">Morning (Before 12 PM)</option>
                                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                                <option value="evening">Evening (4 PM - 8 PM)</option>
                                <option value="night">Night (After 8 PM)</option>
                            </select>
                        </div>

                        {/* Search Theatres Icon */}
                        <div className="showtimes-search-wrapper">
                            {showSearchInput ? (
                                <input
                                    type="text"
                                    className="showtimes-search-input"
                                    placeholder="Search cinema..."
                                    autoFocus
                                    value={searchCinemaQuery}
                                    onChange={(e) => setSearchCinemaQuery(e.target.value)}
                                    onBlur={() => !searchCinemaQuery && setShowSearchInput(false)}
                                />
                            ) : (
                                <button
                                    type="button"
                                    className="showtimes-search-btn"
                                    onClick={() => setShowSearchInput(true)}
                                    title="Search cinema"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Legend Bar matching screenshot */}
            <div className="showtimes-status-legend">
                <div className="showtimes-legend-inner">
                    <span className="legend-dot available"></span>
                    <span className="legend-label">AVAILABLE</span>
                    <span className="legend-dot fast"></span>
                    <span className="legend-label">FAST FILLING</span>
                </div>
            </div>

            {/* Theaters List Container */}
            <main className="showtimes-theaters-container">
                {filteredCinemas.length === 0 ? (
                    <div className="no-theaters-found">
                        <h3>No cinemas found matching your search in {selectedCity}</h3>
                        <p>Try clearing your search query or selecting a different date/filter.</p>
                    </div>
                ) : (
                    <div className="theaters-list">
                        {filteredCinemas.map((cinema) => {
                            const allShowtimes = getShowtimesForCinemaAndMovie(cinema.id, movie.id);
                            const visibleShowtimes = filterShowtimes(allShowtimes);
                            const isFav = Boolean(favorites[cinema.id]);
                            const isNonCancellable = cinema.id === "kapeel-nucleus";

                            return (
                                <div key={cinema.id} className="theater-row-card">
                                    {/* Left: Cinema Info & Policies */}
                                    <div className="theater-info-col">
                                        <div className="theater-title-row">
                                            {/* Cinema Logo / Icon Badge */}
                                            {cinema.name.includes("INOX") ? (
                                                <div className="cinema-logo-badge inox-badge">
                                                    INOX
                                                </div>
                                            ) : (
                                                <div className="cinema-logo-badge generic-badge">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                                        <line x1="8" y1="21" x2="16" y2="21"></line>
                                                        <line x1="12" y1="17" x2="12" y2="21"></line>
                                                    </svg>
                                                </div>
                                            )}

                                            <h3 className="theater-name">
                                                {cinema.name}
                                                <span className="info-icon" title={cinema.address}>
                                                    ⓘ
                                                </span>
                                            </h3>

                                            {/* Favorite Heart Icon */}
                                            <button
                                                type="button"
                                                className={`theater-fav-btn ${isFav ? "active" : ""}`}
                                                onClick={() => toggleFavorite(cinema.id)}
                                                title={isFav ? "Remove favorite" : "Add to favorites"}
                                            >
                                                {isFav ? "♥" : "♡"}
                                            </button>
                                        </div>

                                        <p className="theater-cancellation-text">
                                            {isNonCancellable ? "Non-cancellable" : "Cancellation available"}
                                        </p>

                                        {/* Amenity Icons: Wheelchair & F&B */}
                                        <div className="theater-amenities-row">
                                            <span className="amenity-icon" title="Wheelchair Accessible">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="4" r="2"></circle>
                                                    <path d="M5 11l4-2 3 6 4-2"></path>
                                                    <path d="M6 19a4 4 0 0 0 4-4"></path>
                                                </svg>
                                            </span>
                                            <span className="amenity-icon" title="Food & Beverage Available">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                                                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                                                    <line x1="6" y1="1" x2="6" y2="4"></line>
                                                    <line x1="10" y1="1" x2="10" y2="4"></line>
                                                    <line x1="14" y1="1" x2="14" y2="4"></line>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Showtime Buttons Grid */}
                                    <div className="theater-showtimes-col">
                                        {visibleShowtimes.length === 0 ? (
                                            <span className="no-showtimes-msg">No shows available for current filters</span>
                                        ) : (
                                            visibleShowtimes.map((st) => {
                                                const isFast = st.status === "fast";
                                                const isAvailable = st.status === "available";

                                                return (
                                                    <button
                                                        key={st.time}
                                                        type="button"
                                                        className={`showtime-ticket-pill ${isFast ? "fast-filling" : isAvailable ? "available" : ""}`}
                                                        onClick={() => handleSelectShowtime(cinema, st, allShowtimes)}
                                                        title={`Book ${st.time} at ${cinema.name}`}
                                                    >
                                                        <span className="showtime-time-text">{st.time}</span>
                                                        {st.sound && <span className="showtime-sound-tag">{st.sound}</span>}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MovieShowtimes;
