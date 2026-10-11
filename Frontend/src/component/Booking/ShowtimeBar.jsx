import React from "react";
import "./ShowtimeBar.css";

const ShowtimeBar = ({
    availableShowtimes = [],
    activeShowtime,
    onSelectShowtime,
}) => {
    return (
        <div className="booking-showtime-bar">
            <span className="showtime-bar-label">
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
                Showtime:
            </span>
            <div className="showtime-bar-pills-wrap">
                {availableShowtimes.map((st) => {
                    const isCurrentActive = st.time === activeShowtime;
                    return (
                        <button
                            key={st.time}
                            type="button"
                            className={`showtime-bar-pill ${isCurrentActive ? "active" : ""}`}
                            onClick={() => onSelectShowtime(st.time)}
                            title={`Select ${st.time}`}
                        >
                            <span className="showtime-pill-time">{st.time}</span>
                            {st.sound && <span className="showtime-pill-sound">{st.sound}</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ShowtimeBar;
