import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
      if (userObj.user_id) {
        localStorage.setItem('user_id', userObj.user_id);
      }
    }

    // Đóng dropdown khi click ngoài
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/'); // hoặc reload: window.location.reload();
  };

  return (
    <header className="navbar-container">
      <div className="navbar-top">
        <div className="contact-info">
          Hotline Khẩn Cấp<br />
          <span className="phone">1900 868 638</span>
        </div>

        <div className="brand-logo">
          <img src="/logo.svg" alt="MyApp Logo" />
        </div>

        <div className="login-button-navbar" ref={dropdownRef}>
          {user ? (
            <div className="user-dropdown">
              <div className="user-name" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img src="/icon/human.svg" alt="user" /> {user.full_name} ▼
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={() => navigate('/profile')}>Sự kiện đã đăng ký</div>
                  <div className="dropdown-item" onClick={() => navigate('/profile')}>Lịch sử hiến máu</div>
                  <div className="dropdown-item" onClick={() => navigate('/profile')}>Thông tin cá nhân</div>
                  <hr></hr>
                  <div className="dropdown-item" onClick={handleLogout}>Đăng xuất</div>
                  {/* Bạn có thể thêm tùy chọn khác ở đây */}
                </div>
              )}
            </div>
          ) : (
            <button onClick={handleLoginClick}>
              <img src="/icon/human.svg" alt="login" /> Đăng nhập
            </button>
          )}
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
