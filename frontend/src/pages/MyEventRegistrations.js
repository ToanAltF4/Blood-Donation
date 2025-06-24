import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";

function MyEventRegistrations() {
  const HOST = process.env.REACT_APP_HOST;
  const user = JSON.parse(localStorage.getItem("user"));
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "Member") {
      window.location.href = "/";
      return;
    }
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${HOST}/api/member/my-registrations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRegistrations(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire("Lỗi", "Không thể tải danh sách sự kiện đã đăng ký.", "error");
    }
  };

  // Hàm format ngày tháng năm
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN");
  };

  const columns = [
    { name: "Tên sự kiện", selector: (row) => row.Event_Name, grow: 2, wrap: true },
    { name: "Địa điểm", selector: (row) => row.Location, grow: 3, wrap: true },
    { name: "Bắt đầu", selector: (row) => formatDate(row.Time_Start), width: "130px", wrap: true },
    { name: "Kết thúc", selector: (row) => formatDate(row.Time_End), width: "130px", wrap: true },
    {
      name: "Trạng thái",
      selector: (row) => row.Status,
      cell: (row) => (
        <span
          style={{
            display: "inline-block",
            width: 140,
            textAlign: "center",
            whiteSpace: "nowrap",
            padding: "4px 10px",
            borderRadius: "12px",
            fontWeight: "bold",
            backgroundColor:
              row.Status === "pending"
                ? "#ffc107"
                : row.Status === "approved"
                ? "#28a745"
                : row.Status === "rejected"
                ? "#dc3545"
                : "#6c757d",
            color: "white",
          }}
        >
          {row.Status === "pending"
            ? "Chưa Hiến"
            : row.Status === "approved"
            ? "Đã Hiến Máu"
            : row.Status === "rejected"
            ? "Đã Hủy"
            : row.Status}
        </span>
      ),
      wrap: true,
    },
  ];

  const customStyles = {
    rows: { style: { fontSize: "18px" } },
    headCells: { style: { fontSize: "20px", fontWeight: "bold" } },
    cells: { style: { fontSize: "18px" } },
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold">Các sự kiện bạn đã đăng ký</h2>
      <div className="card p-3 shadow">
        <DataTable
          columns={columns}
          data={registrations}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          customStyles={customStyles}
          noDataComponent="Bạn chưa đăng ký sự kiện nào."
        />
      </div>
    </div>
  );
}

export default MyEventRegistrations; 