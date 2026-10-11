import React from "react";
import { Link } from "react-router-dom";
import "./MyBookings.css";

const MyBookings = ({ bookings = [] }) => {
    if (bookings.length === 0) {
        return (
            <div className="no-bookings-card">
                <h3>No Bookings Yet</h3>
                <p>
                    You haven't booked any movie tickets yet. Explore movies and catch your next favorite show!
                </p>
                <Link to="/movies" className="profile-btn-primary">
                    Explore Movies
                </Link>
            </div>
        );
    }

    return (
        <div className="bookings-grid">
            {bookings.map((booking, idx) => (
                <div key={booking.id || idx} className="booking-ticket-card">
                    <div className="ticket-header">
                        <span className="ticket-id-badge">#{booking.id || `BK-${idx + 1}`}</span>
                        <span className="ticket-status-badge">CONFIRMED</span>
                    </div>

                    <div className="ticket-body">
                        <h4 className="ticket-movie-name">{booking.movieTitle}</h4>
                        <span className="ticket-lang-tag">
                            {booking.movieLang || "Hindi"} • 2D
                        </span>

                        <div className="ticket-detail-item">
                            <span className="detail-name">Cinema:</span>
                            <span className="detail-val">{booking.cinemaName}</span>
                        </div>

                        <div className="ticket-detail-item">
                            <span className="detail-name">Showtime:</span>
                            <span className="detail-val highlight">
                                {booking.date} | {booking.showtime}
                            </span>
                        </div>

                        <div className="ticket-detail-item">
                            <span className="detail-name">Seats:</span>
                            <span className="detail-val seats-highlight">
                                {Array.isArray(booking.seats)
                                    ? booking.seats.join(", ")
                                    : booking.seats}
                            </span>
                        </div>
                    </div>

                    <div className="ticket-footer">
                        <div className="ticket-price">
                            <span className="price-label">Paid</span>
                            <span className="price-val">₹{booking.totalAmount}.00</span>
                        </div>
                        <span className="ticket-barcode">||| | |||| | ||</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MyBookings;
