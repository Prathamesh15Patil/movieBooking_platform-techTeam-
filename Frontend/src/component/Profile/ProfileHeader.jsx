import React from "react";
import "./ProfileHeader.css";

const ProfileHeader = ({ user, bookingsCount, onLogout }) => {
    return (
        <div className="profile-header-card">
            <div className="profile-avatar-large">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="profile-header-info">
                <div className="profile-name-badge-row">
                    <h2 className="profile-user-title">{user?.name || "User"}</h2>
                    <span className="profile-vip-badge">VIP Member</span>
                </div>
                <p className="profile-email-text">{user?.email}</p>
                <span className="profile-bookings-count">
                    {bookingsCount} {bookingsCount === 1 ? "Booking" : "Bookings"} Made
                </span>
            </div>
            <button
                type="button"
                className="profile-logout-top-btn"
                onClick={onLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default ProfileHeader;
