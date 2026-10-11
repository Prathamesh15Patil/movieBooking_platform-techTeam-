import React, { useState } from "react";
import { Link } from "react-router-dom";
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
    const [selectedLanguage, setSelectedLanguage] = useState("All");
    const [showUpcoming, setShowUpcoming] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const sourceMovies = showUpcoming ? UPCOMING_MOVIES : ALL_MOVIES;

    const filteredMovies = sourceMovies.filter((movie) => {
        if (selectedLanguage !== "All" && movie.language !== selectedLanguage) {
            return false;
        }
        if (searchQuery.trim() && !movie.title.toLowerCase().includes(searchQuery.toLowerCase().trim())) {
            return false;
        }
        return true;
    });

    return (
        <div className="movies-page-wrapper">
            <main className="movies-page-container">
                <header className="movies-header">
                    <h1>Explore Movies</h1>
                    <div className="movies-actions-bar">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="movies-search-input"
                        />
                        <button
                            type="button"
                            className="movies-toggle-btn"
                            onClick={() => setShowUpcoming(!showUpcoming)}
                        >
                            {showUpcoming ? "View Now Showing" : "Explore Upcoming"}
                        </button>
                    </div>
                </header>

                <div className="movies-grid">
                    {filteredMovies.map((movie) => (
                        <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                            <div className="movie-poster-wrap">
                                <img src={movie.image} alt={movie.title} className="movie-poster-img" />
                                <span className="movie-rating-badge">★ {movie.rating}</span>
                            </div>
                            <div className="movie-info">
                                <h3 className="movie-title">{movie.title}</h3>
                                <p className="movie-meta">{movie.language} • {movie.genres.join(", ")}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Movies;
