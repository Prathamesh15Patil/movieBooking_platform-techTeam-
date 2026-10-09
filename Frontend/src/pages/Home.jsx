import React from "react";
import "./Home.css";

import Navigation from "../component/Home/Navigationbar/Navigation";
import CtfAd from "../component/Home/Ad_Discount/Ctfad";
import TrendingMovies from "../component/Home/TrendingMovies/TrendingMovies";
import Offers from "../component/Home/Offers/Offers";
import ComingSoon from "../component/Home/ComingSoon/ComingSoon";


const Home = () => {
    return (
        <main className="home-page">

            <Navigation />
            <CtfAd />
            <TrendingMovies />
            <Offers />
            <ComingSoon />


        </main>
    );
};

export default Home;
