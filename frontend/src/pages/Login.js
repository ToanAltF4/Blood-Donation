import React, { useState } from "react";
import "./style.css";
import Navbar from "../component/Navbar/navbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // thêm dòng này

function LoginPage() {
  const HOST = process.env.REACT_APP_HOST;
  console.log(HOST);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginClick = async () => {
    try {
      const response = await fetch(`${HOST}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        const role = data.user.role;

        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        Swal.fire({
          title: "Đăng nhập thành công!",
          icon: "success",
          showConfirmButton: false,
          timer: 1800,
        });

        setTimeout(() => {
          if (role === "Admin") {
            navigate("/admin/dashboard");
          } else if (role === "Staff") {
            navigate("/staff/page");
          } else {
            navigate("/");
          }
          window.location.reload(); // Reload lại trang sau khi điều hướng
        }, 1800);
      } else if (response.status === 400 || response.status === 401) {
        Swal.fire("Đăng nhập không thành công", "", "error");
      } else {
        Swal.fire("Lỗi không xác định", "Vui lòng thử lại sau.", "warning");
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu:", error);
      Swal.fire("Lỗi máy chủ", "Vui lòng kiểm tra mạng hoặc thử lại.", "error");
    }
  };

  const handleForgotPasswordClick = () => {
    // Logic for handling forgot password can be added here
    alert(
      "Gửi SMS với cú pháp QUENMK bằng sdt đã đăng ký thành viên đến 0868396721."
    );
  };
  const handleNavigateRegister = () => {
    navigate("/register");
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
        <div
          className="bg-white rounded-4 shadow p-5"
          style={{ width: "  530px" }}
        >
          <h2 className="text-center mb-4 fw-bold" style={{ color: "#3D6889" }}>
            Đăng Nhập
          </h2>

          <div className="mb-3">
            <label className="form-label fw-bold text-dark">
              Số điện thoại/email<span className="text-danger ms-1">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập SDT/Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-dark">
              Mật Khẩu<span className="text-danger ms-1">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLoginClick();
              }}
            />
          </div>

          <div className="text-end mb-3">
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={handleForgotPasswordClick}
            >
              Bạn quên mật khẩu?
            </button>
          </div>

          <div className="d-grid mb-3">
            <button
              type="button"
              style={{ backgroundColor: "#3D6889", color: "white" }}
              className="btn rounded-pill fw-bold"
              onClick={handleLoginClick}
            >
              Đăng Nhập
            </button>
          </div>

          <div className="text-center">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              className="btn btn-link fw-bold p-0"
              onClick={handleNavigateRegister}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
