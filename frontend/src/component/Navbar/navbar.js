import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  const renderDropdownItems = () => {
    if (!user) return null;

    switch (user.role) {
      case "Admin":
        return (
          <>
            <div
              className="dropdown-item"
              onClick={() => navigate("/admin/dashboard")}
            >
              Dashboard
            </div>
            <div
              className="dropdown-item"
              onClick={() => navigate("/admin/accounts")}
            >
              Quản lý tài khoản
            </div>
            <hr />
            <div className="dropdown-item" onClick={handleLogout}>
              Quản lý sự kiện
            </div>
            <div className="dropdown-item" onClick={handleLogout}>
              Quản lý bài đăng
            </div>
            <div className="dropdown-item" onClick={handleLogout}>
              Đăng xuất
            </div>
          </>
        );

      case "Staff":
        return (
          <>
            <div
              className="dropdown-item"
              onClick={() => navigate("/staff/events")}
            >
              Quản Lý Sự Kiện
            </div>
            <div
              className="dropdown-item"
              onClick={() => navigate("/staff/reports")}
            >
              Kho Máu
            </div>
            <hr />
            <div className="dropdown-item" onClick={handleLogout}>
              Gửi Thông Báo
            </div>
            <div className="dropdown-item" onClick={handleLogout}>
              Yêu Cầu Máu Khẩn Cấp
            </div>
            <div className="dropdown-item" onClick={handleLogout}>
              Thống Kê
            </div>
            <div className="dropdown-item" onClick={handleLogout}>
              Đăng Xuất
            </div>
          </>
        );

      case "Member":
      default:
        return (
          <>
            <div
              className="dropdown-item"
              onClick={() => navigate("/profile/events")}
            >
              Sự kiện đã đăng ký
            </div>
            <div
              className="dropdown-item"
              onClick={() => navigate("/profile/history")}
            >
              Lịch sử hiến máu
            </div>
            <div className="dropdown-item" onClick={() => navigate("/profile")}>
              Thông tin cá nhân
            </div>
            <hr />
            <div className="dropdown-item" onClick={handleLogout}>
              Đăng xuất
            </div>
          </>
        );
    }
  };

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
      if (userObj.user_id) {
        localStorage.setItem("user_id", userObj.user_id);
      }
    }

    // Đóng dropdown khi click ngoài
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // hoặc reload: window.location.reload();
  };

  return (
    <header className="navbar-container">
      <div className="navbar-top">
        <div className="contact-info-navbar">
          Hotline Khẩn Cấp
          <br />
          <span className="phone">1900 868 638</span>
        </div>

        <div className="brand-logo">
          <img
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
            src="/logo.svg"
            alt="MyApp Logo"
          />
        </div>

        <div className="login-button-navbar" ref={dropdownRef}>
          {user ? (
            <div className="user-dropdown">
              <div
                className="user-name"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img src="/icon/human.svg" alt="user" /> {user.full_name} ▼
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu">{renderDropdownItems()}</div>
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
          <li onClick={() => navigate("/")}>
            <a href="#homepage">TRANG CHỦ</a>
          </li>
          <li onClick={() => navigate("/")}>
            <a href="#intro">GIỚI THIỆU</a>
          </li>
          <li onClick={() => navigate("/")}>
            <a href="#careful">LƯU Ý</a>
          </li>
          <li onClick={() => navigate("/")}>
            <a href="#news">TIN TỨC</a>
          </li>
          <li onClick={() => navigate("/")}>
            <a href="#contact">FAQ</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
