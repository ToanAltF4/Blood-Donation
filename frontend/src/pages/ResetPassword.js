import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const HOST = process.env.REACT_APP_HOST;
  const navigate = useNavigate();

  const email = localStorage.getItem('reset-email');
  const otpVerified = localStorage.getItem('otp-verified'); // đã xác thực OTP chưa?

  useEffect(() => {
    if (!email || otpVerified !== 'true') {
      // Nếu chưa xác thực OTP, quay về trang quên mật khẩu
      navigate('/forgot-password');
    }
  }, [email, otpVerified, navigate]);

  const handleReset = async () => {
    if (!newPassword) {
      Swal.fire('Vui lòng nhập mật khẩu mới', '', 'warning');
      return;
    }

    try {
      const res = await fetch(`${HOST}/api/forgot/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await res.json();

      if (res.status === 200) {
        Swal.fire('Đổi mật khẩu thành công', '', 'success');

        // ✅ Xóa localStorage tạm
        localStorage.removeItem('reset-email');
        localStorage.removeItem('reset-otp-token');
        localStorage.removeItem('reset-otp-expire');
        localStorage.removeItem('otp-verified');

        navigate('/login');
      } else {
        Swal.fire('Thất bại', result.message || '', 'error');
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
            Đặt lại mật khẩu
          </h2>

          <div className="mb-3">
            <label className="form-label fw-bold text-dark">Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              placeholder="Vui lòng nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button
              className="btn rounded-pill fw-bold"
              style={{ backgroundColor: "#3D6889", color: "white" }}
              onClick={handleReset}
            >
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
