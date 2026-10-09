
import { useEffect, useRef, useState } from "react";
import "./ComingSoon.css";


const comingSoonMovies = [
    {
        title: "Jailer 2",
        genres: "Action / Thriller",
        releaseDate: "15 Oct 2026",
        likes: "156K+ Likes",
        images: ["/Jailer_2_poster.jpg"],
    },
    {
        title: "Rajini: The Jailer 2",
        genres: "Action / Thriller",
        releaseDate: "15 Oct 2026",
        likes: "128K+ Likes",
        images: ["/Jailer2.jpeg"],
    },
    {
        title: "Emperor vs Sarat Chandra",
        genres: "Drama / Historical / Political",
        releaseDate: "16 Oct 2026",
        likes: "19.9K+ Likes",
        images: ["/Emperor_vs_Sarat_Chandra_poster.jpg"],
    },
    {
        title: "Bohurupi: The Golden Daku",
        genres: "Action / Drama / Thriller",
        releaseDate: "18 Oct 2026",
        likes: "14.4K+ Likes",
        images: ["/baharupi2.jpg"],
    },

];

const IMAGE_INTERVAL = 2500;

const ComingSoon = () => {
    const listRef = useRef(null);

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
        () => comingSoonMovies.map(() => 0)
    );

    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

    // Automatically cycle through movie images
    useEffect(() => {
        if (hoveredMovie !== null) return;

        const timer = window.setInterval(() => {
            setActiveImages((previous) =>
                previous.map((imageIndex, movieIndex) =>
                    movieIndex === currentMovieIndex
                        ? (imageIndex + 1) %
                        comingSoonMovies[movieIndex].images.length
                        : imageIndex
                )
            );

            setCurrentMovieIndex(
                (previous) => (previous + 1) % comingSoonMovies.length
            );
        }, IMAGE_INTERVAL);

        return () => window.clearInterval(timer);
    }, [currentMovieIndex, hoveredMovie]);

    // Cycle through the hovered movie's images
    useEffect(() => {
        if (hoveredMovie === null) return;

        const movieIndex = comingSoonMovies.findIndex(
            (movie) => movie.title === hoveredMovie
        );

        if (movieIndex === -1) return;

        const timer = window.setInterval(() => {
            setActiveImages((previous) =>
                previous.map((imageIndex, index) =>
                    index === movieIndex
                        ? (imageIndex + 1) %
                        comingSoonMovies[movieIndex].images.length
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
            id="coming-soon"
            className="coming-soon"
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
                {comingSoonMovies.map((movie, index) => {
                    const isHovered = hoveredMovie === movie.title;
                    const visibleImage = activeImages[index];


                    return (
                        <article
                            className={`coming-soon-card${isHovered ? " is-hovered" : ""}`}
                            key={movie.title}
                            onMouseEnter={() => setHoveredMovie(movie.title)}
                            onMouseLeave={() => setHoveredMovie(null)}
                        >
                            <div className="coming-soon-poster">
                                {movie.images.map((image, imageIndex) => (
                                    <img
                                        className={`coming-soon-image${imageIndex === visibleImage ? " is-active" : ""
                                            }`}
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
                            <p>{movie.genres}</p>

                            <div className="coming-soon-likes">

                                <span>{movie.likes}</span>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default ComingSoon;