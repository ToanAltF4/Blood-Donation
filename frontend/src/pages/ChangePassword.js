import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function ChangePassword() {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: ''
  });
  const [hasPassword, setHasPassword] = useState(null); // null = loading, true/false
  const token = localStorage.getItem('token');

  // Lấy trạng thái password hiện tại từ backend
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${process.env.REACT_APP_HOST}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        setHasPassword(data?.user?.hasPassword); //bạn sẽ trả về trong API profile
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        setHasPassword(true); // fallback: mặc định xử lý như có password
      }
    }

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.new_password || formData.new_password.length < 6) {
      return Swal.fire({
        icon: 'warning',
        title: 'Mật khẩu mới không hợp lệ',
        text: 'Mật khẩu phải dài tối thiểu 6 ký tự.'
      });
    }

    if (hasPassword && !formData.current_password) {
      return Swal.fire({
        icon: 'warning',
        title: 'Thiếu mật khẩu hiện tại',
        text: 'Bạn cần nhập mật khẩu hiện tại để đổi.'
      });
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_HOST}/api/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: data.message
        });
        setFormData({ current_password: '', new_password: '' });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: data.message || 'Đổi mật khẩu thất bại.'
        });
      }
    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi kết nối',
        text: 'Không thể kết nối tới máy chủ.'
      });
    }
  };

  // Loading state
  if (hasPassword === null) return <p>Đang tải...</p>;

  return (
    <div className="container mt-5">
      <h3>{hasPassword ? 'Đổi mật khẩu' : 'Tạo mật khẩu mới'}</h3>
      <form onSubmit={handleSubmit} className="mt-4" style={{ maxWidth: 500 }}>
        {hasPassword && (
          <div className="mb-3">
            <label className="form-label">Mật khẩu hiện tại</label>
            <input
              type="password"
              name="current_password"
              className="form-control"
              value={formData.current_password}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">{hasPassword ? 'Mật khẩu mới' : 'Mật khẩu bạn muốn tạo'}</label>
          <input
            type="password"
            name="new_password"
            className="form-control"
            value={formData.new_password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {hasPassword ? 'Cập nhật mật khẩu' : 'Tạo mật khẩu'}
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;
