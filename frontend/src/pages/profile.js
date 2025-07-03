import "./profile.css";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";



function UserProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    cccd: user.cccd,
    location: user.location,
    blood: user.blood,
    date_of_birth: user.date_of_birth ? user.date_of_birth.slice(0, 10) : "",
    family_contact: user.family_contact,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSave = async () => {
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_HOST}/api/user/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // ✅ Hiển thị thông báo SweetAlert2
        await Swal.fire({
          icon: "success",
          title: "Cập nhật thành công!",
          text: "Thông tin hồ sơ của bạn đã được lưu.",
          confirmButtonText: "OK",
        });

        // ✅ Lưu lại user mới vào localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        // Tải lại trang để hiển thị dữ liệu mới
        window.location.reload();
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: data.message || response.statusText,
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi kết nối",
        text: "Không thể kết nối tới máy chủ.",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      cccd: user.cccd,
      location: user.location,
      blood: user.blood,
      date_of_birth: user.date_of_birth,
      family_contact: user.family_contact,
    });
    setEditMode(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-wrapper">
        {/* Sidebar */}
        <div className="profile-box sidebar-box">
          <div className="sidebar-top">
            <div className="avatar">
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="Avatar"
              />
            </div>
            <h3 className="username">{user.full_name}</h3>
          </div>

          <div className="sidebar-menu">
            <ul className="menu">
              <li onClick={() => navigate("/my-registrations")}>Sự Kiện Đã Đăng Ký</li>
              <li onClick={() => navigate("/my-donation-history")}>Lịch Sử Hiến Máu</li>
              <li onClick={() => setEditMode(true)}>Cập Nhật Hồ Sơ</li>
              <li onClick={() => navigate("/change-password")}>Đổi Mật Khẩu</li>
            </ul>
          </div>
        </div>

        {/* About box */}
        <div className="profile-box about-box">
          <h2>About</h2>

          {editMode ? (
            <>
              <div className="info-row">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className={errors.full_name ? 'is-invalid' : ''}
                />
                {errors.full_name && <div className="invalid-feedback">{errors.full_name}</div>}
              </div>
              <div className="info-row">
                <label>Email</label>
                <input type="email" value={formData.email} disabled />
              </div>
              <div className="info-row">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'is-invalid' : ''}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
              <div className="info-row">
                <label>Address</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={errors.location ? 'is-invalid' : ''}
                />
                {errors.location && <div className="invalid-feedback">{errors.location}</div>}
              </div>
              <div className="info-row">
                <label>CCCD</label>
                <input
                  type="text"
                  name="cccd"
                  value={formData.cccd}
                  onChange={handleChange}
                  className={errors.cccd ? 'is-invalid' : ''}
                />
                {errors.cccd && <div className="invalid-feedback">{errors.cccd}</div>}
              </div>
              <div className="info-row">
                <label>Blood Type</label>
                <input
                  type="text"
                  name="blood"
                  value={formData.blood}
                  onChange={handleChange}
                />
              </div>
              <div className="info-row">
                <label>Birthday </label>
                <input
                  type="date"
                  className="form-control"
                  name="date_of_birth"
                  value={formData.date_of_birth?.slice(0, 10)} // chỉ lấy YYYY-MM-DD
                  onChange={handleChange}
                />
              </div>

              <div className="info-row">
                <label>Family Contact</label>
                <input
                  type="text"
                  name="family_contact"
                  value={formData.family_contact}
                  onChange={handleChange}
                />
              </div>

              <div className="button-row">
                <button className="save-button" onClick={handleSave}>
                  Lưu
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Hủy
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="info-row">
                <label>Full Name</label>
                <span>{formData.full_name}</span>
              </div>
              <div className="info-row">
                <label>Email</label>
                <span>{formData.email}</span>
              </div>
              <div className="info-row">
                <label>Phone</label>
                <span>{formData.phone}</span>
              </div>
              <div className="info-row">
                <label>Address</label>
                <span>{formData.location}</span>
              </div>
              <div className="info-row">
                <label>CCCD</label>
                <span>{formData.cccd}</span>
              </div>
              <div className="info-row">
                <label>Blood Type</label>
                <span>{formData.blood}</span>
              </div>
              <div className="info-row">
                <label>Birthday</label>
                <span>{formData.date_of_birth?.slice(0, 10)}</span>
              </div>

              <div className="info-row">
                <label>Family Contact</label>
                <span>{formData.family_contact}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
