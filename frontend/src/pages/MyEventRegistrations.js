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

  const columns = [
    { name: "Tên sự kiện", selector: (row) => row.Event_Name, grow: 2 },
    { name: "Địa điểm", selector: (row) => row.Location, grow: 2 },
    { name: "Bắt đầu", selector: (row) => row.Time_Start },
    { name: "Kết thúc", selector: (row) => row.Time_End },
    {
      name: "Trạng thái đăng ký",
      selector: (row) => row.Status,
      cell: (row) => (
        <span
          style={{
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
            ? "Chờ xử lý"
            : row.Status === "approved"
            ? "Đã duyệt"
            : row.Status === "rejected"
            ? "Đã từ chối"
            : row.Status}
        </span>
      ),
    },
  ];

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
          noDataComponent="Bạn chưa đăng ký sự kiện nào."
        />
      </div>
    </div>
  );
}

export default MyEventRegistrations; 