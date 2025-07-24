import { Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import { SignUp, SignIn, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import SelectRole from './pages/SelectRole';

// Import all your page and helper components
import ProtectedRoute from './components/ProtectedRoute';
import CustomerDashboard from './pages/CustomerDashboard';
import PharmacistDashboard from './pages/PharmacistDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import PendingApproval from './pages/PendingApproval';
import UploadDocuments from './pages/UploadDocuments';
import AdminDashboard from './pages/AdminDashboard';
import UploadPrescription from './pages/UploadPrescription'; // The missing import is now added

// This helper component correctly reads the role from the URL
// and passes it to Clerk during the sign-up process.
function SignUpWithRole() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const metadata = {
    role: role,
    isApproved: role === 'customer' || role === 'admin' ? true : false,
  };
  return <SignUp routing="path" path="/sign-up" unsafeMetadata={metadata} redirectUrl="/upload-documents" />;
}

// This component handles redirecting users to the correct dashboard
// after they sign in.
function DashboardRedirect() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  // Move the navigation logic inside a useEffect hook
  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata.role;
      const isApproved = user.publicMetadata.isApproved;

      if (role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
      } else if (role === 'customer') {
        navigate('/customer-dashboard', { replace: true });
      } else if (role === 'pharmacist' || role === 'delivery-partner') {
        if (isApproved) {
          navigate(`/${role}-dashboard`, { replace: true });
        } else {
          navigate('/pending-approval', { replace: true });
        }
      }
    }
  }, [isLoaded, user, navigate]); // Add dependencies to the hook

  // Return a loading indicator while the redirect happens
  return <div className="flex items-center justify-center h-screen">Redirecting...</div>;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<SelectRole />} />
      <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" redirectUrl="/dashboard-redirect" />} />
      <Route path="/sign-up/*" element={<SignUpWithRole />} />

      {/* Post-Auth Flow Routes */}
      <Route path="/upload-documents" element={<UploadDocuments />} />
      <Route path="/dashboard-redirect" element={<DashboardRedirect />} />
      <Route path="/pending-approval" element={<PendingApproval />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/admin-dashboard"
        element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>}
      />
      <Route
        path="/customer-dashboard"
        element={<ProtectedRoute requiredRole="customer"><CustomerDashboard /></ProtectedRoute>}
      />
      <Route
        path="/pharmacist-dashboard"
        element={<ProtectedRoute requiredRole="pharmacist" requireApproved={true}><PharmacistDashboard /></ProtectedRoute>}
      />
      <Route
        path="/delivery-dashboard"
        element={<ProtectedRoute requiredRole="delivery-partner" requireApproved={true}><DeliveryDashboard /></ProtectedRoute>}
      />
      <Route
        path="/upload-prescription"
        element={<ProtectedRoute requiredRole="customer"><UploadPrescription /></ProtectedRoute>}
      />
    </Routes>
  );
}
