import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function VerifyOTP() {
  const [enteredOtp, setEnteredOtp] = useState('');
  const HOST = process.env.REACT_APP_HOST;
  const navigate = useNavigate();

  useEffect(() => {
    const otpStored = localStorage.getItem('reset-otp-token');
    const email = localStorage.getItem('reset-email');
    if (!otpStored || !email) {
      navigate('/forgot-password');
    }
  }, [navigate]);

  const handleVerify = async () => {
    const email = localStorage.getItem('reset-email');
    const otpStored = localStorage.getItem('reset-otp-token');
    const expiresAt = localStorage.getItem('reset-otp-expire');

    if (!enteredOtp) {
      Swal.fire('Vui lòng nhập mã OTP', '', 'warning');
      return;
    }

    // (Tùy chọn) Kiểm tra hết hạn ở FE trước
    if (expiresAt && Date.now() > Number(expiresAt)) {
      Swal.fire('Mã OTP đã hết hạn', 'Vui lòng yêu cầu lại OTP.', 'error');
      return;
    }

    try {
      const res = await fetch(`${HOST}/api/forgot/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          enteredOtp,
          otpStored,
          expiresAt,
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        Swal.fire('Xác thực OTP thành công', '', 'success');
        localStorage.setItem('otp-verified', 'true'); // dấu xác minh để reset-password
        navigate('/reset-password');
      } else {
        Swal.fire('Xác minh thất bại', data.message || '', 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Lỗi máy chủ', '', 'error');
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
            Xác thực OTP
          </h2>

          <div className="mb-3">
            <label className="form-label fw-bold text-dark">Mã OTP</label>
            <input
              type="text"
              className="form-control"
              placeholder="Vui lòng nhập mã OTP"
              maxLength={6}
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button
              className="btn rounded-pill fw-bold"
              style={{ backgroundColor: "#3D6889", color: "white" }}
              onClick={handleVerify}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
