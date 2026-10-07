import './App.css'
import { Routes, Route } from "react-router-dom"

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
