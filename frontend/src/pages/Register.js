import React, { useState } from "react";
import Navbar from "../component/Navbar/navbar";
import "./register.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function RegisterPage() {
  const navigate = useNavigate();
  const HOST = process.env.REACT_APP_HOST;

  // Khai báo state cho các trường input
  const [formData, setFormData] = useState({
    full_name: "",
    cccd: "",
    phone: "",
    email: "",
    password: "",
    location: "", // địa chỉ
    role: "Member", // mặc định
    blood: "",
    date_of_birth: "",
    family_contact: "",
  });

  const [errors, setErrors] = useState({});

  // Hàm xử lý nhập liệu
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    // CCCD: 12 số
    if (!/^[0-9]{12}$/.test(formData.cccd)) {
      newErrors.cccd = "Số CCCD phải là 12 chữ số.";
    }
    // Họ tên: chỉ chữ cái, khoảng trắng, không ký tự đặc biệt
    if (!/^[A-Za-zÀ-ỹ\s]+$/.test(formData.full_name.trim())) {
      newErrors.full_name = "Họ và tên chỉ được chứa chữ cái, không có ký tự đặc biệt hoặc số.";
    }
    // Địa chỉ: chỉ chữ, số, khoảng trắng, dấu phẩy, dấu chấm, tối thiểu 10 ký tự
    if (!/^[A-Za-zÀ-ỹ0-9\s,\.]{10,}$/.test(formData.location.trim())) {
      newErrors.location = "Địa chỉ phải tối thiểu 10 ký tự, chỉ chứa chữ, số, dấu phẩy, dấu chấm.";
    }
    // SĐT: 10-11 số
    if (!/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại phải từ 10 đến 11 chữ số.";
    }
    return newErrors;
  };

  // Hàm xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(`${HOST}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "Đăng ký thành công!",
          confirmButtonText: "OK",
        });
        // Optionally chuyển hướng sau khi đăng ký
        // navigate('/login');
      } else if (response.status === 400) {
        await Swal.fire({
          icon: "warning",
          title: "Thiếu thông tin",
          text: "Vui lòng nhập đầy đủ thông tin bắt buộc.",
        });
      } else if (response.status === 409) {
        await Swal.fire({
          icon: "error",
          title: "Tài khoản đã tồn tại",
          text: "Email, số điện thoại hoặc CCCD đã được đăng ký.",
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Không hợp lệ",
          text: "Người dùng phải từ 18 tuổi trở lên.",
        });
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: "Lỗi máy chủ hoặc kết nối mạng.",
      });
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
          <h2 className="text-center mb-4 fw-bold" style={{ color: "#3D6889" }}>
            Đăng Ký
          </h2>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">
                Số CCCD <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.cccd ? 'is-invalid' : ''}`}
                name="cccd"
                placeholder="Nhập giấy tờ tùy thân"
                value={formData.cccd}
                onChange={handleChange}
              />
              {errors.cccd && <div className="invalid-feedback">{errors.cccd}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Họ và Tên <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                name="full_name"
                placeholder="Nhập họ và tên"
                value={formData.full_name}
                onChange={handleChange}
              />
              {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Địa Chỉ <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                name="location"
                placeholder="Nhập địa chỉ"
                value={formData.location}
                onChange={handleChange}
              />
              {errors.location && <div className="invalid-feedback">{errors.location}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">
                Số Điện Thoại <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
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
            <button
              type="submit"
              className="btn btn-primary rounded-pill fw-bold"
              style={{ backgroundColor: "#3D6889", color: "white" }}
            >
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
