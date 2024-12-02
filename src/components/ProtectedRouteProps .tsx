import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Hier verwendest du localStorage, um den User-Status zu prüfen.
  const isAuthenticated = !!localStorage.getItem('userId'); // Gibt `true` zurück, wenn `userId` existiert

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
