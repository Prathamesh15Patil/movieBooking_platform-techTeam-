import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Offers.css";

const offers = [
    {
        image: "/pop1.png",
        alt: "Popcorn for movie night",
        eyebrow: "THE PERFECT COMBO",
        title: "Movie night tastes better with popcorn.",
        description:
            "Grab your favorite snacks and make every movie moment count.",
        button: "Explore Movies",
    },
    {
        image: "/ticket1.png",
        alt: "Movie ticket",
        eyebrow: "YOUR NEXT BIG-SCREEN MOMENT",
        title: "Your next favorite movie is one ticket away.",
        description:
            "Discover movies, choose your seats, and enjoy an unforgettable cinema experience.",
        button: "Book Your Tickets",
    },
];


const Offers = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [phase, setPhase] = useState("enter");
    const [timerKey, setTimerKey] = useState(0);

    // Automatic slide animation — restarts whenever timerKey changes
    useEffect(() => {
        const interval = setInterval(() => {
            setPhase("exit");

            setTimeout(() => {
                setActiveIndex((current) => (current + 1) % offers.length);
                setPhase("enter");

                setTimeout(() => {
                    setPhase("idle");
                }, 750);
            }, 650);
        }, 4500);

        return () => clearInterval(interval);
    }, [timerKey]);

    // Arrow click: animate the transition and restart the timer
    const handleNext = () => {
        setPhase("exit");

        setTimeout(() => {
            setActiveIndex((current) => (current + 1) % offers.length);
            setPhase("enter");

            setTimeout(() => {
                setPhase("idle");
            }, 750);
        }, 650);

        // Restart the 4.5-second automatic cycle
        setTimerKey((current) => current + 1);
    };

    const offer = offers[activeIndex];

    return (
        <section id="offers" className="pp-offers">
            <div className="pp-offers-heading">
                <span className="pp-offers-eyebrow">MORE THAN A MOVIE</span>
                <h2>
                    The <span>PopcornPass</span> experience
                </h2>
                <p>Little things that make movie nights special.</p>
            </div>

            <div className={`pp-offers-card phase-${phase}`}>
                <div className="pp-offers-visual">
                    <div className="pp-offers-image-frame">
                        <img
                            key={offer.image}
                            src={offer.image}
                            alt={offer.alt}
                            className="pp-offers-image"
                        />
                    </div>
                </div>

                <div className="pp-offers-content">
                    <span className="pp-offers-label">
                        {offer.eyebrow}
                    </span>
                    <h3>{offer.title}</h3>
                    <p>{offer.description}</p>

                    <NavLink to="/movies" className="pp-offers-button">
                        {offer.button}
                    </NavLink>
                </div>

                <button
                    type="button"
                    className="pp-offers-next"
                    aria-label="Show next offer"
                    onClick={handleNext}
                >
                    &gt;
                </button>
            </div>
        </section>
    );
};

export default Offers;