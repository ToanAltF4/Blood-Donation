import React from 'react';
import './style.css';
import Navbar from '../component/Navbar/navbar';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    
      const handleLoginClick = () => {
        navigate('/register'); // Điều hướng đến trang đăng ký
      };
      const handleForgotPasswordClick = () => {
        // Logic for handling forgot password can be added here
        alert("Gửi SMS với cú pháp QUENMK bằng sdt đã đăng ký thành viên đến 0868396721.");
      }

  return (
    <div className="login-page" style={{ backgroundImage: 'url(/img/background.svg)' }}>
      <Navbar />
      <div className="login-form-wrapper">
        <div className="login-form">
          <h2>Đăng Nhập</h2>

          <label>Số điện thoại/email<span className="required">*</span></label>
          <input type="text" placeholder="Nhập SDT/Email" />

          <label>Mật Khẩu<span className="required">*</span></label>
          <input type="password" placeholder="Nhập mật khẩu" />

          <div className="forgot-password">
            <a onClick={handleForgotPasswordClick}>Bạn quên mật khẩu?</a>
          </div>

          <button className="login-button">Đăng Nhập</button>

          <div className="register-prompt">
            Chưa có tài khoản? <a onClick={handleLoginClick}>Đăng ký</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
