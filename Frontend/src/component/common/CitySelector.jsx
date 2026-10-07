import React, { useEffect, useState } from "react";
import "./CitySelector.css";

const popularCities = [
    "Mumbai",
    "Delhi-NCR",
    "Bengaluru",
    "Hyderabad",
    "Chandigarh",
    "Ahmedabad",
    "Pune",
    "Chennai",
    "Kolkata",
    "Kochi",
    "Belagavi",
    "Hubballi",
];

const CitySelector = () => {
    const [selectedCity, setSelectedCity] = useState(
        () => localStorage.getItem("selectedCity") || "Location"
    );

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [detecting, setDetecting] = useState(false);

    const selectCity = (city) => {
        setSelectedCity(city);
        localStorage.setItem("selectedCity", city);
        setIsOpen(false);
        setSearch("");
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert("Location detection is not supported by your browser.");
            return;
        }

        setDetecting(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    /*
                     * Reverse geocoding:
                     * Converts latitude/longitude into a city name.
                     */
                    const response = await fetch(
                        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                    );

                    const data = await response.json();

                    const city =
                        data.city ||
                        data.locality ||
                        data.principalSubdivision;

                    if (city) {
                        selectCity(city);
                    }
                } catch (error) {
                    console.error("Unable to detect city:", error);
                    alert("Unable to detect your city.");
                } finally {
                    setDetecting(false);
                }
            },
            (error) => {
                console.error(error);

                setDetecting(false);

                if (error.code === 1) {
                    alert(
                        "Location permission was denied. Please allow location access."
                    );
                } else {
                    alert("Unable to detect your location.");
                }
            }
        );
    };

    const filteredCities = popularCities.filter((city) =>
        city.toLowerCase().includes(search.toLowerCase())
    );

    /*
     * Close popup using Escape key
     */
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    /*
     * Prevent background scrolling when popup is open
     */
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    return (
        <>
            {/* City button */}
            <button
                className="city-selector"
                onClick={() => setIsOpen(true)}
                type="button"
            >
                <svg
                    className="city-location-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
                    <circle cx="12" cy="9" r="2.5" />
                </svg>

                <span>{selectedCity}</span>

                <svg
                    className="city-chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {/* City popup */}
            {isOpen && (
                <div
                    className="city-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setIsOpen(false);
                        }
                    }}
                >
                    <div className="city-modal">

                        {/* Search */}
                        <div className="city-search-box">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-4-4" />
                            </svg>

                            <input
                                autoFocus
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search for your city"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="city-search-clear"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        {/* Detect location */}
                        <button
                            className="detect-location"
                            onClick={handleDetectLocation}
                            disabled={detecting}
                            type="button"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                            </svg>

                            {detecting
                                ? "Detecting location..."
                                : "Detect my location"}
                        </button>

                        <div className="city-divider" />

                        {/* Popular cities */}
                        <h3>Popular Cities</h3>

                        <div className="city-grid">
                            {filteredCities.length > 0 ? (
                                filteredCities.map((city, index) => (
                                    <button
                                        key={city}
                                        className={`city-item ${selectedCity === city
                                            ? "selected"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            selectCity(city)
                                        }
                                        type="button"
                                    >
                                        <div className="city-icon">
                                            {["🏙️", "🏛️", "🏰", "🕌", "🏢"][index % 5]}
                                        </div>

                                        <span>{city}</span>
                                    </button>
                                ))
                            ) : (
                                <div className="no-city">
                                    No cities found
                                </div>
                            )}
                        </div>

                        <button
                            className="view-all-cities"
                            type="button"
                            onClick={() => setSearch("")}
                        >
                            View All Cities
                        </button>

                    </div>
                </div>
            )}
        </>
    );
};

export default CitySelector;