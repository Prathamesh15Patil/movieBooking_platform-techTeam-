import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CinemaDetail from "./CinemaDetail";
import { CINEMAS_DATABASE, getCinemaById } from "../../../utils/cinemaData";
import "./Cinemas.css";

const Cinemas = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const cinemaParam = searchParams.get("cinema");

    const [selectedCity, setSelectedCity] = useState(
        () => localStorage.getItem("selectedCity") || "Belagavi (Belgaum)"
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState({});
    const [activeCinema, setActiveCinema] = useState(() => {
        if (cinemaParam) {
            return getCinemaById(cinemaParam);
        }
        return null;
    });

    // Synchronize activeCinema whenever the URL search param ?cinema= changes
    useEffect(() => {
        if (cinemaParam) {
            const found = getCinemaById(cinemaParam);
            if (found) {
                setActiveCinema(found);
                if (found.city && found.city !== selectedCity) {
                    setSelectedCity(found.city);
                }
            }
        } else {
            setActiveCinema(null);
        }
    }, [cinemaParam]);

    useEffect(() => {
        const handleCityChange = () => {
            const city = localStorage.getItem("selectedCity");
            if (city && city !== "Location") {
                setSelectedCity(city);
                setActiveCinema(null);
                setSearchParams({});
            }
        };

        window.addEventListener("cityChange", handleCityChange);
        window.addEventListener("storage", handleCityChange);

        return () => {
            window.removeEventListener("cityChange", handleCityChange);
            window.removeEventListener("storage", handleCityChange);
        };
    }, [setSearchParams]);

    const toggleFavorite = (e, id) => {
        e.stopPropagation();
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const currentCinemas = CINEMAS_DATABASE[selectedCity] || CINEMAS_DATABASE["Belagavi (Belgaum)"];

    const filteredCinemas = currentCinemas.filter((cinema) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
            cinema.name.toLowerCase().includes(q) ||
            cinema.address.toLowerCase().includes(q)
        );
    });

    const displayCityName = selectedCity.includes("Belagavi")
        ? "Belagavi-Belgaum"
        : selectedCity;

    const handleBackFromDetail = () => {
        setActiveCinema(null);
        setSearchParams({});
    };

    if (activeCinema) {
        return (
            <CinemaDetail
                cinema={activeCinema}
                onBack={handleBackFromDetail}
            />
        );
    }

    return (
        <div className="cinemas-page-wrapper">
            <main className="cinemas-container">
                {/* Header Row: Title & Search bar */}
                <div className="cinemas-header">
                    <h2>Cinema In {displayCityName}</h2>

                    <div className="cinemas-search-box">
                        <svg
                            className="cinemas-search-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                            />
                        </svg>

                        <input
                            type="text"
                            placeholder="Search by cinema or area"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Cinema Cards Grid */}
                <div className="cinemas-grid">
                    {filteredCinemas.length > 0 ? (
                        filteredCinemas.map((cinema) => {
                            const isFav = !!favorites[cinema.id];

                            return (
                                <div
                                    className="cinema-card"
                                    key={cinema.id}
                                    onClick={() => {
                                        setActiveCinema(cinema);
                                        setSearchParams({ cinema: cinema.id });
                                    }}
                                >
                                    <button
                                        type="button"
                                        className={`cinema-fav-btn ${isFav ? "active" : ""}`}
                                        onClick={(e) => toggleFavorite(e, cinema.id)}
                                        aria-label="Favorite cinema"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "#ef4444" : "none"} stroke={isFav ? "#ef4444" : "#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                    </button>

                                    <div className="cinema-card-content">
                                        <div className="cinema-name-header">
                                            <h3 className="cinema-name">{cinema.name}</h3>
                                            <span className="cinema-screen-badge">
                                                {cinema.screens} {cinema.screens === 1 ? "Screen" : "Screens"}
                                            </span>
                                        </div>
                                        <p className="cinema-address">{cinema.address}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="cinemas-no-results">
                            No cinemas found matching "{searchQuery}" in {displayCityName}.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Cinemas;
