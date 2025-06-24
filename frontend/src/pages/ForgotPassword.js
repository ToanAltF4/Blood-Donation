import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const HOST = process.env.REACT_APP_HOST;
  const navigate = useNavigate();

  const [isSending, setIsSending] = useState(false);
  const validateEmail = (email) => {
  // Định dạng email cơ bản
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

  const handleSendOTP = async () => {
    if (!email) {
      Swal.fire('Vui lòng nhập email', '', 'warning');
      return;
    }
    if (!validateEmail(email)) {
    Swal.fire('Email không hợp lệ', '', 'warning');
    return;
  }
  if (isSending) {
    Swal.fire('Vui lòng chờ trước khi gửi lại OTP', '', 'info');
    return;
  }
    setIsSending(true);
    try {
      const res = await fetch(`${HOST}/api/forgot/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();

      if (res.status === 200) {
        // Tính thời gian hết hạn 5 phút
        const expiresAt = Date.now() + 5 * 60 * 1000;

        // Lưu thông tin vào localStorage
        localStorage.setItem('reset-email', email);
        localStorage.setItem('reset-otp-token', result.otp);        // mã OTP 6 số
        localStorage.setItem('reset-otp-expire', expiresAt);        // thời hạn OTP

        Swal.fire('OTP đã được gửi về email', '', 'success');
        navigate('/verify-otp');
      } else {
        Swal.fire('Không tìm thấy email', result.message || '', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Lỗi máy chủ', '', 'error');
    } finally {
    // Chặn gửi lại OTP trong 60s
    setTimeout(() => setIsSending(false), 60000);
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
        <div className="bg-white rounded-4 shadow p-5" style={{ width: "530px" }}>
          <h2 className="text-center mb-4 fw-bold" style={{ color: "#3D6889" }}>
            Quên Mật Khẩu
          </h2>

          <div className="mb-3">
            <label className="form-label fw-bold text-dark">
              Nhập email<span className="text-danger ms-1">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button
              className="btn rounded-pill fw-bold"
              style={{ backgroundColor: "#3D6889", color: "white" }}
              onClick={handleSendOTP}
              disabled={isSending}
            >
              Gửi OTP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
