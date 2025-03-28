import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import DashboardPage from "./pages/DashboardPage";
import { AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import RequestDetailPage from './pages/RequestDetailPage';
import NewRequestPage from './pages/NewRequestPage';
import SuppliersPage from './pages/SuppliersPage';
import LoadingSpinner from "./components/ui-components/LoadingSpinner";

/**
 * Full-screen centered loading component
 * @param {Object} props - Component props
 * @param {string} [props.text] - Optional text to display below spinner
 */
const LoadingScreen = ({ text = "Chargement en cours..." }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <LoadingScreen />;
  }
  return user ? children : <Navigate to="/login" />;
};

// Route publique (pour utilisateurs non connectés)
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <LoadingScreen />;
  }
  return user ? <Navigate to="/dashboard" /> : children;
};

function Routes_app(){
  const { loading } = useContext(AuthContext);
  if (loading) {
    return <LoadingScreen />;
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

        <Route path="/requests/:id" element={
          <PrivateRoute>
            <RequestDetailPage />
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

        <Route path="/requests/new" element={
          <PrivateRoute>
            <NewRequestPage />
          </PrivateRoute>
          } />
          
        <Route path="/suppliers" element={
          <PrivateRoute>
            <SuppliersPage />
          </PrivateRoute>
          } />

        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default Routes_app;