import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./ComingSoon.css";
import { UPCOMING_MOVIES } from "../../../utils/movieData";

const IMAGE_INTERVAL = 2500;

const ComingSoon = ({ showIntro = false }) => {
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

    const [showArrows, setShowArrows] = useState(false);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;

        const checkOverflow = () => {
            setShowArrows(list.scrollWidth > list.clientWidth + 1);
        };

        checkOverflow();

        const resizeObserver = new ResizeObserver(checkOverflow);
        resizeObserver.observe(list);

        window.addEventListener("resize", checkOverflow);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", checkOverflow);
        };
    }, []);

    const [hoveredMovie, setHoveredMovie] = useState(null);

    const [activeImages, setActiveImages] = useState(
        () => UPCOMING_MOVIES.map(() => 0)
    );

    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

    // Automatically cycle through movie images
    useEffect(() => {
        if (hoveredMovie !== null) return;

        const timer = window.setInterval(() => {
            setActiveImages((previous) =>
                previous.map((imageIndex, movieIndex) =>
                    movieIndex === currentMovieIndex
                        ? (imageIndex + 1) % UPCOMING_MOVIES[movieIndex].images.length
                        : imageIndex
                )
            );

            setCurrentMovieIndex(
                (previous) => (previous + 1) % UPCOMING_MOVIES.length
            );
        }, IMAGE_INTERVAL);

        return () => window.clearInterval(timer);
    }, [currentMovieIndex, hoveredMovie]);

    // Cycle through the hovered movie's images
    useEffect(() => {
        if (hoveredMovie === null) return;

        const movieIndex = UPCOMING_MOVIES.findIndex(
            (movie) => movie.title === hoveredMovie
        );

        if (movieIndex === -1) return;

        const timer = window.setInterval(() => {
            setActiveImages((previous) =>
                previous.map((imageIndex, index) =>
                    index === movieIndex
                        ? (imageIndex + 1) % UPCOMING_MOVIES[movieIndex].images.length
                        : imageIndex
                )
            );
        }, IMAGE_INTERVAL);

        return () => window.clearInterval(timer);
    }, [hoveredMovie]);

    const scrollMovies = (direction) => {
        listRef.current?.scrollBy({
            left: direction * 300,
            behavior: "smooth",
        });
    };

    return (
        <section
            ref={sectionRef}
            id="coming-soon"
            className={`coming-soon${isInView ? " in-view" : ""}`}
            aria-labelledby="coming-soon-title"
        >
            <div className="coming-soon-heading">
                <div>
                    <span className="coming-soon-eyebrow">
                        MARK YOUR CALENDAR
                    </span>
                    <h2 id="coming-soon-title">Coming Soon</h2>
                </div>

                {showArrows && (
                    <div className="coming-soon-controls">
                        <button
                            type="button"
                            aria-label="Show previous upcoming movies"
                            onClick={() => scrollMovies(-1)}
                        >
                            &#8249;
                        </button>

                        <button
                            type="button"
                            aria-label="Show next upcoming movies"
                            onClick={() => scrollMovies(1)}
                        >
                            &#8250;
                        </button>
                    </div>
                )}
            </div>

            <div className="coming-soon-list" ref={listRef}>
                {UPCOMING_MOVIES.map((movie, index) => {
                    const isHovered = hoveredMovie === movie.title;
                    const visibleImage = activeImages[index];

                    return (
                        <Link
                            className={`coming-soon-card${isHovered ? " is-hovered" : ""}`}
                            to={`/movie/${movie.id}`}
                            key={movie.title}
                            onMouseEnter={() => setHoveredMovie(movie.title)}
                            onMouseLeave={() => setHoveredMovie(null)}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            <div className="coming-soon-poster">
                                {movie.images.map((image, imageIndex) => (
                                    <img
                                        className={`coming-soon-image${imageIndex === visibleImage ? " is-active" : ""}`}
                                        src={image}
                                        alt={
                                            imageIndex === visibleImage
                                                ? `${movie.title} poster`
                                                : ""
                                        }
                                        aria-hidden={imageIndex !== visibleImage}
                                        loading="lazy"
                                        key={image}
                                    />
                                ))}

                                <span className="coming-soon-tag">
                                    RELEASING SOON
                                </span>

                                <div className="coming-soon-release-date">
                                    {movie.releaseDate}
                                </div>
                            </div>

                            <h3>{movie.title}</h3>
                            <p>{Array.isArray(movie.genres) ? movie.genres.join(" / ") : movie.genres}</p>

                            <div className="coming-soon-likes">
                                <span>{movie.likes}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default ComingSoon;