import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import Account from "./pages/Account";
import RoomTypeManage from "./pages/RoomTypeManage";
import RoomManage from "./pages/RoomManage";
import AccountManage from "./pages/AccountManage";

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    setIsAuth(!!localStorage.getItem("token"));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuth ? <Navigate to="/dashboard" replace /> : <Login setIsAuth={setIsAuth} />
          }
        />
        <Route
          path="/logout"
          element={<Logout setIsAuth={setIsAuth} />}
        />
        <Route path="/account" element={<Account setIsAuth={setIsAuth} />} />
        <Route
          path="/*"
          element={
            <RequireAuth>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin/roomTypes" element={<RoomTypeManage />} /> 
                  <Route path="/admin/rooms" element={<RoomManage />} /> 
                  <Route path="/admin/accounts" element={<AccountManage />} /> 
                </Routes>
              </Layout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
