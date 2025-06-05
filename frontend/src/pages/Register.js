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
     
    <div
      className="d-flex min-vh-100"
      style={{
        backgroundImage: "url(/img/background.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container d-flex justify-content-end align-items-center">
        <form
          className="bg-white rounded-4 shadow p-5"
          style={{ width: "730px", height: "90%" }}
          onSubmit={handleRegister}
        >
          <h2 className="text-center mb-4 fw-bold" style={{color:"#3D6889"}}>Đăng Ký</h2>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">
                Số CMND/CCCD/Hộ Chiếu <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="cccd"
                placeholder="Nhập giấy tờ tùy thân"
                value={formData.cccd}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Họ và Tên <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="full_name"
                placeholder="Nhập họ và tên"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Địa Chỉ <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="location"
                placeholder="Nhập địa chỉ"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Số Điện Thoại <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Mật khẩu <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Nhóm máu</label>
              <input
                type="text"
                className="form-control"
                name="blood"
                placeholder="A+, O-,..."
                value={formData.blood}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Ngày sinh <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-bold">Người thân liên hệ</label>
              <input
                type="text"
                className="form-control"
                name="family_contact"
                placeholder="SĐT người thân"
                value={formData.family_contact}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-primary rounded-pill fw-bold" style={{ backgroundColor: "#3D6889", color: "white" }}>
              Đăng Ký
            </button>
          </div>

          <div className="text-center mt-3">
            Đã có tài khoản?{" "}
            <button
              type="button"
              className="btn btn-link fw-bold p-0"
              onClick={() => navigate("/login")}
            >
              Đăng nhập ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
