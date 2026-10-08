import React from "react";
import "./CtfAd.css";

const CtfAd = () => {
    return (
        <section className="ad-discount" aria-label="Featured promotions">
            <a className="ad-banner ad-banner-wide" href="#movies">
                <img
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=85"
                    alt="Featured movie promotion"
                />

                <div className="ad-banner-shade" />

                <div className="ad-banner-copy">
                    <span>POPCORNPASS EXCLUSIVE</span>

                    <h1>
                        Big screen stories,
                        <br />
                        better prices.
                    </h1>

                    <p>
                        Book your next movie night and save up to 20%.
                    </p>
                </div>

                <span className="ad-banner-cta">
                    Explore offers →
                </span>
            </a>

            <div className="ad-banner ad-banner-video">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80"
                >
                    <source
                        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                        type="video/mp4"
                    />
                </video>

                <div className="ad-video-shade" />

                <div className="ad-video-copy">
                    <span>NOW SHOWING</span>

                    <strong>
                        Watch the
                        <br />
                        trailer
                    </strong>
                </div>
            </div>
        </section>
    );
};

export default CtfAd;