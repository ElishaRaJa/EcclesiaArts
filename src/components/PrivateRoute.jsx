// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Firebase/AuthContext'; // Import useAuth to check authentication

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useAuth(); // Get the authenticated user from context

  // If the user is authenticated, render the route; otherwise, redirect to login
  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
