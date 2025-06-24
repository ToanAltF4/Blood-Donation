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

  const columns = [
    { name: "Tên sự kiện", selector: (row) => row.Event_Name, grow: 2 },
    { name: "Ngày hiến", selector: (row) => row.Donate_Time },
    { name: "Nhóm máu", selector: (row) => row.Unit_Blood },
    { name: "Dung tích", selector: (row) => row.Volume },
    { name: "Hồng cầu", selector: (row) => row.Red_Blood_Cells },
    { name: "Tiểu cầu", selector: (row) => row.Platelets },
    {
      name: "Trạng thái sử dụng",
      selector: (row) => row.Used_Status,
      cell: (row) => (
        <span
          style={{
            padding: "4px 10px",
            borderRadius: "12px",
            fontWeight: "bold",
            backgroundColor: row.Used_Status === 0 ? "#007bff" : "#28a745",
            color: "white",
          }}
        >
          {row.Used_Status === 0 ? "Đang lưu kho" : "Đã sử dụng"}
        </span>
      ),
    },
  ];

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
          noDataComponent="Bạn chưa có lịch sử hiến máu nào."
        />
      </div>
    </div>
  );
}

export default MyDonationHistory; 