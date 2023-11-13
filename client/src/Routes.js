import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage.js';
import Signup from './components/Signup.js';
import Login from './components/Login.js';
import TaxPayerDashBoard from './components/dashboards/TaxPayerDashboard.js'
import AdminDashboard from './components/dashboards/AdminDashboard.js';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<HomePage />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/taxpayer-dashboard" element={<TaxPayerDashBoard />} />
        <Route exact path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
