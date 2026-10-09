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
        images: ["/bail-2026.jpg", "/bail.jpg", "/bail2.jpg"],
    },
    {
        title: "Premada Oorali",
        genres: "Drama / Romance",
        rating: "9.6/10",
        votes: "46.8K+ Votes",
        images: ["/pramad.jpg", "/pramad2.png", "/pramad3.jpeg"],
    },
    {
        title: "Hanuman Ansh",
        genres: "Biography / Devotional / Drama",
        rating: "9.6/10",
        votes: "281K+ Votes",
        images: ["/hanumanansh.webp", "/hanumanansh2.png", "/hanumanansh3.webp"],
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
        images: ["/doremon1.jpg", "/doremon2.jpeg", "/doremon3.jpg"],
    },
];

const IMAGE_INTERVAL = 2500;

const TrendingMovies = ({ showIntro = false }) => {
    const listRef = useRef(null);
    const sectionRef = useRef(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        if (showIntro) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [showIntro]);

    // Movie currently being hovered or focused
    const [hoveredMovie, setHoveredMovie] = useState(null);

    // Image currently displayed for each movie
    const [activeImages, setActiveImages] = useState(
        () => trendingMovies.map(() => 0)
    );

    // Index of the movie whose images are changing automatically
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

    // Automatically cycle through movies, one at a time
    useEffect(() => {
        if (hoveredMovie !== null) return;

        const timer = window.setInterval(() => {
            setActiveImages((previous) =>
                previous.map((imageIndex, movieIndex) =>
                    movieIndex === currentMovieIndex
                        ? (imageIndex + 1) % trendingMovies[movieIndex].images.length
                        : imageIndex
                )
            );

            // Start changing the next movie after this movie's image changes
            setCurrentMovieIndex((previous) =>
                (previous + 1) % trendingMovies.length
            );
        }, IMAGE_INTERVAL);

        return () => window.clearInterval(timer);
    }, [currentMovieIndex, hoveredMovie]);

    // While hovering, cycle only that movie's images
    useEffect(() => {
        if (hoveredMovie === null) return;

        const movieIndex = trendingMovies.findIndex(
            (movie) => movie.title === hoveredMovie
        );

        if (movieIndex === -1) return;

        const timer = window.setInterval(() => {
            setActiveImages((previous) =>
                previous.map((imageIndex, index) =>
                    index === movieIndex
                        ? (imageIndex + 1) %
                        trendingMovies[movieIndex].images.length
                        : imageIndex
                )
            );
        }, IMAGE_INTERVAL);

        return () => window.clearInterval(timer);
    }, [hoveredMovie]);

    const handleMovieEnter = (movieTitle) => {
        setHoveredMovie(movieTitle);
    };

    const handleMovieLeave = () => {
        setHoveredMovie(null);
    };

    const scrollMovies = (direction) => {
        listRef.current?.scrollBy({
            left: direction * 300,
            behavior: "smooth",
        });
    };

    return (
        <section
            ref={sectionRef}
            id="movies"
            className={`trending-movies${isInView ? " in-view" : ""}`}
            aria-labelledby="trending-movies-title"
        >
            <div className="trending-movies-heading">
                <h2 id="trending-movies-title">Trending Movies</h2>

                <div className="trending-movies-controls">
                    <button
                        type="button"
                        aria-label="Show previous movies"
                        onClick={() => scrollMovies(-1)}
                    >
                        &#8249;
                    </button>

                    <button
                        type="button"
                        aria-label="Show next movies"
                        onClick={() => scrollMovies(1)}
                    >
                        &#8250;
                    </button>
                </div>
            </div>

            <div className="trending-movies-list" ref={listRef}>
                {trendingMovies.map((movie, index) => {
                    const isHovered = hoveredMovie === movie.title;
                    const visibleImage = activeImages[index];

                    return (
                        <a
                            className={`trending-movie-card${isHovered ? " is-hovered" : ""
                                }`}
                            href="#movies"
                            key={movie.title}
                            onMouseEnter={() =>
                                handleMovieEnter(movie.title)
                            }
                            onMouseLeave={handleMovieLeave}
                            onFocus={() =>
                                handleMovieEnter(movie.title)
                            }
                            onBlur={handleMovieLeave}
                        >
                            <div className="trending-movie-poster">
                                {movie.images.map((image, imageIndex) => (
                                    <img
                                        className={`trending-movie-image${imageIndex === visibleImage
                                                ? " is-active"
                                                : ""
                                            }`}
                                        src={image}
                                        alt={
                                            imageIndex === visibleImage
                                                ? `${movie.title} poster`
                                                : ""
                                        }
                                        aria-hidden={
                                            imageIndex !== visibleImage
                                        }
                                        loading="lazy"
                                        key={image}
                                    />
                                ))}

                                <div className="trending-movie-rating">
                                    <span aria-hidden="true">★</span>
                                    {movie.rating}

                                    <span className="trending-movie-votes">
                                        {movie.votes}
                                    </span>
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