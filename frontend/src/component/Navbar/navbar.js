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
            <div className="dropdown-item" onClick={() => navigate("/admin/events")}>
              Quản lý sự kiện
            </div>
            <div className="dropdown-item" onClick={()=> navigate("admin/news")}>
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
              onClick={() => navigate("/admin/events")}
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
    localStorage.clear();
    setUser(null);
    navigate("/"); // hoặc reload: window.location.reload();
  };

  return (
    <header className="sticky-top shadow">
  <div className="bg-white py-2 border-bottom d-flex justify-content-between align-items-center px-5">
    <div className="text-muted">
      <div>Hotline Khẩn Cấp</div>
      <strong className="text-dark">1900 868 638</strong>
    </div>

    <div>
      <img
        src="/logo.svg"
        alt="Logo"
        style={{ height: "80px", cursor: "pointer" }}
        onClick={() => navigate("/")}
      />
    </div>

    <div className="position-relative" ref={dropdownRef}>
      {user ? (
        <div className="dropdown">
          <button
            className="btn btn-light dropdown-toggle d-flex align-items-center gap-2"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img src="/icon/human.svg" alt="user" width={24} />
            {user.full_name}
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu show mt-2" style={{ right: 0, left: "auto" }}>
              {renderDropdownItems()}
            </ul>
          )}
        </div>
      ) : (
        <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={handleLoginClick}>
          <img src="/icon/human.svg" alt="login" width={24} />
          Đăng nhập
        </button>
      )}
    </div>
  </div>

  <nav style={{backgroundColor: "#3D6889"}} className="navbar navbar-expand-lg navbar-dark py-2">
    <div className="container justify-content-center">
      <ul className="navbar-nav gap-4">
        <li className="nav-item ">
          <a className="nav-link" href={window.location.pathname === "/" ? "#" : "/"}>TRANG CHỦ</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href={window.location.pathname === "/" ? "#intro" : "/"}>GIỚI THIỆU</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href={window.location.pathname === "/" ? "#careful" : "/"}>LƯU Ý</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href={window.location.pathname === "/" ? "#news" : "/"}>TIN TỨC</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href={window.location.pathname === "/" ? "#contact" : "/"}>FAQ</a>
        </li>
      </ul>
    </div>
  </nav>
</header>

  );
}

export default Navbar;
