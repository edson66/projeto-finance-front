import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function RotaProtegida() {
  const token = localStorage.getItem('authToken');

  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
}

export default RotaProtegida;