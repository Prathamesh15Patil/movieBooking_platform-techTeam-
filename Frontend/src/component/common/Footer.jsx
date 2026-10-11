
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const handleSubscribe = (event) => {
        event.preventDefault();
        // Connect this form to a newsletter service or backend later.
    };

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
                        Your ticket to unforgettable movie experiences.
                        Discover movies, find your favourite seats, and
                        make every movie night special.
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
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a
                            href="https://www.reddit.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Reddit"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.687-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.562-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-4.566 3.865a.326.326 0 0 0-.05.457c.571.748 1.47 1.157 2.366 1.157.897 0 1.796-.409 2.366-1.157a.326.326 0 0 0-.05-.457.327.327 0 0 0-.457.05c-.443.58-1.16.892-1.859.892-.698 0-1.416-.312-1.859-.892a.324.324 0 0 0-.457-.05z"/>
                            </svg>
                        </a>
                        <a
                            href="https://www.youtube.com/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="YouTube"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Explore */}
                <div className="pp-footer-column">
                    <h3>Explore</h3>
                    <Link to="/">Home</Link>
                    <Link to="/movies">Movies</Link>
                    <Link to="/cinemas">Cinemas</Link>
                    <Link to="/offers">Offers</Link>
                    <Link to="/coming-soon">Coming Soon</Link>
                </div>

                {/* Support */}
                <div className="pp-footer-column">
                    <h3>Help & Support</h3>
                    <a href="mailto:support@popcornpass.com">Contact Us</a>
                    <Link to="/my-bookings">My Bookings</Link>
                    <Link to="/faq">FAQs</Link>
                    <Link to="/terms">Terms & Conditions</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                </div>

                {/* Newsletter */}
                <div className="pp-footer-newsletter">
                    <h3>Stay in the loop</h3>
                    <p>
                        Get movie updates, exciting offers, and the latest
                        releases delivered to your inbox.
                    </p>

                    <form
                        className="pp-footer-form"
                        onSubmit={handleSubscribe}
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            aria-label="Email address"
                            required
                        />
                        <button type="submit" aria-label="Subscribe">
                            →
                        </button>
                    </form>

                    <span className="pp-footer-note">
                        Lights, camera, inbox! 🎬
                    </span>
                </div>
            </div>

            <div className="pp-footer-divider" />

            <div className="pp-footer-bottom">
                <p>
                    © {currentYear} PopcornPass. All rights reserved.
                </p>

                <p className="pp-footer-made">
                    Made with <span>♥</span> for movie lovers
                </p>
            </div>
        </footer>
    );
};

export default Footer;