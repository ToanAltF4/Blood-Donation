import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axios from "axios";
import "./controllEvent.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";


function ControllEvent() {
  const formatDatetime = (datetimeString) => {
    return dayjs(datetimeString).format("YYYY-MM-DD HH:mm");
  };
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [isCreateModal, setIsCreateModal] = useState(false); // true nếu đang thêm mới

  const HOST = process.env.REACT_APP_HOST;
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Lưu thông tin người dùng vào localStorage
    console.log("User:", user.role);
    if (!user || !user.role) {
      navigate("/");
      return;
    }
    if (user.role == "Member") {
      navigate("/");
    }
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${HOST}/api/admin/getAllEvents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Format lại thời gian
        const formattedEvents = response.data.map((event) => ({
          ...event,
          Time_Start: formatDatetime(event.Time_Start),
          Time_End: formatDatetime(event.Time_End),
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sự kiện từ API:", error);
      }
    };

    fetchEvents();
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.Event_ID,
      sortable: true,
      width: "5px"
    },

    {
      name: "Tên Event",
      selector: (row) => row.Event_Name,
      sortable: true,
      width: "320px",
      cell: (row) => (
        <div>
          <strong style={{ fontSize: "18px" }}>{row.Event_Name}</strong>
          <div
            style={{
              fontSize: "12px",
              color: "#666",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "320px", // phải nhỏ hơn hoặc bằng column width
            }}
          >
            {row.Content}
          </div>
        </div>
      ),
    },

    { name: "Địa điểm", selector: (row) => row.Location, width: "320px" },
    { name: "Bắt đầu", selector: (row) => row.Time_Start, sortable: true },
    { name: "Kết thúc", selector: (row) => row.Time_End },
    {
      name: "Trạng thái",
      selector: (row) => row.Status,
      cell: (row) =>
        row.Status === "Sắp diễn ra" ? (
          <button
            style={{
              width: "130px",
              height: "30px",
              border: "none",
              color: "white",
              borderRadius: "15px",
              backgroundColor: "#007bff",
              fontWeight: "lighter",
            }}
          >
            {row.Status}
          </button>
        ) : row.Status === "Đang diễn ra" ? (
          <button
            style={{
              width: "130px",
              height: "30px",
              border: "none",
              color: "white",
              borderRadius: "15px",
              backgroundColor: "#dc3545",
              fontWeight: "lighter",
            }}
          >
            {row.Status}
          </button>
        ) : (
          <button
            style={{
              width: "130px",
              height: "30px",
              border: "none",
              color: "white",
              borderRadius: "15px",
              backgroundColor: "#28a745",
              fontWeight: "lighter",
            }}
          >
            {row.Status}
          </button>
        ),
    },
    // { name: "SL", selector: (row) => row.Count_Reg, width: "65px" },

    {
      name: "Action",
      cell: (row) => (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <FaEdit
            onClick={() => handleEdit(row)}
            style={{ cursor: "pointer", color: "black" }}
          />
          <FaTrash
            onClick={() => handleDelete(row.Event_ID)}
            style={{ cursor: "pointer", color: "black" }}
          />
        </div>
      ),
      width: "100px",
    },
  ];
  const filteredEvents = events.filter((event) => {
    const matchesStatus =
      statusFilter === "All" || event.Status === statusFilter;
    const matchesSearch = Object.values(event)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const [editingEvent, setEditingEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (eventRow) => {
    setEditingEvent(eventRow);
    setShowEditModal(true);
  };

  const handleDelete = (eventId) => {
  Swal.fire({
    title: "Bạn có chắc chắn muốn xóa?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${HOST}/api/admin/deleteEvents`,
          { Event_ID: eventId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEvents((prev) => prev.filter((e) => e.Event_ID !== eventId));

        Swal.fire({
          icon: "success",
          title: "Đã xóa!",
          text: "Sự kiện đã được xóa thành công.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Lỗi khi xóa sự kiện:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể xóa sự kiện. Vui lòng thử lại.",
        });
      }
    }
  });
};


  // Component mở rộng để hiển thị danh sách người đăng ký
  const ExpandableComponent = ({ data }) => (
    <div style={{ padding: "1px 120px", background: "#f9f9f9" }}>
      <h4>{data.Event_Name}</h4>
      <p>{data.Content}</p>
      {data.Registrants && data.Registrants.length > 0 ? (
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          <strong>Danh sách người đăng ký ({data.Count_Reg} người):</strong>

          {data.Registrants.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      ) : (
        <p>Không có người đăng ký.</p>
      )}
    </div>
  );
  const customStyles = {
    table: {
      style: {
        width: "100%", // hoặc '1200px', '90vw' tùy ý
      },
    },
    rows: {
      style: {
        fontSize: "15px",
      },
    },
    headCells: {
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        fontSize: "15px",
      },
    },
  };

  return (
    <div className="container-fluid py-4">
      <div className="container">
        <h2 className="text-center mb-4">Quản lý Sự Kiện</h2>

        <div className="row mb-3 align-items-center">
          <div className="col-md-3 mb-2">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Sắp diễn ra">Sắp diễn ra</option>
              <option value="Đang diễn ra">Đang diễn ra</option>
              <option value="Đã kết thúc">Đã kết thúc</option>
            </select>
          </div>

          <div className="col-md-6 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm sự kiện..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="col-md-3 mb-2 text-md-end">
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsCreateModal(true);
                setEditingEvent({
                  Event_ID: "",
                  Event_Name: "",
                  Content: "",
                  Location: "",
                  Time_Start: "",
                  Time_End: "",
                  Status: "Sắp diễn ra",
                  Registrants: [],
                  Count_Reg: 0,
                });
                setShowEditModal(true);
              }}
            >
              + Thêm sự kiện
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredEvents}
          pagination
          highlightOnHover
          striped
          customStyles={customStyles}
          expandableRows
          expandOnRowClicked
          expandableRowsComponent={ExpandableComponent}
        />

        {showEditModal && editingEvent && (
          <div className="modal fade show d-block w-100 vh-100" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Sự kiện</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Tên sự kiện:</label>
                    <input
                      className="form-control"
                      type="text"
                      value={editingEvent.Event_Name}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, Event_Name: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nội dung:</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={editingEvent.Content}
                      onChange={(e) => setEditingEvent({ ...editingEvent, Content: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Địa điểm:</label>
                    <input
                      className="form-control"
                      type="text"
                      value={editingEvent.Location}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, Location: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Thời gian bắt đầu:</label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      value={editingEvent.Time_Start}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, Time_Start: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Thời gian kết thúc:</label>
                    <input
                      className="form-control"
                      type="datetime-local"
                      value={editingEvent.Time_End}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, Time_End: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Trạng thái:</label>
                    <select
                      className="form-select"
                      value={editingEvent.Status}
                      onChange={(e) =>
                        setEditingEvent({ ...editingEvent, Status: e.target.value })
                      }
                    >
                      <option value="Sắp diễn ra">Sắp diễn ra</option>
                      <option value="Đang diễn ra">Đang diễn ra</option>
                      <option value="Đã kết thúc">Đã kết thúc</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-success"
                    onClick={async () => {
                      const eventToSubmit = {
                        ...editingEvent,
                        User_ID: localStorage.getItem("user_id"),
                      };

                      try {
                        const token = localStorage.getItem("token");
                        if (isCreateModal) {
                          const response = await axios.post(
                            HOST + "/api/admin/addEvent",
                            {
                              Name_Event: eventToSubmit.Event_Name,
                              Content: eventToSubmit.Content,
                              Location: eventToSubmit.Location,
                              Time_Start: eventToSubmit.Time_Start,
                              Time_End: eventToSubmit.Time_End,
                              Status: eventToSubmit.Status,
                              User_ID: eventToSubmit.User_ID,
                            },
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );
                          const newEvent = {
                            ...eventToSubmit,
                            Event_ID: response.data.Event_ID,
                            Count_Reg: 0,
                            Registrants: [],
                          };
                          setEvents([...events, newEvent]);
                          Swal.fire({ icon: "success", title: "Thành công", text: "Sự kiện đã được thêm thành công!", timer: 2000, showConfirmButton: false });
                        } else {
                          console.log("Editing event:", editingEvent);
                          await axios.post(
                            `${HOST}/api/admin/changeEvents`,
                            {
                              Event_ID: editingEvent.Event_ID,
                              Name_Event: eventToSubmit.Event_Name,
                              Content: eventToSubmit.Content,
                              Location: eventToSubmit.Location,
                              Time_Start: eventToSubmit.Time_Start,
                              Time_End: eventToSubmit.Time_End,
                              Status: eventToSubmit.Status,
                            },
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );
                          setEvents((prev) => prev.map((e) => (e.Event_ID === editingEvent.Event_ID ? editingEvent : e)));
                          Swal.fire({ icon: "success", title: "Cập nhật thành công", text: "Sự kiện đã được cập nhật.", timer: 2000, showConfirmButton: false });
                        }
                        setShowEditModal(false);
                        setIsCreateModal(false);
                      } catch (error) {
                        Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể thêm sự kiện. Vui lòng thử lại!" });
                      }
                    }}
                  >
                    Lưu
                  </button>
                  <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Hủy</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ControllEvent;
