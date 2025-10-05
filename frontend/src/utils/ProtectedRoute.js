import React from 'react';
import { Navigate } from 'react-router-dom';
import { UseAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { IsAuthenticated, IsLoading } = UseAuth();

  if (IsLoading) {
    return (
      <div className="Loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!IsAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;