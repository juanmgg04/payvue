import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import PaymentHistory from './pages/PaymentHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/records" element={<Records />} />
        <Route path="/history" element={<PaymentHistory />} />
      </Routes>
    </Router>
  );
}

export default App;