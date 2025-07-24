import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, requireApproved = false }) => {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }
  
  const userRole = user.publicMetadata.role;
  const isApproved = user.publicMetadata.isApproved;

  // 1. Check if the user's role matches
  if (userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  // 2. If approval is required, check the isApproved flag
  if (requireApproved && !isApproved) {
    return <Navigate to="/pending-approval" />;
  }

  return children;
};

export default ProtectedRoute;