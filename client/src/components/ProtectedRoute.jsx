import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = sessionStorage.getItem("token");
  const userData = sessionStorage.getItem("userData");

  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  const { role } = JSON.parse(userData);

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
