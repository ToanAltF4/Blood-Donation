import React from 'react';
import Navbar from '../component/Navbar/navbar';
import './register.css'; // Import CSS styles for the Register page
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
      
        const handleLoginClick = () => {
          navigate('/login'); // Điều hướng đến trang đăng nhập
        };

  return (
    <div className="register-page" style={{ backgroundImage: 'url(/img/background.svg)' }}>
      <Navbar />
      <div className="register-form-wrapper">
        <form className="register-form">
          <h2>Đăng Ký</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Số CMND/CCCD/Hộ Chiếu<span>*</span></label>
              <input type="text" placeholder="Nhập giấy tờ tùy thân" />
            </div>
            <div className="form-group">
              <label>Họ Và Tên<span>*</span></label>
              <input type="text" placeholder="Nhập họ và tên" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Địa Chỉ<span>*</span></label>
              <input type="text" placeholder="Nhập Địa Chỉ" />
            </div>
            <div className="form-group">
              <label>Số Điện Thoại<span>*</span></label>
              <input type="text" placeholder="Nhập số điện thoại" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email<span>*</span></label>
              <input type="email" placeholder="Nhập email" />
            </div>
            <div className="form-group">
              <label>Mật Khẩu<span>*</span></label>
              <input type="password" placeholder="Nhập mật khẩu" />
            </div>
          </div>
  

          <button className="register-button">Đăng Ký</button>

          <div className="login-prompt">
            Đã có tài khoản? <a onClick={handleLoginClick}>Đăng nhập ngay</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;