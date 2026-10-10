
import React from "react";
import "./CastCrew.css";

const CastCrew = ({ cast = [], crew = [] }) => {
    if (cast.length === 0 && crew.length === 0) {
        return null;
    }

    return (
        <section className="cast-crew-section">
            <h2 className="cast-crew-heading">Cast & Crew</h2>

            {cast.length > 0 && (
                <div className="cast-crew-group">
                    <h3>Cast</h3>

                    <div className="cast-crew-grid">
                        {cast.map((person, index) => (
                            <div
                                className="cast-crew-item"
                                key={`${person.name}-${index}`}
                            >
                                <h4>{person.name}</h4>
                                {person.role && <p>{person.role}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {crew.length > 0 && (
                <div className="cast-crew-group">
                    <h3>Crew</h3>

                    <div className="cast-crew-grid">
                        {crew.map((person, index) => (
                            <div
                                className="cast-crew-item"
                                key={`${person.name}-${index}`}
                            >
                                <h4>{person.name}</h4>
                                {person.role && <p>{person.role}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default CastCrew;
