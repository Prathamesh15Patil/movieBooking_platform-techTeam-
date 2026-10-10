import { useEffect } from 'react'
import './App.css'
import { Routes, Route, useLocation } from "react-router-dom"
import { useState } from 'react'

import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import Payment from './pages/Payment'
import Movies from './pages/Movies'
import Booking from './pages/Booking'
import Profile from './pages/Profile'
import ThankYou from './pages/ThankYou'
import Navbar from './component/common/Navbar'
import Intro from "./component/common/Intro";
import Footer from "./component/common/Footer";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

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
      <ScrollToTop />
      {/* Intro animation */}
      {showIntro && (
        <Intro
          onComplete={handleIntroComplete}
        />
      )}
      {!showIntro && <Navbar />}
      <div>
        <Routes>
          <Route path="/" element={<Home showIntro={showIntro} />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App

