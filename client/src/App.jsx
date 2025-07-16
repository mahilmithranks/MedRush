import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PharmacyMap from './canvas/PharmacyMap'
import Order from './pages/Order'
// import Track from './pages/Track' // Optional

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root → login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main Pages */}
        <Route path="/home" element={<PharmacyMap />} />
        <Route path="/order" element={<Order />} />
        {/* <Route path="/track" element={<Track />} /> */}
      </Routes>
    </Router>
  )
}

export default App
