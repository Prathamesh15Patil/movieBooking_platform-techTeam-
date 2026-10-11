import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    ProfileHeader,
    ProfileTabs,
    MyBookings,
    AccountDetails,
    UnauthProfile,
} from "../component/Profile";
import "./Profile.css";

const Profile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, bookings, openAuthModal } = useAuth();

    // Determine initial tab from pathname or query param
    const queryParams = new URLSearchParams(location.search);
    const initialTab =
        location.pathname === "/my-bookings" || queryParams.get("tab") === "bookings"
            ? "bookings"
            : "profile";

    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (location.pathname === "/my-bookings" || queryParams.get("tab") === "bookings") {
            setActiveTab("bookings");
        } else if (queryParams.get("tab") === "profile") {
            setActiveTab("profile");
        }
    }, [location.pathname, location.search]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    if (!user) {
        return (
            <div className="profile-page-container">
                <UnauthProfile onOpenAuth={openAuthModal} />
            </div>
        );
    }

    return (
        <div className="profile-page-container">
            <div className="profile-shell">
                {/* User Summary Header */}
                <ProfileHeader
                    user={user}
                    bookingsCount={bookings.length}
                    onLogout={handleLogout}
                />

                {/* Tabs Switcher */}
                <ProfileTabs
                    activeTab={activeTab}
                    onSelectTab={setActiveTab}
                    bookingsCount={bookings.length}
                />

                {/* Content Section */}
                <div className="profile-content-section">
                    {activeTab === "bookings" ? (
                        <MyBookings bookings={bookings} />
                    ) : (
                        <AccountDetails user={user} onLogout={handleLogout} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
