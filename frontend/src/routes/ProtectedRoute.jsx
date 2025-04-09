// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import our custom auth hook

// This component wraps routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); // Get auth state and loading status
  const location = useLocation(); // Get current location to redirect back after login

  // If the initial authentication check is still loading, show a loading message
  // This prevents briefly showing the protected content or login page unnecessarily
  if (loading) {
    return <div>Loading authentication status...</div>; // Or a spinner component
  }

  // If not authenticated (and loading is finished), redirect to login
  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to in the 'state'. This allows us to redirect them back
    // to the intended page after they successfully log in.
    // 'replace' avoids adding the login route to the browser history unnecessarily.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child components (the actual protected page)
  return children;
};

export default ProtectedRoute;