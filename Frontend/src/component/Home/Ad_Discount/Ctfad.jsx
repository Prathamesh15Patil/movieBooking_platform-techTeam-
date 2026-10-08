import { useEffect, useState } from "react";
import "./Ctfad.css";

const promotions = [
    {
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=85",
        eyebrow: "POPCORNPASS EXCLUSIVE",
        title: <>Big screen stories,<br />better prices.</>,
        description: "Book your next movie night and save up to 20%.",
        cta: "Explore offers →",
    },
    {
        image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=85",
        eyebrow: "WEEKDAY SPECIAL",
        title: <>More movies,<br />less spending.</>,
        description: "Enjoy special prices on weekday shows before 6 PM.",
        cta: "View weekday deals →",
    },
    {
        image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=1600&q=85",
        eyebrow: "MEMBERS GET MORE",
        title: <>Your next night out,<br />rewarded.</>,
        description: "Earn points every time you book tickets and treats.",
        cta: "Join PopcornPass →",
    },
];

const CtfAd = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isSliding, setIsSliding] = useState(true);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

        const timer = window.setInterval(() => {
            setIsSliding(true);
            setActiveSlide((currentSlide) => currentSlide + 1);
        }, 5000);

        return () => window.clearInterval(timer);
    }, []);

    const resetAfterLastSlide = (event) => {
        if (event.propertyName !== "transform" || activeSlide !== promotions.length) return;

        setIsSliding(false);
        setActiveSlide(0);
    };

    const showSlide = (slideIndex) => {
        setIsSliding(true);
        setActiveSlide(slideIndex);
    };

    const showPreviousSlide = () => {
        setIsSliding(true);
        setActiveSlide((currentSlide) => (
            currentSlide === 0 ? promotions.length - 1 : currentSlide - 1
        ));
    };

    const showNextSlide = () => {
        if (activeSlide === promotions.length) {
            setIsSliding(false);
            setActiveSlide(0);
            window.requestAnimationFrame(() => {
                setIsSliding(true);
                setActiveSlide(1);
            });
            return;
        }

        showSlide(activeSlide + 1);
    };

    return (
        <section className="ad-discount" aria-label="Featured promotions">
            <div className="ad-banner-carousel">
                <div
                    className={`ad-banner-track${isSliding ? " is-sliding" : ""}`}
                    onTransitionEnd={resetAfterLastSlide}
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                    {[...promotions, promotions[0]].map((promotion, index) => (
                        <a
                            className="ad-banner ad-banner-wide"
                            href="#movies"
                            key={`${promotion.eyebrow}-${index}`}
                            aria-hidden={index !== activeSlide}
                            tabIndex={index === activeSlide ? 0 : -1}
                        >
                            <img src={promotion.image} alt="" />
                            <div className="ad-banner-shade" />
                            <div className="ad-banner-copy">
                                <span>{promotion.eyebrow}</span>
                                <h1>{promotion.title}</h1>
                                <p>{promotion.description}</p>
                            </div>
                            <span className="ad-banner-cta">{promotion.cta}</span>
                        </a>
                    ))}
                </div>
                <button
                    className="ad-carousel-arrow ad-carousel-arrow-left"
                    type="button"
                    aria-label="Previous promotion"
                    onClick={showPreviousSlide}
                >
                    &#8249;
                </button>
                <button
                    className="ad-carousel-arrow ad-carousel-arrow-right"
                    type="button"
                    aria-label="Next promotion"
                    onClick={showNextSlide}
                >
                    &#8250;
                </button>
                <div className="ad-carousel-dots" aria-label="Promotion slides">
                    {promotions.map((promotion, index) => (
                        <button
                            className={`ad-carousel-dot${index === activeSlide % promotions.length ? " is-active" : ""}`}
                            type="button"
                            aria-label={`Show promotion ${index + 1}`}
                            aria-current={index === activeSlide % promotions.length ? "true" : undefined}
                            key={promotion.eyebrow}
                            onClick={() => showSlide(index)}
                        />
                    ))}
                </div>
            </div>

            <div className="ad-banner ad-banner-video">
                <video autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80">
                    <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
                </video>
                <div className="ad-video-shade" />
                <div className="ad-video-copy">
                    <span>TRENDING</span>
                    <strong>Watch the<br />trailer</strong>
                </div>
            </div>
        </section>
    );
};

export default CtfAd;
