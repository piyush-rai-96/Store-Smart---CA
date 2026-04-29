import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDefaultRouteForAccess } from '../types';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - Wrapper component for public routes (like login)
 * Redirects to home page if user is already authenticated
 * Use this to wrap login/register pages
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    // Redirect to the user's default landing route based on their access
    return <Navigate to={getDefaultRouteForAccess(user?.accessRoutes)} replace />;
  }

  // Render the public content
  return <>{children}</>;
};
