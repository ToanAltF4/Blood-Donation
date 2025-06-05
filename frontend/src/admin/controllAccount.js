import "./controllAccount.css";
import React, { useState, useEffect } from "react";
import Navbar from "../component/Navbar/navbar";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

import DataTable from "react-data-table-component";
import axios from "axios";

function ControllAccount() {
  const HOST = process.env.REACT_APP_HOST;
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();
  // 🔥 Lấy danh sách user từ API
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Lưu thông tin người dùng vào localStorage
    if (!user || !user.role) {
      navigate("/");
      return;
    }
    if (user.role != "Admin") {
      navigate("/");
    }
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(HOST + "/api/admin/getAllUsers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data); // API trả về mảng user
      } catch (err) {
        console.error("Lỗi khi lấy danh sách người dùng:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChangeSubmit = async () => {
  const confirmResult = await Swal.fire({
    title: 'Bạn có chắc chắn?',
    text: `Bạn sắp đổi vai trò của ${selectedEmail} thành ${newRole}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Hủy'
  });

  if (confirmResult.isConfirmed) {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        HOST + `/api/admin/changeRole`,
        {
          email: selectedEmail,
          newRole: newRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật lại UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.Email === selectedEmail ? { ...user, Role: newRole } : user
        )
      );

      setModalOpen(false);
      setSelectedEmail("");
      setNewRole("");

      // 🔔 Hiển thị thông báo thành công
      await Swal.fire({
        icon: 'success',
        title: 'Cập nhật thành công!',
        text: `Vai trò đã được thay đổi.`,
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật vai trò:", error);

      // 🔔 Hiển thị thông báo lỗi
      await Swal.fire({
        icon: 'error',
        title: 'Thất bại!',
        text: 'Không thể cập nhật vai trò. Vui lòng thử lại.',
        confirmButtonText: 'OK'
      });
    }
  }
};

  const filteredUsers = users.filter((user) => {
    return (
      (filterRole === "All" || user.Role === filterRole) &&
      (user.Email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.Full_Name.toLowerCase().includes(searchText.toLowerCase()))
    );
  });

  const columns = [
    { name: "User ID", selector: (row) => row.User_ID, sortable: true },
    { name: "Email", selector: (row) => row.Email, sortable: true },
    { name: "Họ tên", selector: (row) => row.Full_Name, sortable: true },
    { name: "Vai trò", selector: (row) => row.Role, sortable: true },
  ];

  const customStyles = {
    rows: {
      style: {
        fontSize: "15px",
      },
    },
    headCells: {
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        fontSize: "18px",
      },
    },
  };

  return (
    <div className="container py-4">
  <div className="card shadow p-4">
    <div className="mb-4">
      <h2 className="fw-bold">Quản lý tài khoản</h2>
    </div>

    {/* Thanh filter */}
    <div className="row align-items-center mb-3 gy-2">
      <div className="col-md-3">
        <select
          className="form-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="All">Tất cả vai trò</option>
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
          <option value="Member">Member</option>
        </select>
      </div>
      <div className="col-md-6">
        <input
          className="form-control"
          type="text"
          placeholder="Tìm kiếm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="col-md-3 text-end">
        <button className="btn btn-success w-100" onClick={() => setModalOpen(true)}>
          THAY ĐỔI ROLE
        </button>
      </div>
    </div>

    {/* DataTable */}
    <DataTable
      columns={columns}
      data={filteredUsers}
      pagination
      paginationPerPage={perPage}
      highlightOnHover
      striped
      customStyles={customStyles}
    />
  </div>

  {/* Modal */}
  {modalOpen && (
    <div className="modal d-block show w-100 vh-100" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thay đổi vai trò</h5>
            <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Chọn người dùng:</label>
              <select
                className="form-select"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
              >
                <option value="">Chọn email</option>
                {users.map((user) => (
                  <option key={user.User_ID} value={user.Email}>
                    {user.Email}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Chọn vai trò mới:</label>
              <select
                className="form-select"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="">Chọn role</option>
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
                <option value="Member">Member</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success" onClick={handleRoleChangeSubmit}>
              Xác nhận
            </button>
            <button className="btn btn-danger" onClick={() => setModalOpen(false)}>
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

  );
}

export default ControllAccount;
