import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navigation from "../component/Home/Navigationbar/Navigation";
import CtfAd from "../component/Home/Ad_Discount/Ctfad";
import Filters from "../component/Movies/Filters/Filters";
import MovieGrid from "../component/Movies/MovieGrid/MovieGrid";
import { ALL_SYSTEM_MOVIES } from "../utils/movieData";

import "./Movies.css";

const Movies = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    const [languages, setLanguages] = useState([]);
    const [genres, setGenres] = useState([]);
    const [formats, setFormats] = useState([]);
    const [showUpcoming, setShowUpcoming] = useState(false);
    const [selectedCity, setSelectedCity] = useState(
        () => localStorage.getItem("selectedCity") || "Belagavi (Belgaum)"
    );

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

    const clearFilters = () => {
        setLanguages([]);
        setGenres([]);
        setFormats([]);
    };

    const sourceMovies = searchQuery
        ? ALL_SYSTEM_MOVIES
        : (showUpcoming
            ? ALL_SYSTEM_MOVIES.filter((m) => m.isUpcoming)
            : ALL_SYSTEM_MOVIES.filter((m) => !m.isUpcoming));

    const displayedMovies = sourceMovies.filter((movie) => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase().trim();
            const titleMatch = movie.title.toLowerCase().includes(q);
            const langMatch = movie.language.toLowerCase().includes(q);
            const genreMatch = Array.isArray(movie.genres)
                ? movie.genres.some((g) => g.toLowerCase().includes(q))
                : movie.genres.toLowerCase().includes(q);

            if (!titleMatch && !langMatch && !genreMatch) return false;
        }

        if (languages.length > 0 && !languages.includes(movie.language)) {
            return false;
        }
        if (genres.length > 0 && !movie.genres.some((g) => genres.includes(g))) {
            return false;
        }
        if (formats.length > 0 && !movie.format.some((f) => formats.includes(f))) {
            return false;
        }
        return true;
    });

    return (
        <div className="movies-page-wrapper">
            <Navigation />

            <CtfAd showIntro={false} />

            <main className="movies-page">
                <Filters
                    languages={languages}
                    setLanguages={setLanguages}
                    genres={genres}
                    setGenres={setGenres}
                    formats={formats}
                    setFormats={setFormats}
                    onClear={clearFilters}
                />

                <section className="movies-main">
                    <h1>Movies In {selectedCity && selectedCity !== "Location" ? selectedCity : "Belagavi (Belgaum)"}</h1>

                    {/* Coming Soon / Now Showing Banner */}
                    <div className="movies-coming-soon-banner">
                        <h2
                            onClick={() => setShowUpcoming((prev) => !prev)}
                            style={{ cursor: "pointer" }}
                        >
                            {showUpcoming ? "Now Showing" : "Coming Soon"}
                        </h2>
                        <button
                            type="button"
                            className="movies-explore-link"
                            onClick={() => setShowUpcoming((prev) => !prev)}
                        >
                            {showUpcoming ? "In cinemas near you ›" : "Explore Upcoming Movies ›"}
                        </button>
                    </div>

                    <div className="movies-results-heading">
                        <h2>
                            {searchQuery
                                ? `Search Results for "${searchQuery}"`
                                : (showUpcoming ? "Upcoming Movies" : "Now Showing")}
                        </h2>
                        <span>{displayedMovies.length} movies</span>
                    </div>

                    <MovieGrid movies={displayedMovies} />
                </section>
            </main>
        </div>
    );
};

export default Movies;
