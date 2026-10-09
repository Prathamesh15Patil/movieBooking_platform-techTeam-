import React from "react";
import { Link } from "react-router-dom";
import "./ThankYou.css";

const ThankYou = () => {
    return (
        <main className="thankyou-page">
            <div className="thankyou-card">
                <div className="thankyou-icon"></div>

                <span className="thankyou-badge">POPCORNPASS PROMOTION</span>

                <h1>Thank You for Exploring!</h1>

                <p className="thankyou-subtitle">
                    Your interest in our exclusive movie offers has been received. Enjoy special discounts on your next movie night!
                </p>

                <div className="thankyou-coupon-box">
                    <span className="coupon-label">YOUR EXCLUSIVE PROMO CODE</span>
                    <strong className="coupon-code">POPCORN20</strong>
                    <p className="coupon-desc">Use this code at checkout to get 20% off your booking.</p>
                </div>

                <div className="thankyou-actions">
                    <Link to="/movies" className="thankyou-btn primary">
                        Browse Movies
                    </Link>
                    <Link to="/" className="thankyou-btn secondary">
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ThankYou;
