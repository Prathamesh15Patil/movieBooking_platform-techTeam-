import './App.css'
import { Routes, Route } from "react-router-dom"

import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import Payment from './pages/Payment'
import Movies from './pages/Movies'
import Booking from './pages/Booking'
import Profile from './pages/Profile'
import Login from './pages/login'
import Signup from './pages/Signup'
import Navbar from './component/common/Navbar'
import Admin from './pages/Admin'
import ProtectedRoute from "./components/ProtectedRoute"
import GuestRoute from "./components/GuestRoute"

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
          <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
          <Route path="/booking/:showId" element={<ProtectedRoute><Booking /></ProtectedRoute>} />

          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  )
}

export default App