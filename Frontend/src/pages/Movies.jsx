
import React, { useEffect, useState } from "react";

import Navigation from "../component/Home/Navigationbar/Navigation";
import CtfAd from "../component/Home/Ad_Discount/Ctfad";
import Filters from "../component/Movies/Filters/Filters";
import MovieGrid from "../component/Movies/MovieGrid/MovieGrid";

import "./Movies.css";

const ALL_MOVIES = [
    {
        id: "drishyam-2",
        title: "Drishyam: The Conclusion",
        language: "Hindi",
        genres: ["Drama", "Mystery", "Thriller"],
        format: ["2D"],
        certificate: "UA",
        rating: "8.9",
        votes: "76.4K+ Votes",
        image: "/Drishyam-The-Conclusion-poster-2026.jpeg",
    },
    {
        id: "bail",
        title: "Bail",
        language: "Kannada",
        genres: ["Crime", "Drama", "Thriller"],
        format: ["2D"],
        certificate: "UA",
        rating: "8.7",
        votes: "2.8K+ Votes",
        image: "/bail-2026.jpg",
    },
    {
        id: "premada-oorali",
        title: "Premada Oorali",
        language: "Kannada",
        genres: ["Drama", "Romance"],
        format: ["2D"],
        certificate: "U",
        rating: "9.6",
        votes: "46.8K+ Votes",
        image: "/pramad.jpg",
    },
    {
        id: "hanuman-ansh",
        title: "Hanuman Ansh",
        language: "Hindi",
        genres: ["Biography", "Drama"],
        format: ["2D", "3D"],
        certificate: "U",
        rating: "9.6",
        votes: "281K+ Votes",
        image: "/hanumanansh.webp",
    },
    {
        id: "the-social-reckoning",
        title: "The Social Reckoning",
        language: "English",
        genres: ["Biography", "Drama", "Thriller"],
        format: ["2D"],
        certificate: "A",
        rating: "8.4",
        votes: "7.8K+ Likes",
        image: "/the%20social.png",
    },
    {
        id: "doremon-castle-undersea",
        title: "Doremon: Castle of the Undersea Devil",
        language: "English",
        genres: ["Action", "Adventure", "Fantasy"],
        format: ["2D", "3D", "IMAX"],
        certificate: "U",
        rating: "8.8",
        votes: "12.6K+ Votes",
        image: "/doremon1.jpg",
    },
];

const UPCOMING_MOVIES = [
    {
        id: "jailer-2",
        title: "Jailer 2",
        language: "Tamil",
        genres: ["Action", "Thriller"],
        format: ["2D", "IMAX"],
        certificate: "UA",
        rating: "9.2",
        votes: "156K+ Likes",
        image: "/Jailer_2_poster.jpg",
    },
    {
        id: "rajini-jailer-2",
        title: "Rajini: The Jailer 2",
        language: "Tamil",
        genres: ["Action", "Thriller"],
        format: ["2D"],
        certificate: "UA",
        rating: "9.0",
        votes: "128K+ Likes",
        image: "/Jailer2.jpeg",
    },
    {
        id: "emperor-sarat-chandra",
        title: "Emperor vs Sarat Chandra",
        language: "Hindi",
        genres: ["Drama", "Historical"],
        format: ["2D"],
        certificate: "UA",
        rating: "8.5",
        votes: "19.9K+ Likes",
        image: "/Emperor_vs_Sarat_Chandra_poster.jpg",
    },
    {
        id: "bohurupi-golden-daku",
        title: "Bohurupi: The Golden Daku",
        language: "Hindi",
        genres: ["Action", "Drama"],
        format: ["2D"],
        certificate: "UA",
        rating: "8.6",
        votes: "14.4K+ Likes",
        image: "/baharupi2.jpg",
    },
];

const Movies = () => {
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

    const sourceMovies = showUpcoming ? UPCOMING_MOVIES : ALL_MOVIES;

    const displayedMovies = sourceMovies.filter((movie) => {
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
                        <h2>{showUpcoming ? "Upcoming Movies" : "Now Showing"}</h2>
                        <span>{displayedMovies.length} movies</span>
                    </div>

                    <MovieGrid movies={displayedMovies} />
                </section>
            </main>
        </div>
    );
};

export default Movies;
