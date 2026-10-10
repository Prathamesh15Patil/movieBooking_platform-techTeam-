
import React from "react";
import "./AboutMovie.css";

const AboutMovie = ({ movie, details }) => {
    if (!movie) return null;

    const synopsis =
        details?.synopsis || "Movie description will be available soon.";

    const cast = details?.cast ?? [];
    const crew = details?.crew ?? [];

    const formatPerson = (person) => {
        if (typeof person === "string") return person;
        if (person.role && person.role !== "Actor" && person.role !== "Crew") {
            return `${person.name} (${person.role})`;
        }
        return person.name;
    };

    return (
        <section className="about-movie-section">
            <div className="about-movie-container">
                <div className="about-movie-main">
                    <h2>About the Movie</h2>

                    <p className="about-movie-synopsis">
                        {synopsis}
                    </p>

                    {cast.length > 0 && (
                        <div className="about-movie-cast-crew-block">
                            <h3>Cast</h3>
                            <p className="about-movie-cast-crew-text">
                                {cast.map(formatPerson).join(", ")}
                            </p>
                        </div>
                    )}

                    {crew.length > 0 && (
                        <div className="about-movie-cast-crew-block">
                            <h3>Crew</h3>
                            <p className="about-movie-cast-crew-text">
                                {crew.map(formatPerson).join(", ")}
                            </p>
                        </div>
                    )}
                </div>

                <div className="about-movie-info">
                    <h3>Movie Details</h3>

                    <div className="about-movie-info-list">
                        <div className="about-movie-info-item">
                            <span>Language</span>
                            <strong>{movie.language || "N/A"}</strong>
                        </div>

                        <div className="about-movie-info-item">
                            <span>Genre</span>
                            <strong>
                                {movie.genres?.join(", ") || "N/A"}
                            </strong>
                        </div>

                        <div className="about-movie-info-item">
                            <span>Format</span>
                            <strong>
                                {movie.format?.join(", ") || "N/A"}
                            </strong>
                        </div>

                        <div className="about-movie-info-item">
                            <span>Certificate</span>
                            <strong>{movie.certificate || "N/A"}</strong>
                        </div>

                        <div className="about-movie-info-item">
                            <span>Duration</span>
                            <strong>{details?.duration || "Not announced"}</strong>
                        </div>

                        {movie.releaseDate && (
                            <div className="about-movie-info-item">
                                <span>Release Date</span>
                                <strong>{movie.releaseDate}</strong>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMovie;
