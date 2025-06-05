import React from 'react';
import './footer.css';
import { useNavigate } from 'react-router-dom';

function Footer() {
  return (
      <footer style={{backgroundColor: "#3D6889"}} className="footer-wrapper mt-5 pt-0">
  {/* Sóng trắng phía trên */}
  <div className="position-relative">
    <svg viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ display: 'block' }}>
      <path fill="#ffffff" d="M0,50 C 360,140 1080,-60 1440,50 L1440,0 L0,0 Z" />
    </svg>
    
  </div>

  {/* Nội dung chính */}
  <div className="container py-5">
    <h2 className="text-center mb-4">Liên hệ</h2>
    <div className="row justify-content-center">
      <div className="col-md-5 mb-4">
        <h5 className="fw-bold">TT Blood Donation</h5>
        <p className="mb-2">
          📍 99 Lê Văn Việt, Phường Tân Phú,<br />Thủ Đức, TP. Hồ Chí Minh
        </p>
        <p>
          📧 <strong>Email:</strong><br />
          ptoan638@gmail.com
        </p>
      </div>
      <div className="col-md-5 mb-4">
        <h5 className="fw-bold">📞 Số Điện Thoại</h5>
        <p className="mb-2">0868 396 721</p>
        <p>0909 123 456</p>
      </div>
    </div>
  </div>
</footer>

  );
}

export default Footer;
