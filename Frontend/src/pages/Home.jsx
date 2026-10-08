import React from "react";
import "./Home.css";

import CtfAd from "../component/Home/Ad_Discount/Ctfad";

const Home = () => {
    return (
        <main className="home-page">

            <CtfAd />

            <section id="movies" className="home-content">
                <h2>Welcome to PopcornPass</h2>
            </section>

        </main>
    );
};

export default Home;