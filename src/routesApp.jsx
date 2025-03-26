import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function Routes_app(){
return(
<BrowserRouter>
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </BrowserRouter>
);
}

export default Routes_app;