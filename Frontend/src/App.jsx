import { useEffect } from 'react'
import './App.css'
import { Routes, Route, useLocation } from "react-router-dom"


import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import Payment from './pages/Payment'
import Movies from './pages/Movies'
import Booking from './pages/Booking'
import Profile from './pages/Profile'
import Navbar from './component/common/Navbar'

function App() {

  return (
    <>
      <ScrollToTop />
      {/* Intro animation */}
      {showIntro && (
        <Intro
          onComplete={handleIntroComplete}
        />
      )}
      <Navbar />

      <div>
        <Routes>
          <Route path="/" element={<Home showIntro={showIntro} />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/booking" element={<Booking />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
