import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES, SCREEN_TO_PATH } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute - Wrapper component for authenticated routes
 * Redirects to login page if user is not authenticated
 * Redirects to home if user lacks access to the current route
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check route-level access
  if (user && user.accessRoutes) {
    const allowedPaths = user.accessRoutes.map(screen => SCREEN_TO_PATH[screen]);
    const currentPath = location.pathname;

    // Only enforce access on actual page routes (skip redirects like /home)
    const isProtectedPath = Object.values(SCREEN_TO_PATH).some(p => currentPath.startsWith(p));
    if (isProtectedPath) {
      const hasAccess = allowedPaths.some(p => currentPath.startsWith(p));
      if (!hasAccess) {
        return <Navigate to={ROUTES.STORE_OPS_HOME} replace />;
      }
    }
  }

  return <>{children}</>;
};
