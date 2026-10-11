import React from "react";
import { Link } from "react-router-dom";
import "./UnauthProfile.css";

const UnauthProfile = ({ onOpenAuth }) => {
    return (
        <div className="profile-unauth-card">
            <h2>Sign In Required</h2>
            <p>
                Please sign up or log in to view your profile and movie ticket bookings.
            </p>
            <button
                type="button"
                className="profile-btn-primary"
                onClick={onOpenAuth}
            >
                Sign Up / Sign In
            </button>
            <Link to="/" className="profile-link-home">
                Back to Home
            </Link>
        </div>
    );
};

export default UnauthProfile;
