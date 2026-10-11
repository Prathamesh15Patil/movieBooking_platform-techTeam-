import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="pp-footer">
            <div className="pp-footer-main">
                {/* Brand */}
                <div className="pp-footer-brand">
                    <Link to="/" className="pp-footer-logo">
                        <span className="pp-footer-logo-icon">🎬</span>
                        <span>
                            Popcorn<span className="pp-footer-accent">Pass</span>
                        </span>
                    </Link>

                    <p className="pp-footer-description">
                        Your premier destination for hassle-free movie ticketing.
                        Discover the latest movies, explore theater showtimes, and book your favorite seats with ease.
                    </p>

                    <div className="pp-footer-socials">
                        <a
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Instagram"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a
                            href="https://www.facebook.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Facebook"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a
                            href="https://twitter.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Twitter / X"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.youtube.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="YouTube"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* About The Project */}
                <div className="pp-footer-column pp-footer-project-info">
                    <h3>About The Project</h3>
                    <p className="pp-project-desc">
                        PopcornPass is an end-to-end online movie ticket booking platform crafted to deliver a modern, seamless cinema experience. From exploring trending blockbusters and watching trailers to checking live showtimes across theaters, selecting premium seats, and enjoying hassle-free checkout.
                    </p>
                </div>

                {/* Navbar Links */}
                <div className="pp-footer-column">
                    <h3>Navigation</h3>
                    <Link to="/">Home</Link>
                    <Link to="/movies">Movies</Link>
                    <Link to="/#offers">Offers</Link>
                    <Link to="/#coming-soon">Coming Soon</Link>
                </div>
            </div>

            <div className="pp-footer-divider" />

            <div className="pp-footer-bottom">
                <p>
                    © {currentYear} PopcornPass. All rights reserved.
                </p>

                <p className="pp-footer-made">
                    Made with <span>♥</span> by Tech Team
                </p>
            </div>
        </footer>
    );
};

export default Footer;