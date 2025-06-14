import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar/navbar';
import Footer from './component/Footer/footer';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import RegisterPage from './pages/Register';
import LoginPage from './pages/Login';
import UserProfile from './pages/profile';
import Index from './pages/Index';
import ControllAccount from './admin/controllAccount';
import ControllEvent from './admin/controllEvent';
import Dashboard from './admin/dashboard';
import ControllNews from './admin/controllNews';
import News from './pages/News';
import NewsDetail from "./pages/NewsDetail"; // đường dẫn phù hợp

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
        <Route path="/admin/events" element={<ControllEvent />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/news" element={<ControllNews />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />

        <Route path="/regEvents" element={<Dashboard />} />

        {/* Thêm các route khác nếu cần */}
      </Routes>
      <Footer />
    </Router>
    </div>
  );
}

export default App;
