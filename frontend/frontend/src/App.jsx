import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import PharmacistDashboard from './pages/PharmacistDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Import the new component

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Role-Based Dashboards */}
        <Route 
          path="/customer/dashboard" 
          element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/pharmacist/dashboard" 
          element={<ProtectedRoute><PharmacistDashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/delivery/dashboard" 
          element={<ProtectedRoute><DeliveryDashboard /></ProtectedRoute>} 
        />
      </Routes>
    </Router>
  );
}

export default App;