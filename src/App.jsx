import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ParentDashboard from './pages/ParentDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Navbar from './components/Navbar';

// Simple mock protection wrapper
const ProtectedRoute = ({ children, role }) => {
  const isAuthenticated = localStorage.getItem(`${role}_auth`) === 'true';
  if (!isAuthenticated) {
    return <Navigate to={`/${role}/login`} replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Login Routes */}
        <Route path="/student/login" element={<Login role="Student" redirectTo="/student" />} />
        <Route path="/driver/login" element={<Login role="Driver" redirectTo="/driver" />} />
        <Route path="/admin/login" element={<Login role="Admin" redirectTo="/admin" />} />

        {/* Protected Dashboards */}
        <Route path="/student" element={
          <ProtectedRoute role="student">
            <ParentDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/driver" element={
          <ProtectedRoute role="driver">
            <DriverDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;