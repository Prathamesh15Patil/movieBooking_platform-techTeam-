import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Searchbar from "./Searchbar";
import CitySelector from "./CitySelector";
import "./Navbar.css";

const Navbar = () => {
    const location = useLocation();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [activeHash, setActiveHash] = useState(() => location.hash || "");

    useEffect(() => {
        setActiveHash(location.hash || "");
    }, [location.hash]);

    const navItems = [
        { name: "Home", path: "/", targetId: "top" },
        { name: "Movies", path: "/movies" },
        { name: "Cinemas", path: "/cinemas", targetId: "cinemas" },
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
        if (item.path === "/cinemas") return location.pathname === "/cinemas";
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

                <Link to="/login" className="signin-button">
                    Sign In
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;