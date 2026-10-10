import React from "react";
import "./Home.css";

import CtfAd from "../component/Home/Ad_Discount/Ctfad";
import TrendingMovies from "../component/Home/TrendingMovies/TrendingMovies";
import Offers from "../component/Home/Offers/Offers";
import ComingSoon from "../component/Home/ComingSoon/ComingSoon";

const Home = ({ showIntro = false }) => {
    return (
        <main className="home-page">
            <CtfAd showIntro={showIntro} />
            <TrendingMovies showIntro={showIntro} />
            <Offers showIntro={showIntro} />
            <ComingSoon showIntro={showIntro} />
        </main>
    );
};

export default Home;
