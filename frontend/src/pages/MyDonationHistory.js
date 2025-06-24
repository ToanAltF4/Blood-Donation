import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";

function MyDonationHistory() {
  const HOST = process.env.REACT_APP_HOST;
  const user = JSON.parse(localStorage.getItem("user"));
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "Member") {
      window.location.href = "/";
      return;
    }
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${HOST}/api/member/my-donation-history`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire("Lỗi", "Không thể tải lịch sử hiến máu.", "error");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN");
  };

  const columns = [
    { name: "Tên sự kiện", selector: (row) => row.Event_Name, grow: 2, wrap: true },
    { name: "Ngày hiến", selector: (row) => formatDate(row.Donate_Time), width: "130px", wrap: true },
    { name: "Nhóm máu", selector: (row) => row.Unit_Blood, wrap: true },
    { name: "Dung tích", selector: (row) => row.Volume, wrap: true },
    { name: "Hồng cầu", selector: (row) => row.Red_Blood_Cells, wrap: true },
    { name: "Tiểu cầu", selector: (row) => row.Platelets, wrap: true },
    
    {
      name: "Trạng thái",
      selector: (row) => row.Used_Status,
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
              row.Used_Status === 0 ? "#007bff"
              : row.Used_Status === 1 ? "#28a745"
              : row.Used_Status === 2 ? "#dc3545"
              : "#6c757d",
            color: "white",
          }}
        >
          {row.Used_Status === 0 ? "Đang lưu kho"
          : row.Used_Status === 1 ? "Đã sử dụng"
          : row.Used_Status === 2 ? "Đã hủy"
          : "Trạng thái không xác định"}
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
      <h2 className="text-center mb-4 fw-bold">Lịch sử hiến máu của bạn</h2>
      <div className="card p-3 shadow">
        <DataTable
          columns={columns}
          data={history}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          customStyles={customStyles}
          noDataComponent="Bạn chưa có lịch sử hiến máu nào."
        />
      </div>
    </div>
  );
}

export default MyDonationHistory; 