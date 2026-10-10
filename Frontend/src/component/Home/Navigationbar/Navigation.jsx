
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const scrollTimeout = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { name: "Home", path: "/", targetId: "top" },
        { name: "Movies", path: "/movies" },
        { name: "Cinemas", path: "/cinemas", targetId: "cinemas" },
        { name: "Offers", path: "/#offers", targetId: "offers" },
        { name: "Coming Soon", path: "/#coming-soon", targetId: "coming-soon" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const difference = currentScrollY - lastScrollY.current;

            // Always show the navigation near the top
            if (currentScrollY < 80) {
                setIsVisible(true);
            }
            // Scrolling down: hide the navigation
            else if (difference > 5) {
                setIsVisible(false);
            }
            // Scrolling up: show the navigation
            else if (difference < -5) {
                setIsVisible(true);
            }

            lastScrollY.current = currentScrollY;

            // Show the navigation when scrolling stops
            clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                setIsVisible(true);
            }, 250);
        };

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimeout.current);
        };
    }, []);

    // Handle smooth scroll on page load if hash exists
    useEffect(() => {
        if (location.pathname === "/" && location.hash) {
            const id = location.hash.replace("#", "");
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 150);
            }
        }
    }, [location.pathname, location.hash]);

    const handleItemClick = (e, item) => {
        if (location.pathname === "/") {
            if (item.targetId === "top") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.pushState(null, "", "/");
            } else if (item.targetId) {
                const el = document.getElementById(item.targetId);
                if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", `#${item.targetId}`);
                }
            }
        }
    };

    return (
        <nav
            className={`pp-navigation ${isVisible ? "nav-visible" : "nav-hidden"}`}
            aria-label="Main navigation"
        >
            {navItems.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={(e) => handleItemClick(e, item)}
                    className="pp-navigation-link"
                >
                    {item.name}
                </NavLink>
            ))}
        </nav>
    );
};

export default Navigation;

