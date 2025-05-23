import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/NavBar';
import Pendientes from './pages/Pendientes';
import HomeDistritos from './pages/HomeDistritos';


function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            user ? <Home /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/pendientes"
          element={user ? <Pendientes /> : <Navigate to="/login" />}
        />
        <Route
          path="/distritos"
          element={user ? <HomeDistritos /> : <Navigate to="/distritos" />}
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
