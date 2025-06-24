import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

function StaffBloodBank() {
  const [bloodUnits, setBloodUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const HOST = process.env.REACT_APP_HOST;

  useEffect(() => {
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

  const columns = [
    { name: "Tên người hiến", selector: (row) => row.Full_Name, grow: 2 },
    { name: "SĐT", selector: (row) => row.Phone },
    { name: "Nhóm máu", selector: (row) => row.Unit_Blood, width: "90px" },
    { name: "Dung tích", selector: (row) => row.Volume, width: "90px" },
    { name: "Sự kiện", selector: (row) => row.Event_Name, grow: 2 },
    { name: "Ngày hiến", selector: (row) => new Date(row.Donate_Time).toLocaleDateString('vi-VN'), width: "120px" },
    { name: "Trạng thái", selector: (row) => row.Used_Status === 0 ? "Đang lưu kho" : row.Used_Status === 1 ? "Đã sử dụng" : row.Used_Status === 2 ? "Đã hủy" : "Không xác định", width: "120px" },
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
        <DataTable
          columns={columns}
          data={bloodUnits}
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