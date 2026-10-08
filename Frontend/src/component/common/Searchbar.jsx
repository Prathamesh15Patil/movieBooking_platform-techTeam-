
import React, { useState } from "react";
import "./Searchbar.css";
import BorderGlow from "./Borderglow";

const Searchbar = ({ onSearch, placeholder = "Search for movies..." }) => {
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (onSearch) {
            onSearch(value);
        }
    };

    const handleClear = () => {
        setQuery("");

        if (onSearch) {
            onSearch("");
        }
    };

    return (
        <div className="searchbar-container">
            <BorderGlow
                backgroundColor="#0f172a"
                borderRadius={10}
                glowRadius={25}
                coneSpread={25}
                colors={[
                    "#7c3aed",
                    "#ec4899",
                    "#38bdf8"
                ]}
                fillOpacity={0.35}
            >
                <div className="searchbar">
                    {/* Search Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="search-icon"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-4.35-4.35m1.35-5.4a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
                        />
                    </svg>

                    {/* Search Input */}
                    <input
                        type="text"
                        value={query}
                        onChange={handleChange}
                        placeholder={placeholder}
                    />

                    {/* Clear Button */}
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            aria-label="Clear search"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="clear-icon"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </BorderGlow>
        </div>
    );
};

export default Searchbar;

