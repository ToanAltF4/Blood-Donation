import React, { useState } from 'react';
import './style.css';
import Navbar from '../component/Navbar/navbar';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const HOST = process.env.REACT_APP_HOST;
  console.log(HOST);
    const navigate = useNavigate();
    
      const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = async () => {
    try {
      const response = await fetch(`${HOST}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });
      console.log(response);
      if (response.status === 200) {
        const data = await response.json();
        alert('Đăng nhập thành công');
        console.log('User Info:', data.user);
        const role = data.user.role;
        localStorage.setItem('user', JSON.stringify(data.user)); // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('token', data.token); // Lưu token vào localStorage
        if (role === 'Admin') {
          navigate('/admin/dashboard');
        } else if (role === 'Staff') {
          navigate('/staff/page');
        } else {
          navigate('/');
        }
        // navigate('/dashboard'); // nếu cần điều hướng
      } else if (response.status === 400 || response.status === 401) {
        alert('Đăng nhập không thành công');
      } else {
        alert('Lỗi không xác định. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      alert('Lỗi máy chủ hoặc mạng. Vui lòng thử lại.');
    }
  };
      const handleForgotPasswordClick = () => {
        // Logic for handling forgot password can be added here
        alert("Gửi SMS với cú pháp QUENMK bằng sdt đã đăng ký thành viên đến 0868396721.");
      }
      const handleNavigateRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-page" style={{ backgroundImage: 'url(/img/background.svg)' }}>
      {/* <Navbar /> */}
      <div className="login-form-wrapper">
        <div className="login-form">
          <h2>Đăng Nhập</h2>

          <label>Số điện thoại/email<span className="required">*</span></label>
          <input
            type="text"
            placeholder="Nhập SDT/Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Mật Khẩu<span className="required">*</span></label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="forgot-password">
            <a onClick={handleForgotPasswordClick}>Bạn quên mật khẩu?</a>
          </div>

          <button className="login-button" onClick={handleLoginClick}>Đăng Nhập</button>

          <div className="register-prompt"> 
            Chưa có tài khoản? <a onClick={handleNavigateRegister}>Đăng ký</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
