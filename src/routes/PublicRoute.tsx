import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../types';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - Wrapper component for public routes (like login)
 * Redirects to home page if user is already authenticated
 * Use this to wrap login/register pages
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Redirect to home if already authenticated
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Render the public content
  return <>{children}</>;
};
