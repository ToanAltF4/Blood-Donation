import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterEvent() {
  const HOST = process.env.REACT_APP_HOST;
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  // Format ngày tháng năm
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN");
  };

  useEffect(() => {
    if (!user || user.role !== "Member") {
      navigate("/");
      return;
    }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${HOST}/api/member/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire("Lỗi", "Không thể tải danh sách sự kiện.", "error");
    }
  };

  // Kiểm tra thông tin cá nhân bắt buộc (dùng key viết thường)
  const isUserInfoComplete = (user) => {
    if (!user) return false;
    const requiredFields = [
      "full_name",
      "cccd",
      "phone",
      "email",
      "location",
      "date_of_birth",
    ];
    return requiredFields.every((field) => user[field] && user[field].toString().trim() !== "");
  };

  const handleRegister = async (eventId) => {
    if (!isUserInfoComplete(user)) {
      Swal.fire({
        icon: "warning",
        title: "Vui lòng cập nhật đầy đủ thông tin cá nhân để tiến hành đăng ký hiến máu!",
        showConfirmButton: true,
      });
      return;
    }
    try {
      const token = localStorage.getItem("token");
      // Gọi API đăng ký (tạo bản ghi mới trong List_Reg)
      await axios.post(
        `${HOST}/api/member/register-event`,
        { Event_ID: eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công!",
        text: "Bạn đã đăng ký hiến máu cho sự kiện này.",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchEvents(); // reload lại danh sách
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi đăng ký!",
        text: error.response?.data?.message || "Đã xảy ra lỗi khi đăng ký.",
      });
    }
  };

  const columns = [
    { name: "Tên sự kiện", selector: (row) => row.Name_Event || row.Event_Name, grow: 2, wrap: true },
    { name: "Địa điểm", selector: (row) => row.Location, grow: 3, wrap: true },
    { name: "Bắt đầu", selector: (row) => formatDate(row.Time_Start), width: "130px", wrap: true },
    { name: "Kết thúc", selector: (row) => formatDate(row.Time_End), width: "130px", wrap: true },
    { name: "Trạng thái", selector: (row) => row.Status, wrap: true },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="btn btn-danger btn-sm fw-bold"
          onClick={() => handleRegister(row.Event_ID)}
        >
          Đăng ký ngay
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      wrap: true,
    },
  ];

  // Lọc sự kiện chưa kết thúc
  const availableEvents = events.filter(e => e.Status !== "Đã kết thúc");

  const customStyles = {
    rows: { style: { fontSize: "18px" } },
    headCells: { style: { fontSize: "20px", fontWeight: "bold" } },
    cells: { style: { fontSize: "18px" } },
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold">Đăng ký hiến máu tại sự kiện</h2>
      <div className="card p-3 shadow">
        <DataTable
          columns={columns}
          data={availableEvents}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          customStyles={customStyles}
          noDataComponent="Không có sự kiện nào."
        />
      </div>
    </div>
  );
}

export default RegisterEvent; 