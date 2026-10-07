import './App.css'
import { Routes, Route } from "react-router-dom"
import { useState } from 'react'

import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import Payment from './pages/Payment'
import Movies from './pages/Movies'
import Booking from './pages/Booking'
import Profile from './pages/Profile'
import Navbar from './component/common/Navbar'
import Intro from "./component/common/Intro";

function App() {

  // Controls whether the intro is visible 
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {/* Intro animation */}
      {showIntro && (
        <Intro
          onComplete={() => setShowIntro(false)}
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
    </>
  )
}

export default App
