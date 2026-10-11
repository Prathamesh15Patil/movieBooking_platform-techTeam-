import React, { useEffect, useState } from "react";
import "./PaymentSuccess.css";

const PaymentSuccess = ({ bookingSummary, onReturnHome }) => {
    const [secondsLeft, setSecondsLeft] = useState(7);

    const {
        movieTitle = "Movie",
        cinemaName = "Cinema",
        date = "Today",
        showtime = "Showtime",
        seats = [],
        totalAmount = 0,
    } = bookingSummary || {};

    const bookingId = React.useMemo(() => {
        return "BK-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    }, []);

    useEffect(() => {
        if (secondsLeft <= 0) {
            onReturnHome();
            return;
        }

        const timer = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft, onReturnHome]);

    return (
        <div className="minimal-success-card">
            {/* Animated Checkmark Badge */}
            <div className="minimal-success-icon-wrapper">
                <div className="minimal-success-icon-circle">
                    <svg className="checkmark-svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="24" fill="none" />
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>
            </div>

            <h2 className="minimal-success-title">Payment Done!</h2>
            <p className="minimal-success-subtitle">Booking Confirmed</p>

            <div className="minimal-ref-badge">
                <span>Ref: <strong>{bookingId}</strong></span>
            </div>

            {/* Receipt Summary */}
            <div className="minimal-receipt-box">
                <div className="minimal-receipt-line">
                    <span className="line-label">Movie</span>
                    <span className="line-val">{movieTitle}</span>
                </div>
                <div className="minimal-receipt-line">
                    <span className="line-label">Cinema</span>
                    <span className="line-val">{cinemaName}</span>
                </div>
                <div className="minimal-receipt-line">
                    <span className="line-label">Show</span>
                    <span className="line-val">{date} | {showtime}</span>
                </div>
                <div className="minimal-receipt-line">
                    <span className="line-label">Seats</span>
                    <span className="line-val highlight-seat">{seats.join(", ")}</span>
                </div>
                <div className="minimal-receipt-line total-line">
                    <span className="line-label">Paid</span>
                    <span className="line-val amount-paid">₹{totalAmount}.00</span>
                </div>
            </div>

            {/* Auto Redirect & Home Button */}
            <div className="minimal-success-footer">
                <p className="minimal-countdown-text">
                    Redirecting to home in <strong>{secondsLeft}s</strong>
                </p>
                <button
                    type="button"
                    className="minimal-btn-home"
                    onClick={onReturnHome}
                >
                    Home
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
