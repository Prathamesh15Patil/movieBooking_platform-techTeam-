import React, { useState } from "react";
import "./PaymentCheckout.css";

const PaymentCheckout = ({ bookingSummary, onPay, onCancel }) => {
    const [agreedToTerms, setAgreedToTerms] = useState(true);

    const {
        movieTitle = "Drishyam: The Conclusion",
        movieLang = "Hindi",
        cinemaName = "INOX: Belagavi",
        date = "Today",
        showtime = "Showtime",
        seats = [],
        totalAmount = 0,
    } = bookingSummary || {};

    const handlePayClick = () => {
        if (!agreedToTerms) {
            alert("Please accept the Terms & Conditions to proceed.");
            return;
        }
        onPay();
    };

    return (
        <div className="minimal-checkout-card">
            {/* Header */}
            <div className="minimal-checkout-header">
                <h2>Confirm & Pay</h2>
                <span className="minimal-checkout-subtitle">Quick Booking Checkout</span>
            </div>

            {/* Compact Order Details */}
            <div className="minimal-summary-card">
                <div className="minimal-summary-row primary">
                    <div className="minimal-movie-info">
                        <span className="minimal-movie-title">{movieTitle}</span>
                        <span className="minimal-movie-lang">{movieLang} • 2D</span>
                    </div>
                    <div className="minimal-total-box">
                        <span className="minimal-amount-label">Amount</span>
                        <span className="minimal-amount-val">₹{totalAmount}.00</span>
                    </div>
                </div>

                <div className="minimal-summary-row details">
                    <div className="detail-item">
                        <span className="detail-label">Cinema</span>
                        <span className="detail-value">{cinemaName}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Show</span>
                        <span className="detail-value">{date} | {showtime}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Seats</span>
                        <span className="detail-value highlight-seats">
                            {seats.length > 0 ? seats.join(", ") : "None"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Terms and Conditions (Minimal & Compact) */}
            <div className="minimal-terms-card">
                <div className="minimal-terms-title">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span>Terms & Conditions</span>
                </div>
                <p className="minimal-terms-text">
                    • Tickets are non-refundable and non-transferable once confirmed.<br />
                    • Outside food & beverages and hall recordings are prohibited.<br />
                    • Please carry valid ID for age-restricted ('A') rated screenings.
                </p>

                <label className="minimal-terms-agree">
                    <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <span>I agree to the Terms & Conditions</span>
                </label>
            </div>

            {/* Exactly 2 Buttons: Cancel and Pay */}
            <div className="minimal-actions-row">
                <button
                    type="button"
                    className="minimal-btn-cancel"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="minimal-btn-pay"
                    onClick={handlePayClick}
                    disabled={!agreedToTerms}
                >
                    Pay ₹{totalAmount}.00
                </button>
            </div>
        </div>
    );
};

export default PaymentCheckout;
