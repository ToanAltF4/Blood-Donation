import React from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css'; // (Tùy chọn) để tách style riêng

function Navbar() {
    const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Điều hướng đến trang đăng nhập
  };
  return (
    <header className="navbar-container">
      <div className="navbar-top">
        <div className="contact-info">
            Hotline Khẩn Cấp
            <br></br>
            <span className='phone'>1900 868 638</span>
        </div>

        <div className="brand-logo">
            <img src="/logo.svg" alt="MyApp Logo" />
        </div>

        <div className="login-button-navbar">
            <button onClick={handleLoginClick}><img src="/icon/human.svg"/> Đăng nhập</button>
        </div>
    </div>

      <nav className="navbar-bottom">
        <ul className="navbar-links">
          <li><a href="/">TRANG CHỦ</a></li>
          <li><a href="/about">GIỚI THIỆU</a></li>
          <li><a href="/services">ĐĂNG KÝ LỊCH</a></li>
          <li><a href="/blog">TIN TỨC</a></li>
          <li><a href="/contact">LIÊN HỆ</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
