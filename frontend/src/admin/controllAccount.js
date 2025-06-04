import './controllAccount.css';
import React, { useState, useEffect } from 'react';
import Navbar from '../component/Navbar/navbar';
import DataTable from 'react-data-table-component';

function ControllAccount() {
  const [users, setUsers] = useState([
    { email: 'admin@example.com', full_name: 'Admin One', role: 'Admin' },
    { email: 'staff@example.com', full_name: 'Staff A', role: 'Staff' },
    { email: 'member1@example.com', full_name: 'User B', role: 'Member' },
    { email: 'member2@example.com', full_name: 'User C', role: 'Member' },
    
    // thêm nhiều dữ liệu nếu cần
  ]);
  const [filterRole, setFilterRole] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [newRole, setNewRole] = useState('');
  const [perPage, setPerPage] = useState(10);

  const handleRoleChangeSubmit = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === selectedEmail ? { ...user, role: newRole } : user
      )
    );
    setModalOpen(false);
    setSelectedEmail('');
    setNewRole('');
  };

  const filteredUsers = users.filter((user) => {
    return (
      (filterRole === 'All' || user.role === filterRole) &&
      (user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.full_name.toLowerCase().includes(searchText.toLowerCase()))
    );
  });

  const columns = [
    { name: 'Email', selector: row => row.email, sortable: true },
    { name: 'Họ tên', selector: row => row.full_name, sortable: true },
    { name: 'Vai trò', selector: row => row.role, sortable: true },
  ];
  const customStyles = {
  rows: {
    style: {
      fontSize: '15px', // chỉnh size hàng dữ liệu
    },
  },
  headCells: {
    style: {
      fontSize: '20px', // chỉnh size tiêu đề cột
      fontWeight: 'bold',
    },
  },
  cells: {
    style: {
      fontSize: '18px', // chỉnh size ô dữ liệu
    },
  },
};

  return (
    <div className="page-container">
      <div className="card-container">
        <div className="top-control">
          <h2>Quản lý tài khoản</h2>
          <div className="filter-group">
            <select className ="select-box" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
              <option value="All">Tất cả vai trò</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="Member">Member</option>
            </select>
            <input className="search-input"
              type="text"
              placeholder="Tìm kiếm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <div className="button-wrapper">
                        <button className='button-submit' onClick={() => setModalOpen(true)}>THAY ĐỔI ROLE</button>

            </div>
          </div>
        </div>

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

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Thay đổi vai trò</h3>
            <label>Chọn người dùng:</label>
            <select value={selectedEmail} onChange={(e) => setSelectedEmail(e.target.value)}>
              <option value="">-- Chọn email --</option>
              {users.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.email}
                </option>
              ))}
            </select>

            <label>Chọn vai trò mới:</label>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="">-- Chọn role --</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="Member">Member</option>
            </select>

            <div className="modal-buttons">
              <button onClick={handleRoleChangeSubmit}>Xác nhận</button>
              <button onClick={() => setModalOpen(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ControllAccount;
