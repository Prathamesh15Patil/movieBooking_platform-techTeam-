import React from "react";
import "./SeatingArea.css";

const SeatingArea = ({
    dynamicRowConfig = [],
    seatsPerRow = 10,
    occupiedSeats = new Set(),
    selectedSeats = [],
    seatCount = 2,
    totalAmount = 0,
    onSeatClick,
}) => {
    const categories = ["SILVER", "GOLD", "PLATINUM", "PREMIUM SOFA"];

    return (
        <main className="booking-screen-area">
            {/* Curved Screen Banner */}
            <div className="cinema-screen-banner">
                <div className="screen-curve"></div>
                <span className="screen-text">All eyes this way please!</span>
            </div>

            {/* Seat Selection Status / Selected Price Banner */}
            <div className={`seat-selection-status ${selectedSeats.length > 0 ? "active" : ""}`}>
                {selectedSeats.length > 0 ? (
                    <div className="status-selected-info">
                        <span className="status-badge">Selected ({selectedSeats.length})</span>
                        <span className="status-seats-list">{selectedSeats.join(", ")}</span>
                        <span className="status-price-highlight">Total: ₹{totalAmount}.00</span>
                    </div>
                ) : (
                    <div className="status-prompt">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Select your <strong>{seatCount}</strong> {seatCount === 1 ? "seat" : "seats"} to view total price
                    </div>
                )}
            </div>

            {/* Seating Grid by Category (Cheaper near screen, costlier farther) */}
            <div className="seats-grid-wrapper">
                {categories.map((catName) => {
                    const catRows = dynamicRowConfig.filter((r) => r.category === catName);
                    const price = catRows[0]?.price;

                    return (
                        <div key={catName} className="seat-category-section">
                            <div className="category-header-tag">
                                {catName} ROWS - ₹{price}.00
                            </div>

                            {catRows.map((rowObj) => (
                                <div key={rowObj.row} className="seat-row">
                                    <span className="row-letter">{rowObj.row}</span>
                                    <div className="seats-in-row">
                                        {Array.from({ length: seatsPerRow }).map((_, idx) => {
                                            const seatNum = idx + 1;
                                            const seatId = `${rowObj.row}${seatNum}`;
                                            const isOccupied = occupiedSeats.has(seatId);
                                            const isSelected = selectedSeats.includes(seatId);

                                            return (
                                                <button
                                                    key={seatId}
                                                    type="button"
                                                    disabled={isOccupied}
                                                    className={`seat-box ${isOccupied ? "occupied" : ""} ${isSelected ? "selected" : ""}`}
                                                    onClick={() => onSeatClick(seatId, rowObj)}
                                                >
                                                    {seatNum < 10 ? `0${seatNum}` : seatNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* Legend Bar */}
            <div className="booking-legend-bar">
                <div className="legend-item">
                    <span className="seat-box-sample available"></span> Available
                </div>
                <div className="legend-item">
                    <span className="seat-box-sample occupied"></span> Sold
                </div>
                <div className="legend-item">
                    <span className="seat-box-sample selected"></span> Selected
                </div>
            </div>
        </main>
    );
};

export default SeatingArea;
