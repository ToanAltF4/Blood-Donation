import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar/navbar';
import Footer from './component/Footer/footer';

import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import UserProfile from './pages/profile';
import Index from './pages/Index';
import ControllAccount from './admin/controllAccount';
function HomePage() {
  return (
    <div>


      <h1 style={{ padding: '40px', textAlign: 'center' }}>Trang Chủ</h1>
    </div>
  );
}

function App() {
  return (
    <div>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin/accounts" element={<ControllAccount />} />
      </Routes>
      <Footer />
    </Router>
    </div>
  );
}

export default App;
