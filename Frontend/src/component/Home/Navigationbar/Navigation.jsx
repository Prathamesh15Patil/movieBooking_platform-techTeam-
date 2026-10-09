
import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";

const Navigation = () => {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const scrollTimeout = useRef(null);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Movies", path: "/movies" },
        { name: "Cinemas", path: "/cinemas" },
        { name: "Offers", path: "/offers" },
        { name: "Coming Soon", path: "/coming-soon" },
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

    return (
        <nav
            className={`pp-navigation ${isVisible ? "nav-visible" : "nav-hidden"
                }`}
            aria-label="Main navigation"
        >
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                        `pp-navigation-link${isActive ? " active" : ""}`
                    }
                >
                    {item.name}
                </NavLink>
            ))}
        </nav>
    );
};

export default Navigation;

