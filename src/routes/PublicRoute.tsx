import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../types';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - Wrapper component for public routes (like login)
 * Redirects to portal home if user is already authenticated
 * Use this to wrap login/register pages
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.PORTAL} replace />;
  }

  // Render the public content
  return <>{children}</>;
};
