import React from "react";
import "./CheckoutBar.css";

const CheckoutBar = ({
    selectedSeats = [],
    totalAmount = 0,
    onProceed,
}) => {
    if (selectedSeats.length === 0) return null;

    return (
        <div className="booking-bottom-pay-bar">
            <div className="pay-summary">
                <div className="selected-seats-text">
                    Seats: <strong>{selectedSeats.join(", ")}</strong>
                </div>
                <div className="pay-total-amount">
                    Total: <strong>₹{totalAmount}.00</strong>
                </div>
            </div>
            <button className="pay-proceed-btn" onClick={onProceed}>
                Pay ₹{totalAmount}.00
            </button>
        </div>
    );
};

export default CheckoutBar;
