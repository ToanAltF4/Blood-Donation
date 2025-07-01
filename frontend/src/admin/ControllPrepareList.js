import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Hàm tính khoảng cách giữa 2 tọa độ (Haversine formula)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    0.5 - Math.cos(dLat)/2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    (1 - Math.cos(dLon))/2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function ControllPrepareList() {
  const [readyDonors, setReadyDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');
  const [timeOption, setTimeOption] = useState('2'); // 2, 4, 8 tiếng
  const [centerLat, setCenterLat] = useState('10.842847');
  const [centerLng, setCenterLng] = useState('106.794078');
  const HOST = process.env.REACT_APP_HOST || 'http://localhost:8000';
  const navigate = useNavigate();

  // Bán kính theo option
  const radiusMap = { '2': 10, '4': 20, '8': 40 };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.role) {
      navigate("/");
      return;
    }
    if (user.role !== "Staff") {
      navigate("/");
      return;
    }
    fetchReadyDonors();
  }, [navigate]);

  const fetchReadyDonors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${HOST}/api/ready-donate/ready-donors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReadyDonors(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể tải danh sách người sẵn sàng hiến máu!'
      });
    }
  };

  // Lọc dữ liệu
  const filteredData = readyDonors.filter(item => {
    const matchText = filterText === '' || 
      item.Full_Name?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.Phone?.includes(filterText) ||
      item.Email?.toLowerCase().includes(filterText.toLowerCase());
    const matchBlood = bloodFilter === '' || item.Blood === bloodFilter;
    return matchText && matchBlood;
  });

  // Lọc theo phạm vi bán kính nếu đã nhập tọa độ trung tâm
  const filteredByRadius = (centerLat && centerLng)
    ? filteredData.filter(item => {
        if (!item.Latitude || !item.Longitude) return false;
        const dist = getDistanceFromLatLonInKm(
          parseFloat(centerLat),
          parseFloat(centerLng),
          parseFloat(item.Latitude),
          parseFloat(item.Longitude)
        );
        return dist <= radiusMap[timeOption];
      })
    : filteredData;

  // Lấy danh sách nhóm máu duy nhất cho filter
  const uniqueBloods = Array.from(new Set(readyDonors.map(donor => donor.Blood))).filter(Boolean);

  const columns = [
    {
      name: 'Tên Người Hiến',
      selector: row => row.Full_Name,
      sortable: true,
      grow: 2,
      wrap: true,
      style: {
        fontSize: '16px',
        fontWeight: '500'
      }
    },
    {
      name: 'SĐT',
      selector: row => row.Phone,
      sortable: true,
      width: '140px',
      style: {
        fontSize: '16px'
      }
    },
    {
      name: 'Email',
      selector: row => row.Email,
      sortable: true,
      grow: 2,
      wrap: true,
      style: {
        fontSize: '16px'
      }
    },
    {
      name: 'Nhóm Máu',
      selector: row => row.Blood,
      sortable: true,
      width: '200px',
      center: true,
      cell: row => (
        <span className="badge bg-danger fw-bold px-3 py-2">
          {row.Blood}
        </span>
      ),
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    {
      name: 'Vị Trí',
      selector: row => row.Latitude && row.Longitude ? 'Có' : 'Chưa có',
      sortable: true,
      width: '120px',
      center: true,
      cell: row => (
        <span className={`badge ${row.Latitude && row.Longitude ? 'bg-success' : 'bg-warning text-dark'} fw-bold px-3 py-2`}>
          {row.Latitude && row.Longitude ? 'Có' : 'Chưa có'}
        </span>
      ),
      style: {
        fontSize: '16px'
      }
    }
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f8f9fa',
        borderBottom: '2px solid #dee2e6',
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    rows: {
      style: {
        fontSize: '16px',
        minHeight: '60px',
        '&:hover': {
          backgroundColor: '#f8f9fa'
        }
      }
    },
    pagination: {
      style: {
        fontSize: '16px'
      }
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchReadyDonors();
  };

  // Gửi yêu cầu cần máu
  const handleSendRequest = async () => {
    if (!centerLat || !centerLng) {
      Swal.fire({ icon: 'warning', title: 'Thiếu tọa độ', text: 'Vui lòng nhập tọa độ trung tâm!' });
      return;
    }
    if (filteredByRadius.length === 0) {
      Swal.fire({ icon: 'info', title: 'Không có người phù hợp', text: 'Không có người nào trong phạm vi!' });
      return;
    }
    const userIds = filteredByRadius.map(u => u.User_ID);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${HOST}/api/ready-donate/send-emergency`, {
        user_ids: userIds,
        center_lat: centerLat,
        center_lng: centerLng,
        radius: radiusMap[timeOption],
        time_option: timeOption
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({ icon: 'success', title: 'Đã gửi yêu cầu', text: `Đã gửi thông báo đến ${userIds.length} người phù hợp!` });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Không gửi được yêu cầu!' });
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow border-0 rounded-3">
            <div className="card-header text-white rounded-top" style={{backgroundColor: '#3D6889'}}>
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0 fw-bold">
                  <i className="bi bi-people-fill me-2"></i>
                  Quản Lý Người Sẵn Sàng Hiến Máu
                </h3>
                <button 
                  className="btn btn-light btn-sm fw-bold"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Làm mới
                </button>
              </div>
            </div>
            <div className="card-body p-4">
              {/* Thanh tìm kiếm, lọc, chọn thời gian và nhập tọa độ */}
              <div className="row mb-4 g-3 align-items-end">
                <div className="col-md-3">
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Tìm tên, SĐT, email..."
                      value={filterText}
                      onChange={e => setFilterText(e.target.value)}
                      style={{ fontSize: '14px' }}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <select 
                    className="form-select form-select-sm"
                    value={bloodFilter}
                    onChange={e => setBloodFilter(e.target.value)}
                  >
                    <option value="">Tất cả nhóm máu</option>
                    {uniqueBloods.map(blood => (
                      <option key={blood} value={blood}>{blood}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <select
                    className="form-select form-select-sm"
                    value={timeOption}
                    onChange={e => setTimeOption(e.target.value)}
                  >
                    <option value="2">Cần gấp trong 2 tiếng (10km)</option>
                    <option value="4">Cần trong 4 tiếng (20km)</option>
                    <option value="8">Cần trong 8 tiếng (40km)</option>
                  </select>
                </div>
                <div className="col-md-2 d-grid">
                  <button
                    className="btn btn-danger btn-sm fw-bold"
                    onClick={handleSendRequest}
                    disabled={loading}
                  >
                    <i className="bi bi-broadcast me-1"></i>
                    Gửi yêu cầu
                  </button>
                </div>
              </div>
              {/* Thống kê */}
              <div className="row mb-2">
                <div className="col-md-12">
                  <span className="badge bg-success fs-6 px-3 py-2 me-2">Tổng: {readyDonors.length}</span>
                  <span className="badge bg-info fs-6 px-3 py-2 me-2">Hiển thị: {filteredData.length}</span>
                  <span className="badge bg-primary fs-6 px-3 py-2">Trong phạm vi: {filteredByRadius.length}</span>
                </div>
              </div>
              {/* Bảng dữ liệu */}
              <DataTable
                columns={columns}
                data={filteredByRadius}
                progressPending={loading}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 50]}
                highlightOnHover
                striped
                responsive
                customStyles={customStyles}
                noDataComponent={
                  <div className="text-center py-5">
                    <i className="bi bi-inbox display-1 text-muted"></i>
                    <p className="mt-3 text-muted fs-5">Không có dữ liệu người sẵn sàng hiến máu</p>
                  </div>
                }
                progressComponent={
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status">
                      <span className="visually-hidden">Đang tải...</span>
                    </div>
                    <p className="mt-3 fs-5">Đang tải dữ liệu...</p>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControllPrepareList; 