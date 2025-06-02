import './profile.css';
import React from 'react';
import Navbar from '../component/Navbar/navbar';
function UserProfile() {
  return (
    <div className="profile-page">
      {/* <Navbar /> */}

      <div className="profile-wrapper">
        {/* Sidebar */}
        <div className="profile-box sidebar-box">
          <div className="sidebar-top">
            <div className="avatar">
              <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="Avatar" />
            </div>
            <h3 className="username">Nguyễn Văn A</h3>
          </div>

          <div className="sidebar-menu">
            <ul className="menu">
              <li>Sự Kiện Đã Đăng Ký</li>
              <li>Lịch Sử Hiến Máu</li>
              <li>Cập Nhật Hồ Sơ</li>
              <li className="logout">Logout</li>
            </ul>
          </div>
        </div>

        {/* About box */}
        <div className="profile-box about-box">
          <h2>About</h2>
          <div className="info-row"><label>Full Name</label><span>Nguyễn Văn A</span></div>
          <div className="info-row"><label>Email</label><span>abc@gmail.com</span></div>
          <div className="info-row"><label>Phone</label><span>08299667890</span></div>
          <div className="info-row"><label>Address</label><span>12, Tân Phú, Xyz</span></div>
          <div className="info-row"><label>CCCD</label><span>0601039028</span></div>
          <div className="info-row"><label>Blood Type</label><span>B</span></div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;