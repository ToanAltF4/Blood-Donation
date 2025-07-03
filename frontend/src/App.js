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
import EventDetail from './admin/EventDetail';
import Dashboard from './admin/dashboard';
import ControllNews from './admin/controllNews';
import ControllPrepareList from './admin/ControllPrepareList';
import News from './pages/News';
import NewsDetail from "./pages/NewsDetail"; 
import ChangePassword from './pages/ChangePassword'; 
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import RegisterEvent from './pages/RegisterEvent';
import MyEventRegistrations from './pages/MyEventRegistrations';
import MyDonationHistory from './pages/MyDonationHistory';
import StaffBloodBank from './pages/StaffBloodBank';
import EmergencyRequests from './admin/EmergencyRequests';
import EventReport from './admin/EventReport';
import FeedbackList from './admin/FeedbackList';

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
        <Route path="/admin/event-detail/:id" element={<EventDetail />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/news" element={<ControllNews />} />
        <Route path="/admin/ready-donors" element={<ControllPrepareList />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register-event" element={<RegisterEvent />} />
        <Route path="/my-registrations" element={<MyEventRegistrations />} />
        <Route path="/my-donation-history" element={<MyDonationHistory />} />
        <Route path="/staff/blood-bank" element={<StaffBloodBank />} />
        <Route path="/admin/emergency-requests" element={<EmergencyRequests />} />
        <Route path="/admin/event-reports" element={<EventReport />} />
        <Route path="/admin/feedback" element={<FeedbackList />} />
        {/* Thêm các route khác nếu cần */}
      </Routes>
      <Footer />
    </Router>
    </div>
  );
}

export default App;
