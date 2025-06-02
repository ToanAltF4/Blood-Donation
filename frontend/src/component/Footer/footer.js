import React from 'react';
import './footer.css';
import { useNavigate } from 'react-router-dom';

function Footer() {
  return (
      <footer className="footer-wrapper">
      {/* Sóng trắng phía trên */}
    <path
      fill="black"
      d="M288,99 L1152,99 L1152,100 L288,100 Z"
    />
      <div className="footer-wave-top">
  <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
    <path fill="#ffffff" d="M0,50 C 360,140 1080,-60 1440,50 L1440,0 L0,0 Z" />
  </svg>
</div>
      {/* Nội dung chính */}
      <div className="footer-main">
        <h2 className="footer-heading">Liên hệ</h2>

        <div className="footer-info">
          <div className="footer-col">
            <p><strong>TT Blood Donation</strong></p>
            <p>📍 99 Lê Văn Việt, Phường Tân Phú,<br />Thủ Đức, TP. Hồ Chí Minh</p>
            <p>Email<br />bloodyellow@bloodyellow.com</p>
          </div>
          <div className="footer-col">
            <p><strong>📞 Số Điện Thoại</strong></p>
            <p>028 3868 6868</p>
            <p>028 3868 8868</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
