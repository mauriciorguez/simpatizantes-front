import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/NavBar';
import Pendientes from './pages/Pendientes';
import HomeDistritos from './pages/HomeDistritos';
import DashBoard from './pages/DashBoard';

function AppRoutes() {
  const { user } = useAuth();
  console.log(user);

  return (
    <>
      {user && <Navbar />}
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={user ? <Navigate to={user.email === 'Admin' ? '/dashboard' : '/'} /> : <Login />}
        />

        {/* DASHBOARD (solo Admin) */}
        <Route
          path="/dashboard"
          element={
            user?.email === 'Admin' ? <DashBoard /> : <Navigate to="/login" />
          }
        />

        {/* HOME (solo no Admin) */}
        <Route
          path="/"
          element={
            user
              ? user.email === 'Admin'
                ? <Navigate to="/dashboard" />
                : <Home />
              : <Navigate to="/login" />
          }
        />

        {/* PENDIENTES (solo no Admin) */}
        <Route
          path="/pendientes"
          element={
            user
              ? user.email !== 'Admin'
                ? <Pendientes />
                : <Navigate to="/dashboard" />
              : <Navigate to="/login" />
          }
        />

        {/* DISTRITOS (solo no Admin) */}
        <Route
          path="/distritos"
          element={
            user
              ? user.email !== 'Admin'
                ? <HomeDistritos />
                : <Navigate to="/dashboard" />
              : <Navigate to="/login" />
          }
        />
      </Routes>
    </>
  );
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
