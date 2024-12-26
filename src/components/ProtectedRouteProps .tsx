import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Hier verwendest du localStorage, um den User-Status zu prüfen.
  const isAuthenticated = !!localStorage.getItem('userId'); 
  const isAdmin = localStorage.getItem('userAdmin') === 'true';
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
