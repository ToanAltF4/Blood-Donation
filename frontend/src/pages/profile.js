import "./profile.css";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";



function UserProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  
  const [editMode, setEditMode] = useState(false);

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

  const handleSave = async () => {
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
                />
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
                />
              </div>
              <div className="info-row">
                <label>Address</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="info-row">
                <label>CCCD</label>
                <input
                  type="text"
                  name="cccd"
                  value={formData.cccd}
                  onChange={handleChange}
                />
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
