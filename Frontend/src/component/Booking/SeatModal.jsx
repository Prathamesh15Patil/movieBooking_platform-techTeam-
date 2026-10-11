import React from "react";
import "./SeatModal.css";

const SeatModal = ({
    isOpen,
    isFromCinema,
    onBack,
    movieTitle,
    cinemaName,
    movieImage,
    activeShowtime,
    seatCount,
    onSelectSeatCount,
    prices = {},
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <div className="seats-modal-overlay">
            <div className="seats-modal-content">
                <div className="modal-header-row">
                    <button
                        type="button"
                        className="modal-back-btn"
                        onClick={onBack}
                        title={isFromCinema ? "Back to cinema details" : "Back to showtimes"}
                    >
                        <svg
                            width="18"
                            height="18"
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
                    <h2 className="modal-title">How many seats?</h2>
                    <div style={{ width: 24 }}></div>
                </div>

                {/* Movie Card with Poster */}
                <div className="modal-movie-card">
                    <img
                        src={movieImage}
                        alt={movieTitle}
                        className="modal-movie-poster"
                    />
                    <div className="modal-movie-details">
                        <h3>{movieTitle}</h3>
                        <p>{cinemaName}</p>
                        <span className="modal-time-badge">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ marginRight: 4, verticalAlign: "-1px" }}
                            >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {activeShowtime}
                        </span>
                    </div>
                </div>

                {/* Seat Number Selector Pills */}
                <div className="seat-num-picker">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                            key={num}
                            type="button"
                            className={`seat-num-btn ${seatCount === num ? "active" : ""}`}
                            onClick={() => onSelectSeatCount(num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                {/* Category Price Info matching theater order (cheaper front to costlier back) */}
                <div className="modal-price-breakdown">
                    <div className="breakdown-col">
                        <span className="cat-title">SILVER</span>
                        <span className="cat-price">₹{(prices.silver || 200) * seatCount}.00</span>
                        <span className="cat-status status-avail">
                            {seatCount > 1 ? `₹${prices.silver || 200} × ${seatCount}` : "Available"}
                        </span>
                    </div>
                    <div className="breakdown-col">
                        <span className="cat-title">GOLD</span>
                        <span className="cat-price">₹{(prices.gold || 220) * seatCount}.00</span>
                        <span className="cat-status status-avail">
                            {seatCount > 1 ? `₹${prices.gold || 220} × ${seatCount}` : "Available"}
                        </span>
                    </div>
                    <div className="breakdown-col">
                        <span className="cat-title">PLATINUM</span>
                        <span className="cat-price">₹{(prices.platinum || 220) * seatCount}.00</span>
                        <span className="cat-status status-avail">
                            {seatCount > 1 ? `₹${prices.platinum || 220} × ${seatCount}` : "Available"}
                        </span>
                    </div>
                    <div className="breakdown-col">
                        <span className="cat-title">PREMIUM SOFA</span>
                        <span className="cat-price">₹{(prices.sofa || 250) * seatCount}.00</span>
                        <span className="cat-status status-avail">
                            {seatCount > 1 ? `₹${prices.sofa || 250} × ${seatCount}` : "Available"}
                        </span>
                    </div>
                </div>

                <div className="bestseller-banner">
                    Book the <strong>Bestseller Seats</strong> in this cinema at no extra cost!
                </div>

                <button
                    className="select-seats-modal-btn"
                    onClick={onConfirm}
                >
                    Select Seats
                </button>
            </div>
        </div>
    );
};

export default SeatModal;
