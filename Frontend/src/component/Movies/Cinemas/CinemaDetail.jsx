import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ALL_SYSTEM_MOVIES } from "../../../utils/movieData";
import { SHOWTIMES_BY_MOVIE } from "../../../utils/cinemaData";
import { isShowtimePassed, isDateToday } from "../../../utils/timeUtils";
import "./CinemaDetail.css";

const DYNAMIC_FAST_FILLING = {
    // For Today (Date 11)
    "11": {
        "drishyam-2": ["06:45 PM"],
        "premada-oorali": ["03:45 PM", "09:15 PM"],
        "bail": ["02:30 PM"],
        "hanuman-ansh": ["05:00 PM"],
        "the-social-reckoning": ["09:30 PM"],
        "doremon-castle-undersea": ["10:30 AM"],
    },
    // For Tomorrow (Date 12)
    "12": {
        "drishyam-2": ["12:45 PM", "09:45 PM"],
        "premada-oorali": ["10:00 AM", "06:45 PM"],
        "bail": ["11:15 AM", "07:00 PM"],
        "hanuman-ansh": ["01:15 PM", "08:45 PM"],
        "the-social-reckoning": ["04:15 PM"],
        "doremon-castle-undersea": ["01:30 PM"],
    },
};

// Dynamic dates generator: Today and Tomorrow are active, rest are blocked
const DATES_LIST = [
    { day: "SUN", date: "11", month: "OCT", full: "Sun, 11 Oct 2026", isAvailable: true },
    { day: "MON", date: "12", month: "OCT", full: "Mon, 12 Oct 2026", isAvailable: true },
    { day: "TUE", date: "13", month: "OCT", full: "Tue, 13 Oct 2026", isAvailable: false },
    { day: "WED", date: "14", month: "OCT", full: "Wed, 14 Oct 2026", isAvailable: false },
    { day: "THU", date: "15", month: "OCT", full: "Thu, 15 Oct 2026", isAvailable: false },
];

