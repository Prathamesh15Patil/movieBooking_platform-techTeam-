import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Searchbar from "./Searchbar";
import CitySelector from "./CitySelector";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const location = useLocation();
    const { user, logout, openAuthModal } = useAuth();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [activeHash, setActiveHash] = useState(() => location.hash || "");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setActiveHash(location.hash || "");
    }, [location.hash]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close dropdown on route change
    useEffect(() => {
        setDropdownOpen(false);
    }, [location.pathname]);

    const navItems = [
        { name: "Home", path: "/", targetId: "top" },
        { name: "Movies", path: "/movies" },
        { name: "Offers", path: "/#offers", targetId: "offers" },
        { name: "Coming Soon", path: "/#coming-soon", targetId: "coming-soon" },
    ];

    const handleNavClick = (e, item) => {
        if (location.pathname === "/") {
            if (item.targetId === "top") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.pushState(null, "", "/");
                setActiveHash("");
            } else if (item.targetId) {
                const el = document.getElementById(item.targetId);
                if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", `#${item.targetId}`);
                    setActiveHash(`#${item.targetId}`);
                }
            }
        }
    };

    const isItemActive = (item) => {
        if (item.path === "/movies") return location.pathname === "/movies";
        if (location.pathname === "/") {
            if (item.targetId === "top") return !activeHash || activeHash === "#top";
            if (item.targetId) return activeHash === `#${item.targetId}`;
        }
        return false;
    };

    return (
        <nav className={`navbar ${isSearchFocused ? "search-active" : ""}`}>
            {/* Logo */}
            <Link to="/" className="navbar-logo">
                🎬 PopcornPass
            </Link>

            {/* Navigation links inside Navbar */}
            <div className="navbar-nav-links">
                {navItems.map((item) => {
                    const active = isItemActive(item);
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={(e) => handleNavClick(e, item)}
                            className={`navbar-nav-link ${active ? "is-active" : ""}`}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            {/* Search Bar wrapper placed right after navigation links */}
            <div className={`navbar-search-wrapper ${isSearchFocused ? "focused" : ""}`}>
                <Searchbar onFocusChange={setIsSearchFocused} />
            </div>

            {/* Right side */}
            <div className="navbar-right">
                <CitySelector />

                {user ? (
                    <div className="user-menu-container" ref={dropdownRef}>
                        <button
                            type="button"
                            className="user-name-btn"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            aria-expanded={dropdownOpen}
                        >
                            <span className="user-avatar-circle">
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </span>
                            <span className="user-name-label">{user.name}</span>
                            <svg
                                className={`user-chevron ${dropdownOpen ? "open" : ""}`}
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="user-dropdown-menu">
                                <div className="dropdown-user-header">
                                    <span className="dropdown-greet">Signed in as</span>
                                    <strong className="dropdown-name">{user.name}</strong>
                                    {user.email && (
                                        <span className="dropdown-email">{user.email}</span>
                                    )}
                                </div>
                                <div className="dropdown-divider" />
                                <Link
                                    to="/my-bookings"
                                    className="dropdown-menu-item"
                                    onClick={() => setDropdownOpen(false)}
                                >

                                    <span>My Bookings</span>
                                </Link>
                                <Link
                                    to="/profile"
                                    className="dropdown-menu-item"
                                    onClick={() => setDropdownOpen(false)}
                                >

                                    <span>Profile</span>
                                </Link>
                                <div className="dropdown-divider" />
                                <button
                                    type="button"
                                    className="dropdown-menu-item dropdown-logout-btn"
                                    onClick={() => {
                                        logout();
                                        setDropdownOpen(false);
                                    }}
                                >

                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        className="signin-button"
                        onClick={openAuthModal}
                    >
                        Sign Up
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;