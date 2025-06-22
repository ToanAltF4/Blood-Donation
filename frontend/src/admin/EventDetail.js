import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const HOST = process.env.REACT_APP_HOST;
  
  const [event, setEvent] = useState(null);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDonor, setEditingDonor] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const formatDatetime = (datetimeString) => {
    return dayjs(datetimeString).format("YYYY-MM-DD HH:mm");
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.role) {
      navigate("/");
      return;
    }
    if (user.role !== "Admin" && user.role !== "Staff") {
      navigate("/");
      return;
    }

    fetchEventDetail();
  }, [id]);

  const fetchEventDetail = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch event details
      const eventResponse = await axios.get(`${HOST}/api/admin/getEventById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fetch donors for this event
      const donorsResponse = await axios.get(`${HOST}/api/admin/getDonorsByEvent/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvent(eventResponse.data);
      setDonors(donorsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setLoading(false);
    }
  };

  const handleEditDonor = (donor) => {
    setEditingDonor(donor);
    setShowEditModal(true);
  };

  const handleUpdateDonor = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${HOST}/api/admin/updateDonor`,
        editingDonor,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setDonors(prev => prev.map(d => 
        d.Blood_ID === editingDonor.Blood_ID ? editingDonor : d
      ));

      setShowEditModal(false);
      setEditingDonor(null);
      
      Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: "Thông tin người hiến máu đã được cập nhật.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể cập nhật thông tin. Vui lòng thử lại.",
      });
    }
  };

  const columns = [
    {
      name: "Tên người hiến",
      selector: (row) => row.Full_Name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Ngày sinh",
      selector: (row) => row.Date_of_birth,
      cell: (row) => formatDate(row.Date_of_birth),
      width: "120px",
    },
    {
      name: "Số điện thoại",
      selector: (row) => row.Phone,
      width: "130px",
    },
    {
      name: "Email",
      selector: (row) => row.Email,
      width: "200px",
    },
    {
      name: "Địa chỉ",
      selector: (row) => row.Location,
      width: "150px",
    },
    {
      name: "Nhóm máu",
      selector: (row) => row.Unit_Blood,
      width: "100px",
    },
    {
      name: "Dung tích (ml)",
      selector: (row) => row.Volume,
      width: "120px",
    },
    {
      name: "Hồng cầu",
      selector: (row) => row.Red_Blood_Cells,
      width: "100px",
    },
    {
      name: "Tiểu cầu",
      selector: (row) => row.Platelets,
      width: "100px",
    },
    {
      name: "Trạng thái",
      selector: (row) => row.Status,
      cell: (row) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            backgroundColor: 
              row.Status === "Pending" ? "#ffc107" :
              row.Status === "Completed" ? "#28a745" :
              row.Status === "Cancelled" ? "#dc3545" : "#6c757d",
            color: "white",
          }}
        >
          {row.Status === "Pending" ? "Chờ xử lý" :
           row.Status === "Completed" ? "Hoàn thành" :
           row.Status === "Cancelled" ? "Đã hủy" : row.Status}
        </span>
      ),
      width: "120px",
    },
    {
      name: "Action",
      cell: (row) => (
        <FaEdit
          onClick={() => handleEditDonor(row)}
          style={{ cursor: "pointer", color: "#007bff" }}
          title="Cập nhật thông tin"
        />
      ),
      width: "80px",
    },
  ];

  const customStyles = {
    rows: {
      style: {
        fontSize: "14px",
      },
    },
    headCells: {
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        backgroundColor: "#f8f9fa",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
      },
    },
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container-fluid py-4">
        <div className="container text-center">
          <h3>Không tìm thấy sự kiện</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/events")}
          >
            <FaArrowLeft className="me-2" />
            Quay lại
          </button>
          <h2 className="mb-0">Chi tiết sự kiện</h2>
        </div>

        {/* Event Information */}
        <div className="card mb-4">
          <div className="card-header">
            <h4 className="mb-0">{event.Event_Name}</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <p className="text-muted">{event.Content}</p>
              </div>
              <div className="col-md-4">
                <div className="row">
                  <div className="col-6">
                    <strong>Địa điểm:</strong>
                    <p>{event.Location}</p>
                  </div>
                  <div className="col-6">
                    <strong>Trạng thái:</strong>
                    <p>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor: 
                            event.Status === "Sắp diễn ra" ? "#007bff" :
                            event.Status === "Đang diễn ra" ? "#dc3545" :
                            event.Status === "Đã kết thúc" ? "#28a745" : "#6c757d",
                          color: "white",
                        }}
                      >
                        {event.Status}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <strong>Bắt đầu:</strong>
                    <p>{formatDatetime(event.Time_Start)}</p>
                  </div>
                  <div className="col-6">
                    <strong>Kết thúc:</strong>
                    <p>{formatDatetime(event.Time_End)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Donors Table */}
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              Danh sách người đăng ký hiến máu ({donors.length} người)
            </h5>
          </div>
          <div className="card-body">
            <DataTable
              columns={columns}
              data={donors}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 50]}
              highlightOnHover
              striped
              customStyles={customStyles}
              noDataComponent="Không có người đăng ký hiến máu"
            />
          </div>
        </div>

        {/* Edit Modal */}
        {showEditModal && editingDonor && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Cập nhật thông tin người hiến máu</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tên người hiến:</label>
                      <input
                        className="form-control"
                        type="text"
                        value={editingDonor.Full_Name}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nhóm máu:</label>
                      <select
                        className="form-select"
                        value={editingDonor.Unit_Blood || ""}
                        onChange={(e) =>
                          setEditingDonor({ ...editingDonor, Unit_Blood: e.target.value })
                        }
                      >
                        <option value="">Chọn nhóm máu</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Dung tích máu (ml):</label>
                      <select
                        className="form-select"
                        value={editingDonor.Volume || ""}
                        onChange={(e) =>
                          setEditingDonor({ ...editingDonor, Volume: parseInt(e.target.value) })
                        }
                      >
                        <option value="">Chọn dung tích</option>
                        <option value="350">350ml</option>
                        <option value="450">450ml</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Trạng thái:</label>
                      <select
                        className="form-select"
                        value={editingDonor.Status || "Pending"}
                        onChange={(e) =>
                          setEditingDonor({ ...editingDonor, Status: e.target.value })
                        }
                      >
                        <option value="Pending">Chờ xử lý</option>
                        <option value="Completed">Hoàn thành</option>
                        <option value="Cancelled">Đã hủy</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Hồng cầu:</label>
                      <select
                        className="form-select"
                        value={editingDonor.Red_Blood_Cells || ""}
                        onChange={(e) =>
                          setEditingDonor({ ...editingDonor, Red_Blood_Cells: e.target.value })
                        }
                      >
                        <option value="">Chọn trạng thái</option>
                        <option value="Normal">Bình thường</option>
                        <option value="Low">Thấp</option>
                        <option value="High">Cao</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Tiểu cầu:</label>
                      <select
                        className="form-select"
                        value={editingDonor.Platelets || ""}
                        onChange={(e) =>
                          setEditingDonor({ ...editingDonor, Platelets: e.target.value })
                        }
                      >
                        <option value="">Chọn trạng thái</option>
                        <option value="Normal">Bình thường</option>
                        <option value="Low">Thấp</option>
                        <option value="High">Cao</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdateDonor}
                  >
                    Cập nhật
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setShowEditModal(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetail;
