import React from "react";
import "./BookingHeader.css";

const BookingHeader = ({
    isFromCinema,
    onBack,
    movieTitle,
    movieLang,
    cinemaName,
    date,
    activeShowtime,
    seatCount,
    onEditTickets,
}) => {
    return (
        <header className="booking-header">
            <div className="booking-header-left">
                <button
                    className="booking-back-btn"
                    onClick={onBack}
                    title={isFromCinema ? "Back to cinema details" : "Back to theater details"}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="booking-header-title-box">
                    <h1 className="booking-movie-title">
                        {movieTitle} - <span className="lang-span">{movieLang}</span>
                    </h1>
                    <p className="booking-cinema-meta">
                        {cinemaName} | {date} | {activeShowtime}
                    </p>
                </div>
            </div>

            <div className="booking-header-right">
                <button className="edit-tickets-btn" onClick={onEditTickets}>
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    {seatCount} {seatCount === 1 ? "Ticket" : "Tickets"}
                </button>
            </div>
        </header>
    );
};

export default BookingHeader;
