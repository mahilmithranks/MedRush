import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check for the token in localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token exists, redirect the user to the login page
    return <Navigate to="/login" />;
  }

  // If a token exists, render the child component (the protected page)
  return children;
};

export default ProtectedRoute;