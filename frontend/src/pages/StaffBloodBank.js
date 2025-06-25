import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
function StaffBloodBank() {
  const [bloodUnits, setBloodUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [volumeFilter, setVolumeFilter] = useState('');
  const HOST = process.env.REACT_APP_HOST;
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Lưu thông tin người dùng vào localStorage
    if (!user || !user.role) {
      navigate("/");
      return;
    }
    if (user.role != "Staff") {
      navigate("/");
    }
    const fetchBloodUnits = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${HOST}/api/admin/getAllBloodBanks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBloodUnits(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchBloodUnits();
  }, [HOST]);

  const handleToggleStatus = async (bloodId, currentStatus) => {
    const result = await Swal.fire({
      title: 'Xác nhận',
      text: `Bạn có chắc chắn muốn chuyển trạng thái đơn vị máu này sang ${!currentStatus ? 'Đã sử dụng' : 'Chưa sử dụng'}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
    });
    if (!result.isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${HOST}/api/admin/updateBloodUnitStatus`,
        { Blood_ID: bloodId, Used_Status: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBloodUnits((prev) =>
        prev.map((unit) =>
          unit.Blood_ID === bloodId ? { ...unit, Used_Status: !currentStatus ? 1 : 0 } : unit
        )
      );
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Cập nhật trạng thái thành công!'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Lỗi cập nhật trạng thái!'
      });
    }
  };

  // Lấy danh sách duy nhất cho filter
  const uniqueBloods = Array.from(new Set(bloodUnits.map(u => u.Unit_Blood))).filter(Boolean);
  const uniqueEvents = Array.from(new Set(bloodUnits.map(u => u.Event_Name))).filter(Boolean);
  const uniqueVolumes = Array.from(new Set(bloodUnits.map(u => u.Volume))).filter(Boolean);

  // Lọc dữ liệu
  const filteredData = bloodUnits.filter(row => {
    const matchStatus = statusFilter === '' || (statusFilter === 'used' ? row.Used_Status === 1 : row.Used_Status === 0);
    const matchBlood = bloodFilter === '' || row.Unit_Blood === bloodFilter;
    const matchEvent = eventFilter === '' || row.Event_Name === eventFilter;
    const matchVolume = volumeFilter === '' || String(row.Volume) === String(volumeFilter);
    return matchStatus && matchBlood && matchEvent && matchVolume;
  });

  const columns = [
    { name: "Tên người hiến", selector: (row) => row.Full_Name, grow: 2, wrap: false, minWidth: '100px', maxWidth: '180px' },
    { name: "Email", selector: (row) => row.Email, wrap: false, minWidth: '180px', maxWidth: '260px' },
    { name: "Nhóm", selector: (row) => row.Unit_Blood, width: "120px", wrap: false, minWidth: '100px', maxWidth: '120px' },
    { name: "Dung tích", selector: (row) => row.Volume + ' ml', width: "120px", wrap: false, minWidth: '100px', maxWidth: '120px' },
    { name: "Sự kiện", selector: (row) => row.Event_Name, grow: 2, wrap: false, minWidth: '180px', maxWidth: '300px' },
    { name: "Ngày hiến", selector: (row) => new Date(row.Donate_Time).toLocaleDateString('vi-VN'), width: "120px", wrap: false },
    {
      name: "Trạng thái",
      selector: (row) => row.Used_Status === 1 ? "Đã sử dụng" : "Chưa sử dụng",
      cell: (row) => (
        <button
          className={`btn btn-sm fw-bold ${row.Used_Status === 1 ? "btn-success" : "btn-warning"}`}
          style={{
            display: "inline-block",
            width: 130,
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "visible",
            textOverflow: "unset",
            padding: "4px 10px",
            borderRadius: "12px",
            fontWeight: "bold",
          }}
          onClick={() => handleToggleStatus(row.Blood_ID, row.Used_Status)}
        >
          {row.Used_Status === 1 ? "Đã sử dụng" : "Chưa sử dụng"}
        </button>
      ),
      width: "150px"
    },
  ];

  const customStyles = {
    rows: { style: { fontSize: "16px" } },
    headCells: { style: { fontSize: "18px", fontWeight: "bold" } },
    cells: { style: { fontSize: "16px" } },
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold">Kho máu</h2>
      <div className="card p-3 shadow">
        {/* Thanh filter */}
        <div className="row mb-3 align-items-center gy-2">
          <div className="col-md-3">
            <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">Tất cả trạng thái</option>
              <option value="used">Đã sử dụng</option>
              <option value="unused">Chưa sử dụng</option>
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={bloodFilter} onChange={e => setBloodFilter(e.target.value)}>
              <option value="">Tất cả nhóm máu</option>
              {uniqueBloods.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={eventFilter} onChange={e => setEventFilter(e.target.value)}>
              <option value="">Tất cả sự kiện</option>
              {uniqueEvents.map(ev => <option key={ev} value={ev}>{ev}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-select" value={volumeFilter} onChange={e => setVolumeFilter(e.target.value)}>
              <option value="">Tất cả thể tích</option>
              {uniqueVolumes.map(v => <option key={v} value={v}>{v} ml</option>)}
            </select>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          customStyles={customStyles}
          noDataComponent="Không có dữ liệu."
        />
      </div>
    </div>
  );
}

export default StaffBloodBank; 