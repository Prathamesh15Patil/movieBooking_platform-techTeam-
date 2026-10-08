import React from "react";
import "./Home.css";

import CtfAd from "../component/Home/Ad_Discount/Ctfad";
import TrendingMovies from "../component/Home/TrendingMovies/TrendingMovies";

const Home = () => {
    return (
        <main className="home-page">

            <CtfAd />
            <TrendingMovies />

        </main>
    );
};

export default Home;
