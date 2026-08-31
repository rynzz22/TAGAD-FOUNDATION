import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../modules/auth/AuthContext';
import { AppRole } from '../types';

interface ProtectedRouteProps {
  roles?: (AppRole | string)[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0) {
    const hasAnyAllowedRole = roles.some(r => hasRole(r as AppRole));
    if (!hasAnyAllowedRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
};


