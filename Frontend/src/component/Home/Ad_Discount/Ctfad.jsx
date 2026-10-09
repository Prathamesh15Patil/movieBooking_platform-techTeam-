import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

const TRAILER_LOOP_SECONDS = 40;

const CtfAd = ({ showIntro = false }) => {
    const sectionRef = useRef(null);
    const modalVideoRef = useRef(null);
    const modalContainerRef = useRef(null);

    const [isInView, setIsInView] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [isSliding, setIsSliding] = useState(true);

    // Trailer modal state
    const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        if (showIntro) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [showIntro]);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

        const timer = window.setInterval(() => {
            setIsSliding(true);
            setActiveSlide((currentSlide) => {
                if (currentSlide >= promotions.length) {
                    setIsSliding(false);
                    return 0;
                }

                return currentSlide + 1;
            });
        }, 5000);

        return () => window.clearInterval(timer);
    }, []);

    useEffect(() => {
        const recoverCarousel = () => {
            if (document.hidden) return;

            setIsSliding(false);
            setActiveSlide((currentSlide) => (
                currentSlide >= promotions.length ? 0 : currentSlide
            ));
        };

        document.addEventListener("visibilitychange", recoverCarousel);
        return () => document.removeEventListener("visibilitychange", recoverCarousel);
    }, []);

    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isTrailerModalOpen) {
                closeTrailerModal();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isTrailerModalOpen]);

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

    const openTrailerModal = () => {
        setIsTrailerModalOpen(true);
        setIsPlaying(true);
        setIsMuted(false);
    };

    const closeTrailerModal = () => {
        setIsTrailerModalOpen(false);
        setIsPlaying(true);
        setIsMuted(false);
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => { });
        }
    };

    const togglePlayPause = () => {
        if (modalVideoRef.current) {
            if (isPlaying) {
                modalVideoRef.current.pause();
                setIsPlaying(false);
            } else {
                modalVideoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const toggleMute = () => {
        if (modalVideoRef.current) {
            modalVideoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleFullscreen = () => {
        if (modalVideoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            } else if (modalVideoRef.current.requestFullscreen) {
                modalVideoRef.current.requestFullscreen().catch(() => { });
            } else if (modalVideoRef.current.webkitRequestFullscreen) {
                modalVideoRef.current.webkitRequestFullscreen();
            }
        }
    };

    return (
        <>
            <section ref={sectionRef} className={`ad-discount${isInView ? " in-view" : ""}`} aria-label="Featured promotions">
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

                <div
                    className="ad-banner ad-banner-video"
                    onClick={openTrailerModal}
                    role="button"
                    tabIndex={0}
                    aria-label="Watch full movie trailer"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            openTrailerModal();
                        }
                    }}
                >
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80"
                        onTimeUpdate={(event) => {
                            const video = event.currentTarget;
                            if (video.currentTime >= TRAILER_LOOP_SECONDS) {
                                video.currentTime = 0;
                                video.play();
                            }
                        }}
                    >
                        <source src="Doraemon_Movie.mp4" type="video/mp4" />
                    </video>
                    <div className="ad-video-shade" />
                    <div className="ad-video-copy">
                        <span>TRENDING</span>
                        <strong>Watch the<br />trailer</strong>
                    </div>
                </div>
            </section>

            {/* Full Trailer Modal Screen */}
            {isTrailerModalOpen && (
                <div
                    className="trailer-modal-overlay"
                    onClick={closeTrailerModal}
                    ref={modalContainerRef}
                >
                    <div
                        className="trailer-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="trailer-modal-close"
                            type="button"
                            aria-label="Close trailer"
                            onClick={closeTrailerModal}
                        >
                            ✕
                        </button>

                        <div className="trailer-modal-grid">
                            {/* Video Player Column */}
                            <div className="trailer-video-wrapper">
                                <video
                                    ref={modalVideoRef}
                                    src="Doraemon_Movie.mp4"
                                    autoPlay
                                    loop
                                    playsInline
                                    muted={isMuted}
                                    className="trailer-modal-video"
                                />

                                {/* Controls bar overlay */}
                                <div className="trailer-video-controls">
                                    <button
                                        type="button"
                                        className="trailer-ctrl-btn"
                                        onClick={togglePlayPause}
                                    >
                                        {isPlaying ? " Pause" : " Play"}
                                    </button>

                                    <button
                                        type="button"
                                        className="trailer-ctrl-btn"
                                        onClick={toggleMute}
                                    >
                                        {isMuted ? " Muted" : " Sound On"}
                                    </button>

                                    <button
                                        type="button"
                                        className="trailer-ctrl-btn"
                                        onClick={handleFullscreen}
                                    >
                                        ⛶ Fullscreen
                                    </button>
                                </div>
                            </div>

                            {/* Movie Details Column */}
                            <div className="trailer-modal-details">
                                <span className="trailer-badge">
                                    POPCORNPASS EXCLUSIVE TRAILER
                                </span>

                                <h2 className="trailer-title">
                                    Doraemon: Castle of the Undersea Devil
                                </h2>

                                <div className="trailer-meta-tags">
                                    <span className="trailer-tag rating">★ 8.8 / 10</span>
                                    <span className="trailer-tag votes">12.6K+ Votes</span>
                                    <span className="trailer-tag format">2D • 3D • IMAX</span>
                                </div>

                                <div className="trailer-info-list">
                                    <p><strong>Genre:</strong> Animation / Adventure / Fantasy</p>
                                    <p><strong>Duration:</strong> 1h 48m</p>
                                    <p><strong>Language:</strong> English / Japanese</p>
                                </div>

                                <p className="trailer-synopsis">
                                    Join Doraemon, Nobita, and their friends on a thrilling underwater voyage. Discover lost undersea civilizations, battle mysterious deep-sea guardians, and experience the ultimate big-screen adventure!
                                </p>

                                <div className="trailer-actions">
                                    <Link to="/booking" className="trailer-book-btn" onClick={closeTrailerModal}>
                                        Book a Ticket
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CtfAd;