const CinemaDetail = ({ cinema, onBack }) => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(DATES_LIST[0]);
    const [priceRangeFilter, setPriceRangeFilter] = useState("all");
    const [timingFilter, setTimingFilter] = useState("all");
    const [searchMovieQuery, setSearchMovieQuery] = useState("");
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [showFacilities, setShowFacilities] = useState(false);
    const [hoveredShowtime, setHoveredShowtime] = useState(null);
    const [isFav, setIsFav] = useState(false);

    if (!cinema) return null;

    const cinemaMovieIds = cinema.movieIds || [];
    const nowShowingMovies = ALL_SYSTEM_MOVIES.filter((m) => {
        if (m.isUpcoming) return false;
        if (cinemaMovieIds.length > 0) {
            return cinemaMovieIds.includes(m.id);
        }
        return true;
    });

    const handleSelectShowtime = (movie, showtime) => {
        const movieShowtimes = SHOWTIMES_BY_MOVIE[movie.id] || [];
        const bookingInfo = {
            movieTitle: movie.title,
            movieId: movie.id,
            movieImage: movie.image,
            movieLang: movie.language,
            cinemaId: cinema.id,
            cinemaName: cinema.name,
            cinemaAddress: cinema.address,
            cinema: cinema,
            date: selectedDate.full,
            showtime: showtime.time,
            sound: showtime.sound,
            prices: showtime.prices,
            availableShowtimes: movieShowtimes,
            fromCinema: true,
            fromMovieShowtimes: false,
        };
        sessionStorage.setItem("bookingState", JSON.stringify(bookingInfo));
        sessionStorage.setItem("fromCinema", "true");
        sessionStorage.setItem("lastCinemaId", cinema.id);
        sessionStorage.removeItem("fromMovieShowtimes");
        sessionStorage.removeItem("lastMovieId");

        navigate("/booking", {
            state: {
                ...bookingInfo,
            },
        });
    };

    const filterShowtimesByTiming = (showtimes) => {
        let list = showtimes;
        if (isDateToday(selectedDate)) {
            list = list.filter((st) => !isShowtimePassed(st.time, selectedDate));
        }
        if (timingFilter === "all") return list;
        return list.filter((st) => {
            const hour = parseInt(st.time.split(":")[0]);
            const isPM = st.time.includes("PM");
            let militaryHour = hour;
            if (isPM && hour !== 12) militaryHour += 12;
            if (!isPM && hour === 12) militaryHour = 0;

            if (timingFilter === "morning") return militaryHour < 12;
            if (timingFilter === "afternoon") return militaryHour >= 12 && militaryHour < 16;
            if (timingFilter === "evening") return militaryHour >= 16 && militaryHour < 20;
            if (timingFilter === "night") return militaryHour >= 20;
            return true;
        });
    };

    const filterShowtimesByPrice = (showtimes) => {
        if (priceRangeFilter === "all") return showtimes;
        return showtimes.filter((st) => {
            if (!st || !st.prices) return true;
            const priceVals = Object.values(st.prices);
            if (priceVals.length === 0) return true;
            const minPrice = Math.min(...priceVals);
            if (priceRangeFilter === "under200") return minPrice <= 200;
            if (priceRangeFilter === "200to250") return minPrice >= 200 && minPrice <= 250;
            if (priceRangeFilter === "above250") return minPrice > 250;
            return true;
        });
    };

    return (
        <div className="cinema-detail-page">
            <div className="cinema-detail-container">
                {/* Top Back Navigation */}
                <div className="cinema-detail-top-nav">
                    <button className="cinema-back-btn" onClick={onBack}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Cinemas
                    </button>
                </div>

                {/* Theater Header Block */}
                <div className="cinema-detail-header">
                    <div className="cinema-detail-header-left">
                        <div className="cinema-title-row">
                            <button
                                type="button"
                                className={`cinema-fav-toggle ${isFav ? "active" : ""}`}
                                onClick={() => setIsFav(!isFav)}
                                aria-label="Favorite"
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill={isFav ? "#ef4444" : "none"} stroke={isFav ? "#ef4444" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </button>
                            <h1 className="cinema-title-name">{cinema.name}</h1>
                            {cinema.screens && (
                                <span className="cinema-screen-badge header-badge">
                                    {cinema.screens} {cinema.screens === 1 ? "Screen" : "Screens"}
                                </span>
                            )}
                        </div>

                        <div className="cinema-location-row">
                            <svg className="location-pin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="cinema-location-text">{cinema.address}</span>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    cinema.name + " " + cinema.address
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cinema-direction-link"
                                title="Get Directions"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="7" y1="17" x2="17" y2="7" />
                                    <polyline points="7 7 17 7 17 17" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="cinema-detail-header-right">
                        <button
                            type="button"
                            className={`cinema-facilities-dropdown-btn ${showFacilities ? "active" : ""}`}
                            onClick={() => setShowFacilities(!showFacilities)}
                        >
                            Details
                            <svg className={`chevron-icon ${showFacilities ? "open" : ""}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Facilities Section matching exact user image */}
                {showFacilities && (
                    <div className="available-facilities-wrapper">
                        <h3 className="facilities-heading">Available Facilities</h3>
                        <div className="facilities-grid">
                            {/* F&B */}
                            <div className="facility-item">
                                <div className="facility-icon">
                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 8h10v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8z" />
                                        <path d="M8 3l3 5" />
                                        <path d="M14 13h5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-5" />
                                    </svg>
                                </div>
                                <span className="facility-label">F&B</span>
                            </div>

                            {/* MTicket */}
                            <div className="facility-item">
                                <div className="facility-icon">
                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="5" y="2" width="14" height="20" rx="3" />
                                        <path d="M9 9h6v6H9z" />
                                        <path d="M9 12h6" />
                                    </svg>
                                </div>
                                <span className="facility-label">MTicket</span>
                            </div>

                            {/* Wheel Chair Facility */}
                            <div className="facility-item">
                                <div className="facility-icon">
                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="4" r="2" />
                                        <path d="M12 6v6h5l2 5" />
                                        <path d="M8 17a4 4 0 1 0 8 0" />
                                    </svg>
                                </div>
                                <span className="facility-label">Wheel Chair Facility</span>
                            </div>

                            {/* Recliner Seats */}
                            <div className="facility-item">
                                <div className="facility-icon">
                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M6 19v2M18 19v2" />
                                        <path d="M4 11V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5" />
                                        <path d="M3 15h18v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2z" />
                                        <path d="M7 11v4M17 11v4" />
                                    </svg>
                                </div>
                                <span className="facility-label">Recliner Seats</span>
                            </div>

                            {/* Food Court */}
                            <div className="facility-item">
                                <div className="facility-icon">
                                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 2v20M18 2a4 4 0 0 1 4 4v4h-4" />
                                        <path d="M6 2v6a3 3 0 0 0 6 0V2" />
                                        <line x1="9" y1="8" x2="9" y2="22" />
                                    </svg>
                                </div>
                                <span className="facility-label">Food Court</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Date Selector & Filters Bar (Only Today and Tomorrow available, rest blocked) */}
                <div className="cinema-filter-bar">
                    <div className="cinema-date-picker">
                        {DATES_LIST.map((item) => {
                            const isSelected = selectedDate.date === item.date;

                            return (
                                <button
                                    key={item.date}
                                    type="button"
                                    disabled={!item.isAvailable}
                                    className={`date-tab ${isSelected ? "active" : ""} ${!item.isAvailable ? "blocked" : ""}`}
                                    onClick={() => {
                                        if (item.isAvailable) setSelectedDate(item);
                                    }}
                                    title={!item.isAvailable ? "Booking not open for this date yet" : ""}
                                >
                                    <span className="date-tab-day">{item.day}</span>
                                    <span className="date-tab-num">{item.date}</span>
                                    <span className="date-tab-month">{item.month}</span>
                                    {!item.isAvailable && <span className="blocked-lock-badge">Blocked</span>}
                                </button>
                            );
                        })}
                    </div>

                    <div className="cinema-filter-controls">
                        <div className="filter-dropdown-wrapper">
                            <select
                                value={priceRangeFilter}
                                onChange={(e) => setPriceRangeFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">Select Price Range</option>
                                <option value="under200">Under ₹200</option>
                                <option value="200to250">₹200 - ₹250</option>
                                <option value="above250">Above ₹250</option>
                            </select>
                        </div>

                        <div className="filter-dropdown-wrapper">
                            <select
                                value={timingFilter}
                                onChange={(e) => setTimingFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">Select Show Timings</option>
                                <option value="morning">Morning (9 AM - 12 PM)</option>
                                <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                                <option value="evening">Evening (4 PM - 8 PM)</option>
                                <option value="night">Night (8 PM onwards)</option>
                            </select>
                        </div>

                        {/* Search button using proper SVG logo */}
                        <div className="cinema-search-toggle-wrapper">
                            {showSearchInput ? (
                                <input
                                    type="text"
                                    placeholder="Search movie..."
                                    value={searchMovieQuery}
                                    onChange={(e) => setSearchMovieQuery(e.target.value)}
                                    className="cinema-movie-search-input"
                                    autoFocus
                                    onBlur={() => {
                                        if (!searchMovieQuery) setShowSearchInput(false);
                                    }}
                                />
                            ) : (
                                <button
                                    type="button"
                                    className="cinema-search-icon-btn"
                                    onClick={() => setShowSearchInput(true)}
                                    title="Search movie in cinema"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Status Legend Bar (Clean SVG dots and LAN badge, no emojis) */}
                <div className="cinema-status-legend-bar">
                    <div className="legend-item">
                        <span className="dot dot-available"></span>
                        <span className="legend-label">AVAILABLE</span>
                    </div>
                    <div className="legend-item">
                        <span className="dot dot-fast"></span>
                        <span className="legend-label">FAST FILLING</span>
                    </div>
                    <div className="legend-item">
                        <span className="lan-badge">LAN</span>
                        <span className="legend-label">SUBTITLES LANGUAGE</span>
                    </div>
                </div>

                {/* Movie Showtimes Section */}
                <div className="cinema-movies-list">
                    {nowShowingMovies.map((movie) => {
                        if (
                            searchMovieQuery.trim() &&
                            !movie.title.toLowerCase().includes(searchMovieQuery.toLowerCase().trim())
                        ) {
                            return null;
                        }

                        const baseShowtimes = SHOWTIMES_BY_MOVIE[movie.id] || [
                            { time: "11:00 AM", sound: "", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
                            { time: "02:30 PM", sound: "", status: "available", prices: { sofa: 250, platinum: 220, gold: 220, silver: 200 } },
                            { time: "06:30 PM", sound: "DOLBY 7.1", status: "fast", prices: { sofa: 280, platinum: 250, gold: 250, silver: 220 } },
                            { time: "09:45 PM", sound: "DOLBY 7.1", status: "available", prices: { sofa: 280, platinum: 250, gold: 250, silver: 220 } },
                        ];

                        const fastTimesForDate = DYNAMIC_FAST_FILLING[selectedDate.date]?.[movie.id] || [];

                        const rawShowtimes = baseShowtimes.map((st) => ({
                            ...st,
                            status: fastTimesForDate.includes(st.time) ? "fast" : "available",
                        }));

                        const showtimes = filterShowtimesByPrice(filterShowtimesByTiming(rawShowtimes));

                        if (showtimes.length === 0 && (priceRangeFilter !== "all" || timingFilter !== "all")) {
                            return null;
                        }

                        const formatStr = Array.isArray(movie.format) ? movie.format.join(", ") : movie.format;

                        return (
                            <div className="cinema-movie-row" key={movie.id}>
                                <div className="movie-info-cell">
                                    <h3 className="movie-info-title">
                                        {movie.title}{" "}
                                        <span className="movie-cert-tag">
                                            ({movie.certificate || "UA16+"})
                                        </span>
                                    </h3>
                                    <div className="movie-info-tags">
                                        <span className="movie-lang-tag">{movie.language}</span>
                                        <span className="movie-fmt-tag">{formatStr}</span>
                                    </div>
                                </div>

                                <div className="movie-showtimes-cell">
                                    {showtimes.map((st, idx) => {
                                        const hoverKey = `${movie.id}-${idx}`;
                                        const isHovered = hoveredShowtime === hoverKey;

                                        return (
                                            <div
                                                key={idx}
                                                className="showtime-pill-container"
                                                onMouseEnter={() => setHoveredShowtime(hoverKey)}
                                                onMouseLeave={() => setHoveredShowtime(null)}
                                            >
                                                <button
                                                    type="button"
                                                    className={`showtime-pill ${st.status}`}
                                                    onClick={() => handleSelectShowtime(movie, st)}
                                                >
                                                    <span className="showtime-main-time">{st.time}</span>
                                                    {st.sound && (
                                                        <span className="showtime-sound-badge">{st.sound}</span>
                                                    )}
                                                </button>

                                                {/* Price breakdown tooltip */}
                                                {isHovered && st.prices && (
                                                    <div className="price-tooltip-card">
                                                        <div className="price-row">
                                                            <span className="price-val">₹ {st.prices.silver}.00</span>
                                                            <span className="price-cat">SILVER</span>
                                                            <span className="price-stat">Available</span>
                                                        </div>
                                                        <div className="price-row">
                                                            <span className="price-val">₹ {st.prices.gold}.00</span>
                                                            <span className="price-cat">GOLD</span>
                                                            <span className="price-stat">Available</span>
                                                        </div>
                                                        <div className="price-row">
                                                            <span className="price-val">₹ {st.prices.platinum}.00</span>
                                                            <span className="price-cat">PLATINUM</span>
                                                            <span className="price-stat">Available</span>
                                                        </div>
                                                        <div className="price-row">
                                                            <span className="price-val">₹ {st.prices.sofa}.00</span>
                                                            <span className="price-cat">PREMIUM SOFA</span>
                                                            <span className="price-stat">Available</span>
                                                        </div>
                                                        <div className="tooltip-arrow"></div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CinemaDetail;
