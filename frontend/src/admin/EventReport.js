import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels);

function EventReport() {
  const HOST = process.env.REACT_APP_HOST;
  const [reports, setReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Kiểm tra quyền truy cập
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !(user.role === "Admin" || user.role === "Staff")) {
      navigate("/");
    }
  }, [navigate]);

  // Lấy danh sách báo cáo và sự kiện
  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(HOST + "/api/admin/event-reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (err) {
      console.error("Lỗi lấy báo cáo:", err);
    }
    setLoading(false);
  };
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(HOST + "/api/admin/getAllEvents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Lỗi lấy sự kiện:", err);
    }
  };
  useEffect(() => {
    fetchReports();
    fetchEvents();
  }, []);

  // Thêm báo cáo mới
  const handleAddReport = async () => {
    if (!selectedEvent) return;
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        HOST + "/api/admin/event-reports",
        { Event_ID: selectedEvent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalOpen(false);
      setSelectedEvent("");
      fetchReports();
      Swal.fire("Thành công!", "Đã tạo báo cáo sự kiện.", "success");
    } catch (err) {
      Swal.fire("Lỗi!", err.response?.data?.message || "Không thể tạo báo cáo.", "error");
    }
  };

  // Xóa báo cáo
  const handleDeleteReport = async (report) => {
    const confirm = await Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });
    if (!confirm.isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(HOST + "/api/admin/event-reports", {
        data: { Report_ID: report.Report_ID },
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReports();
      Swal.fire("Đã xóa!", "Báo cáo đã bị xóa.", "success");
    } catch (err) {
      Swal.fire("Lỗi!", err.response?.data?.message || "Không thể xóa.", "error");
    }
  };

  // Tạo dữ liệu cho biểu đồ nhóm máu (8 nhóm máu cố định)
  const BLOOD_LABELS = ["A-", "A+", "B-", "B+", "AB-", "AB+", "O-", "O+"];
  const getBloodChartData = (bloodStats) => {
    // Tạo map nhóm máu -> số lượng
    const bloodMap = {};
    let total = 0;
    if (bloodStats) {
      bloodStats.forEach(b => {
        bloodMap[b.Unit_Blood] = b.count;
        total += b.count;
      });
    }
    // Đảm bảo đủ 8 nhóm máu
    const bloodCounts = BLOOD_LABELS.map(label => bloodMap[label] || 0);
    // Tính % cho từng nhóm máu
    const bloodPercents = bloodCounts.map(count => total > 0 ? Math.round((count / total) * 100) : 0);
    return {
      labels: BLOOD_LABELS,
      datasets: [
        {
          label: "Số lượng nhóm máu được hiến",
          data: bloodCounts,
          backgroundColor: [
            "#e74c3c", // A-
            "#3498db", // A+
            "#f1c40f", // B-
            "#2ecc71", // B+
            "#9b59b6", // AB-
            "#e67e22", // AB+
            "#34495e", // O-
            "#1abc9c", // O+
          ],
          datalabels: {
            anchor: 'end',
            align: 'right',
            formatter: function(value, context) {
              const percent = bloodPercents[context.dataIndex];
              return percent > 0 ? percent + '%' : '';
            },
            color: '#111',
            font: { weight: 'bold' }
          }
        },
      ],
    };
  };

  // Cấu hình biểu đồ: bar ngang, nhỏ lại, hiển thị % trên cột
  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed.x;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percent = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${value} (${percent}%)`;
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'right',
        color: '#111',
        font: { weight: 'bold' },
        formatter: function(value, context) {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percent = total > 0 ? Math.round((value / total) * 100) : 0;
          return percent > 0 ? percent + '%' : '';
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
          callback: function(value) {
            if (Number.isInteger(value)) return value;
            return null;
          }
        }
      }
    }
  };

  // Định dạng ngày tháng năm
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  // Lọc báo cáo theo tên sự kiện
  const filteredReports = reports.filter(r =>
    r.Name_Event.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-3 text-center">Báo cáo sự kiện</h2>
      <div className="mb-4" style={{ maxWidth: 350 }}>
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm theo tên sự kiện..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <button className="btn btn-success" onClick={() => setModalOpen(true)}>
          <FaPlus /> Thêm báo cáo
        </button>
      </div>
      {loading ? (
        <div>Đang tải dữ liệu...</div>
      ) : (
        <div className="row g-4">
          {filteredReports.map((report) => (
            <div className="col-12" key={report.Report_ID}>
              <div className="card shadow p-4 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className="mb-0">{report.Name_Event}</h4>
                  <div>
                    <button
                      className="btn btn-outline-danger"
                      title="Xóa báo cáo"
                      onClick={() => handleDeleteReport(report)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div><strong>Địa điểm:</strong> {report.Location}</div>
                    <div><strong>Thời gian báo cáo:</strong> {formatDate(report.Time_Report)}</div>
                    <div><strong>Bắt đầu:</strong> {formatDate(report.Time_Start)}</div>
                    <div><strong>Kết thúc:</strong> {formatDate(report.Time_End)}</div>
                  </div>
                  <div className="col-md-6">
                    <div><strong>Số lượng đăng ký:</strong> {report.Total_Registered}</div>
                    <div><strong>Hiến máu thành công:</strong> {report.Total_Donated}</div>
                  </div>
                </div>
                <div>
                  <h6 className="mb-2">Biểu đồ nhóm máu được hiến tại sự kiện</h6>
                  {(!report.BloodStats || report.BloodStats.length === 0) ? (
                    <div>Chưa có dữ liệu hiến máu.</div>
                  ) : (
                    <Bar data={getBloodChartData(report.BloodStats)} options={chartOptions} height={90} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Modal thêm báo cáo */}
      {modalOpen && (
        <div className="modal d-block show w-100 vh-100" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Thêm báo cáo sự kiện</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <select className="form-select" value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}>
                  <option value="">Chọn sự kiện</option>
                  {events.map(ev => (
                    <option key={ev.Event_ID} value={ev.Event_ID}>{ev.Event_Name} - {ev.Location}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Hủy</button>
                <button className="btn btn-primary" onClick={handleAddReport} disabled={!selectedEvent}>Tạo báo cáo</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventReport; 