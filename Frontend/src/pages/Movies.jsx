import React from 'react'
import Navigation from "../component/Home/Navigationbar/Navigation";
import CtfAd from "../component/Home/Ad_Discount/Ctfad";

const Movies = () => {
    return (
        <div>
            <Navigation />
            <CtfAd showIntro={false} />
        </div>
    )
}

export default Movies
