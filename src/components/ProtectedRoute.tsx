import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('authToken');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]); 

  return isAuthenticated ? <>{children}</> : null;
};

export  default ProtectedRoute;