import React from "react";
import "./ProfileTabs.css";

const ProfileTabs = ({ activeTab, onSelectTab, bookingsCount }) => {
    return (
        <div className="profile-tabs-bar">
            <button
                type="button"
                className={`profile-tab ${activeTab === "bookings" ? "active" : ""}`}
                onClick={() => onSelectTab("bookings")}
            >
                My Bookings ({bookingsCount})
            </button>
            <button
                type="button"
                className={`profile-tab ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => onSelectTab("profile")}
            >
                Personal Profile
            </button>
        </div>
    );
};

export default ProfileTabs;
