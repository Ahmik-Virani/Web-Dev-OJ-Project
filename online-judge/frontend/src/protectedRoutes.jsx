// src/components/ProtectedRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useUser();

  return (
    <Route
      {...rest}
      element={user ? <Component /> : <Navigate to="/" />}
    />
  );
};

export default ProtectedRoute;
