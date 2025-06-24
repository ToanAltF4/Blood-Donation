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
      const response = await axios.get(`${HOST}/api/admin/getAllEvents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire("Lỗi", "Không thể tải danh sách sự kiện.", "error");
    }
  };

  // Kiểm tra thông tin cá nhân bắt buộc
  const isUserInfoComplete = (user) => {
    if (!user) return false;
    const requiredFields = [
      "Full_Name",
      "CCCD",
      "Phone",
      "Email",
      "Location",
      "Blood",
      "Date_of_birth",
      "Family_contact",
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
    { name: "Tên sự kiện", selector: (row) => row.Event_Name, grow: 2 },
    { name: "Địa điểm", selector: (row) => row.Location, grow: 2 },
    { name: "Bắt đầu", selector: (row) => row.Time_Start },
    { name: "Kết thúc", selector: (row) => row.Time_End },
    { name: "Trạng thái", selector: (row) => row.Status },
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
    },
  ];

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold">Đăng ký hiến máu tại sự kiện</h2>
      <div className="card p-3 shadow">
        <DataTable
          columns={columns}
          data={events}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          noDataComponent="Không có sự kiện nào."
        />
      </div>
    </div>
  );
}

export default RegisterEvent; 