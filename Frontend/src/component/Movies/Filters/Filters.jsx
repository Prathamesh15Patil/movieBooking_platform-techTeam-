
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Filters.css";

const filterOptions = {
    Languages: ["Kannada", "Hindi", "English", "Telugu", "Tamil", "Malayalam"],
    Genres: [
        "Action",
        "Adventure",
        "Comedy",
        "Crime",
        "Drama",
        "Horror",
        "Romance",
        "Thriller",
    ],
    Format: ["2D", "3D", "IMAX"],
};

const Filters = ({
    languages = [],
    setLanguages,
    genres = [],
    setGenres,
    formats = [],
    setFormats,
    onClear,
}) => {
    const [expanded, setExpanded] = useState({
        Languages: true,
        Genres: false,
        Format: false,
    });

    const filterState = {
        Languages: languages,
        Genres: genres,
        Format: formats,
    };

    const filterSetters = {
        Languages: setLanguages,
        Genres: setGenres,
        Format: setFormats,
    };

    const toggleSection = (section) => {
        setExpanded((previous) => ({
            ...previous,
            [section]: !previous[section],
        }));
    };

    const toggleOption = (section, option) => {
        const selected = filterState[section];
        const setter = filterSetters[section];

        if (!setter) return;

        setter(
            selected.includes(option)
                ? selected.filter((item) => item !== option)
                : [...selected, option]
        );
    };

    const clearSection = (section) => {
        const setter = filterSetters[section];

        if (setter) {
            setter([]);
        }
    };

    return (
        <aside className="movies-filters">
            <h2 className="movies-filters-title">Filters</h2>

            {Object.entries(filterOptions).map(([section, options]) => (
                <section className="movies-filter-group" key={section}>
                    <div className="movies-filter-header">
                        <button
                            type="button"
                            className="movies-filter-toggle"
                            onClick={() => toggleSection(section)}
                            aria-expanded={expanded[section]}
                        >
                            <span
                                className={`movies-filter-chevron ${expanded[section] ? "expanded" : ""
                                    }`}
                            >
                                ⌄
                            </span>

                            <span
                                className={
                                    section === "Languages" ? "language-heading" : ""
                                }
                            >
                                {section}
                            </span>
                        </button>

                        <button
                            type="button"
                            className="movies-filter-clear"
                            onClick={() => clearSection(section)}
                        >
                            Clear
                        </button>
                    </div>

                    {expanded[section] && (
                        <div className="movies-filter-options">
                            {options.map((option) => {
                                const isSelected =
                                    filterState[section].includes(option);

                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        className={`movies-filter-option ${isSelected ? "selected" : ""
                                            }`}
                                        aria-pressed={isSelected}
                                        onClick={() => toggleOption(section, option)}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>
            ))}

            <Link to="/cinemas" className="movies-browse-cinemas">
                Browse by Cinemas
            </Link>
        </aside>
    );
};

export default Filters;
