import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import PrivateRoute from "components/PrivateRoute";

const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      
      <Route path="admin/*" element={
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      } />
      
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;
