import React, { useState } from 'react';
import Navbar from '../component/Navbar/navbar';
import './register.css';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const HOST = process.env.REACT_APP_HOST;

  // Khai báo state cho các trường input
  const [formData, setFormData] = useState({
    full_name: '',
    cccd: '',
    phone: '',
    email: '',
    password: '',
    location: '', // địa chỉ
    role: 'Member', // mặc định
    blood: '',
    date_of_birth: '',
    family_contact: ''
  });

  // Hàm xử lý nhập liệu
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Hàm xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${HOST}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 201) {
        alert('Đăng ký thành công!');
        // Bạn có thể chuyển hướng người dùng sau đăng ký
        // navigate('/login');
      } else if (response.status === 400) {
        alert('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      } else if (response.status === 409) {
        alert('Đăng ký không thành công. Tài khoản có thể đã tồn tại.');
      } else {
        alert('Đã xảy ra lỗi không xác định.');
      }
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      alert('Lỗi máy chủ hoặc kết nối mạng.');
    }
  };

  return (
    <div className="register-page" style={{ backgroundImage: 'url(/img/background.svg)' }}>
      <Navbar />
      <div className="register-form-wrapper">
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Đăng Ký</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Số CMND/CCCD/Hộ Chiếu<span>*</span></label>
              <input type="text" name="cccd" placeholder="Nhập giấy tờ tùy thân" value={formData.cccd} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Họ Và Tên<span>*</span></label>
              <input type="text" name="full_name" placeholder="Nhập họ và tên" value={formData.full_name} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Địa Chỉ<span>*</span></label>
              <input type="text" name="location" placeholder="Nhập Địa Chỉ" value={formData.location} onChange={handleChange}/>
            </div>
            <div className="form-group">
              <label>Số Điện Thoại<span>*</span></label>
              <input type="text" name="phone" placeholder="Nhập số điện thoại" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email<span>*</span></label>
              <input type="email" name="email" placeholder="Nhập email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Mật Khẩu<span>*</span></label>
              <input type="password" name="password" placeholder="Nhập mật khẩu" value={formData.password} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nhóm Máu</label>
              <input type="text" name="blood" placeholder="A+, O-,..." value={formData.blood} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Ngày Sinh</label>
              <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Người thân liên hệ</label>
              <input type="text" name="family_contact" placeholder="SĐT người thân" value={formData.family_contact} onChange={handleChange} />
            </div>
          </div>

          <button className="register-button" type="submit">Đăng Ký</button>

          <div className="login-prompt">
            Đã có tài khoản? <a onClick={() => navigate('/login')}>Đăng nhập ngay</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
