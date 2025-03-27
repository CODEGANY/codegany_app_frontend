import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import DashboardPage from "./pages/DashboardPage";
import { AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <div>Chargement...</div>; // Affiche un loader pendant la vérification (à revoir)
  }
  return user ? children : <Navigate to="/login" />;
};

// Route publique (pour utilisateurs non connectés)
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <div>Chargement...</div>;
  }
  return user ? <Navigate to="/dashboard" /> : children;
};

function Routes_app(){
  const { loading } = useContext(AuthContext);
  if (loading) {
    return <div>Chargement...</div>;
  }
return(
<BrowserRouter>
    <Routes>
      <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
      />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage/>
        </PrivateRoute>
        } />

      <Route path="/orders" element={
        <PrivateRoute>
          <OrdersPage />
        </PrivateRoute>
        } />

      <Route path="/orders/:id" element={
        <PrivateRoute>
          <OrderDetailPage />
        </PrivateRoute>
        } />

      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  </BrowserRouter>
);
}

export default Routes_app;