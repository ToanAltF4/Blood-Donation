import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar/navbar';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
function HomePage() {
  return (
    <div>
      <Navbar />
      <h1 style={{ padding: '40px', textAlign: 'center' }}>Trang Chủ</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
