import { useEffect, useRef, useState } from "react";
import "./TrendingMovies.css";

const trendingMovies = [
    {
        title: "Drishyam: The Conclusion",
        genres: "Drama / Mystery / Thriller",
        rating: "8.9/10",
        votes: "76.4K+ Votes",
        images: [
            "/Drishyam-The-Conclusion-poster-2026.jpeg",
            "/drishyam2.jpg",
            "/drishyam3.jpg",
        ],
    },
    {
        title: "Bail",
        genres: "Crime / Drama / Thriller",
        rating: "8.7/10",
        votes: "2.8K+ Votes",
        images: [
            "/bail-2026.jpg",
            "/bail.jpg",
            "/bail2.jpg",
        ],
    },
    {
        title: "Premada Oorali",
        genres: "Drama / Romance",
        rating: "9.6/10",
        votes: "46.8K+ Votes",
        images: [
            "/pramad.jpg",
            "/pramad2.png",
            "/pramad3.jpeg",
        ],
    },
    {
        title: "Hanuman Ansh",
        genres: "Biography / Devotional / Drama",
        rating: "9.6/10",
        votes: "281K+ Votes",
        images: [
            "/hanumanansh.webp",
            "/hanumanansh2.png",
            "/hanumanansh3.webp",
        ],
    },
    {
        title: "The Social Reckoning",
        genres: "Biography / Drama / Thriller",
        rating: "8.4/10",
        votes: "7.8K+ Likes",
        images: [
            "/the%20social.png",
            "/thesocial.jpg",
            "/thesocialreckoning_mikeymadison.jpg",
        ],
    },
    {
        title: "Doremon: Castle of the Undersea Devil",
        genres: "Animation / Adventure / Fantasy",
        rating: "8.8/10",
        votes: "12.6K+ Votes",
        images: [
            "/doremon1.jpg",
            "/doremon2.jpeg",
            "/doremon3.jpg",
        ],
    },
];

const TrendingMovies = () => {
    const listRef = useRef(null);
    const [hoveredMovie, setHoveredMovie] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        if (!hoveredMovie) return undefined;

        const imageTimer = window.setInterval(() => {
            setActiveImage((currentImage) => (currentImage + 1) % 3);
        }, 2800);

        return () => window.clearInterval(imageTimer);
    }, [hoveredMovie]);

    const scrollMovies = (direction) => {
        listRef.current?.scrollBy({
            left: direction * 300,
            behavior: "smooth",
        });
    };

    return (
        <section id="movies" className="trending-movies" aria-labelledby="trending-movies-title">
            <div className="trending-movies-heading">
                <h2 id="trending-movies-title">Trending Movies</h2>
                <div className="trending-movies-controls">
                    <button type="button" aria-label="Show previous movies" onClick={() => scrollMovies(-1)}>&#8249;</button>
                    <button type="button" aria-label="Show next movies" onClick={() => scrollMovies(1)}>&#8250;</button>
                </div>
            </div>

            <div className="trending-movies-list" ref={listRef}>
                {trendingMovies.map((movie) => {
                    const isHovered = hoveredMovie === movie.title;
                    const visibleImage = isHovered ? activeImage : 0;

                    return (
                    <a
                        className={`trending-movie-card${isHovered ? " is-hovered" : ""}`}
                        href="#movies"
                        key={movie.title}
                        onMouseEnter={() => {
                            setHoveredMovie(movie.title);
                            setActiveImage(0);
                        }}
                        onMouseLeave={() => setHoveredMovie(null)}
                        onFocus={() => setHoveredMovie(movie.title)}
                        onBlur={() => setHoveredMovie(null)}
                    >
                        <div className="trending-movie-poster">
                            {movie.images.map((image, index) => (
                                <img
                                    className={`trending-movie-image${index === visibleImage ? " is-active" : ""}`}
                                    src={image}
                                    alt={index === 0 ? `${movie.title} poster` : ""}
                                    aria-hidden={index !== visibleImage}
                                    loading="lazy"
                                    key={image}
                                />
                            ))}
                            <div className="trending-movie-rating">
                                <span aria-hidden="true">★</span>
                                {movie.rating}
                                <span className="trending-movie-votes">{movie.votes}</span>
                            </div>
                        </div>
                        <h3>{movie.title}</h3>
                        <p>{movie.genres}</p>
                    </a>
                    );
                })}
            </div>
        </section>
    );
};

export default TrendingMovies;
