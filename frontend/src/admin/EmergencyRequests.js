import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function EmergencyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const HOST = process.env.REACT_APP_HOST || 'http://localhost:8000';
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Staff') {
      navigate('/');
      return;
    }
    fetchRequests();
  }, [navigate]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${HOST}/api/admin/emergency-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể tải danh sách yêu cầu!' });
    }
    setLoading(false);
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${HOST}/api/admin/update-emergency-status`, {
        Emergency_ID: id,
        Status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests((prev) => prev.map(r => r.Emergency_ID === id ? { ...r, Status: newStatus } : r));
      Swal.fire({ icon: 'success', title: 'Cập nhật thành công!' });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không thể cập nhật trạng thái!' });
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-center">Quản lý yêu cầu máu khẩn cấp</h2>
      <div className="card shadow">
        <div className="card-body p-0">
          <table className="table table-bordered table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Tên người dùng</th>
                <th>SĐT</th>
                <th>Email</th>
                <th>Nhóm máu cần</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4">Đang tải...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">Không có yêu cầu nào</td></tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.Emergency_ID}>
                    <td>{req.Full_Name}</td>
                    <td>{req.Phone}</td>
                    <td>{req.Email}</td>
                    <td>{req.Blood_need}</td>
                    <td>
                      <span className={
                        req.Status === 'pending' ? 'badge bg-warning text-dark' :
                        req.Status === 'processing' ? 'badge bg-info text-dark' :
                        req.Status === 'approved' ? 'badge bg-success' : 'badge bg-secondary'
                      }>
                        {req.Status === 'pending' ? 'Chờ xử lý' :
                         req.Status === 'processing' ? 'Đang xử lý' :
                         req.Status === 'approved' ? 'Đã duyệt' : req.Status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-info fw-bold"
                          disabled={req.Status === 'processing'}
                          onClick={() => handleChangeStatus(req.Emergency_ID, 'processing')}
                        >
                          Đang xử lý
                        </button>
                        <button
                          className="btn btn-sm btn-success fw-bold"
                          disabled={req.Status === 'approved'}
                          onClick={() => handleChangeStatus(req.Emergency_ID, 'approved')}
                        >
                          Đã duyệt
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmergencyRequests; 