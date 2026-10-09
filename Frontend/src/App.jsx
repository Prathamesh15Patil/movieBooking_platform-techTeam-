import './App.css'
import { Routes, Route, useLocation } from "react-router-dom"
import { useState } from 'react'

import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import Payment from './pages/Payment'
import Movies from './pages/Movies'
import Booking from './pages/Booking'
import Profile from './pages/Profile'
import Navbar from './component/common/Navbar'
import Intro from "./component/common/Intro";
import Footer from "./component/common/Footer";



function App() {
  const location = useLocation();

  // Controls whether the intro is visible - only show on landing page ("/") when user enters the site
  const [showIntro, setShowIntro] = useState(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
    return location.pathname === '/' && !hasSeenIntro;
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('hasSeenIntro', 'true');
    setShowIntro(false);
  };

  return (
    <>
      {/* Intro animation */}
      {showIntro && (
        <Intro
          onComplete={handleIntroComplete}
        />
      )}
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App

