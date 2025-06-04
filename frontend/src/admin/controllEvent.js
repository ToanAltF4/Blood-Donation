import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import Navbar from "../component/Navbar/navbar";
import Swal from "sweetalert2";
import "./controllEvent.css";
import { FaEdit, FaTrash } from "react-icons/fa";
const mockEvents = [
  {
    Event_ID: 1,
    Event_Name: "Hiến máu cứu người - Khu vực A",
    Content:
      "Sự kiện hiến máu diễn ra tại khu vực A. asdasdasdasdasdasasdasdasasdas asd asdas đá ấ sd á asd asd asd asda sd asdas asd dá..",
    Location: "Trường Đại học Bách Khoa",
    Time_Start: "2025-06-15 08:00",
    Time_End: "2025-06-15 11:30",
    Status: "Sắp diễn ra",
    Count_Reg: 3,
    Registrants: ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C"],
  },
  {
    Event_ID: 2,
    Event_Name: "Ngày hội hiến máu xanh",
    Content: "Tham gia hiến máu cùng đội thanh niên tình nguyện...",
    Location: "Công viên Gia Định",
    Time_Start: "2025-06-20 09:00",
    Time_End: "2025-06-20 12:00",
    Status: "Sắp diễn ra",
    Count_Reg: 2,
    Registrants: ["Phạm Văn D", "Lê Thị E"],
  },
  {
    Event_ID: 3,
    Event_Name: "Hiến máu tình nguyện quận 5",
    Content: "Chương trình tổ chức tại trung tâm y tế quận 5...",
    Location: "TTYT Quận 5",
    Time_Start: "2025-06-10 08:00",
    Time_End: "2025-06-10 11:00",
    Status: "Đang diễn ra",
    Count_Reg: 4,
    Registrants: ["Nguyễn Hữu K", "Trần Thị L", "Lý Mạnh C", "Mai Lệ Q"],
  },
  {
    Event_ID: 4,
    Event_Name: "Chiến dịch giọt máu hồng",
    Content: "Chiến dịch lớn cấp thành phố với hàng ngàn người tham gia...",
    Location: "Sân vận động Phú Thọ",
    Time_Start: "2025-05-15 07:00",
    Time_End: "2025-05-15 12:00",
    Status: "Đã kết thúc",
    Count_Reg: 10,
    Registrants: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
  },
  {
    Event_ID: 5,
    Event_Name: "Chung tay vì sự sống",
    Content: "Hiến máu tại bệnh viện Chợ Rẫy để hỗ trợ cấp cứu...",
    Location: "BV Chợ Rẫy",
    Time_Start: "2025-06-12 08:00",
    Time_End: "2025-06-12 10:30",
    Status: "Sắp diễn ra",
    Count_Reg: 1,
    Registrants: ["Trần Quốc Hùng"],
  },
  {
    Event_ID: 6,
    Event_Name: "Truyền thống máu đỏ",
    Content: "Sự kiện thường niên tổ chức tại trường Kinh tế...",
    Location: "ĐH Kinh tế",
    Time_Start: "2025-06-25 09:00",
    Time_End: "2025-06-25 12:00",
    Status: "Sắp diễn ra",
    Count_Reg: 2,
    Registrants: ["Đỗ Mạnh Hùng", "Nguyễn Thị Hương"],
  },
  {
    Event_ID: 7,
    Event_Name: "Máu cho sự sống",
    Content: "Phối hợp cùng Hội Chữ thập đỏ...",
    Location: "Nhà thiếu nhi TP.HCM",
    Time_Start: "2025-06-08 08:00",
    Time_End: "2025-06-08 11:00",
    Status: "Đang diễn ra",
    Count_Reg: 5,
    Registrants: ["Nam", "Thư", "Tài", "Khánh", "Lan"],
  },
  {
    Event_ID: 8,
    Event_Name: "Hiến máu tại Đại học Y Dược",
    Content: "Sự kiện do Đoàn trường tổ chức...",
    Location: "ĐH Y Dược TP.HCM",
    Time_Start: "2025-06-11 07:30",
    Time_End: "2025-06-11 10:30",
    Status: "Sắp diễn ra",
    Count_Reg: 3,
    Registrants: ["Đặng Thị L", "Phan Văn M", "Vũ Minh H"],
  },
  {
    Event_ID: 9,
    Event_Name: "Máu trao đi - Hi vọng ở lại",
    Content: "Chương trình khuyến khích sinh viên hiến máu đầu năm...",
    Location: "KTX Đại học Quốc Gia",
    Time_Start: "2025-06-18 08:00",
    Time_End: "2025-06-18 11:00",
    Status: "Sắp diễn ra",
    Count_Reg: 6,
    Registrants: ["A1", "A2", "A3", "A4", "A5", "A6"],
  },
  {
    Event_ID: 10,
    Event_Name: "Ngày hội đỏ",
    Content: "Sự kiện mở đầu tháng hiến máu toàn quốc...",
    Location: "Công viên Lê Văn Tám",
    Time_Start: "2025-06-01 09:00",
    Time_End: "2025-06-01 12:00",
    Status: "Đã kết thúc",
    Count_Reg: 4,
    Registrants: ["Ngô Đức A", "Hồ Quỳnh B", "Lê Văn C", "Tống Thị D"],
  },
];

function ControllEvent() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [isCreateModal, setIsCreateModal] = useState(false); // true nếu đang thêm mới

  const HOST = process.env.REACT_APP_HOST;
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(mockEvents); // dùng dữ liệu mẫu ở trên
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.Event_ID,
      sortable: true,
      width: "90px",
    },

    {
      name: "Tên Event",
      selector: (row) => row.Event_Name,
      sortable: true,
      width: "400px",
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
              maxWidth: "360px", // phải nhỏ hơn hoặc bằng column width
            }}
          >
            {row.Content}
          </div>
        </div>
      ),
    },

    { name: "Địa điểm", selector: (row) => row.Location },
    { name: "Bắt đầu", selector: (row) => row.Time_Start, sortable: true },
    { name: "Kết thúc", selector: (row) => row.Time_End },
    { name: "Trạng thái", selector: (row) => row.Status,
        cell: (row) => (
            row.Status === "Sắp diễn ra" ? (
              <button style={{width:"130px", height: "30px",border: "none", color:"white", borderRadius: "15px", backgroundColor: "#007bff", fontWeight: "lighter" }}>
                {row.Status}
                </button>
            ) : row.Status === "Đang diễn ra" ? (
                <button style={{width:"130px", height: "30px",border: "none", color:"white", borderRadius: "15px", backgroundColor: "#dc3545", fontWeight: "lighter" }}>
                {row.Status}
                </button>
            ) : (
                <button style={{ width:"130px",height: "30px",border: "none", color:"white", borderRadius: "15px", backgroundColor: "#28a745", fontWeight: "lighter" }}>
                {row.Status}
                </button>
            )
        )
     },
    { name: "SL", selector: (row) => row.Count_Reg, width: "60px" },
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
      width: "120px",
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
    }).then((result) => {
      if (result.isConfirmed) {
        setEvents(events.filter((e) => e.Event_ID !== eventId));
        Swal.fire("Đã xóa!", "Sự kiện đã được xóa.", "success");
      }
    });
  };

  // Component mở rộng để hiển thị danh sách người đăng ký
  const ExpandableComponent = ({ data }) => (
    <div style={{ padding: "1px 120px", background: "#f9f9f9" }}>
      <h4>{data.Event_Name}</h4>
      <p>{data.Content}</p>
      {data.Registrants && data.Registrants.length > 0 ? (
        <ul>
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
        fontSize: "23px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        fontSize: "18px",
      },
    },
  };

  return (
    <div className="page-container">
      <div
        className="card-container"
        style={{ width: "95vw", maxWidth: "1600px", margin: "0 auto" }}
      >
        <h2 style={{textAlign:"center"}}>Quản lý Sự Kiện</h2>
        <div
          className="top-control"
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{border: "1px solid #ccc",borderRadius:"7px", padding: "8px", fontSize: "14px",width:"200px" }}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Sắp diễn ra">Sắp diễn ra</option>
            <option value="Đang diễn ra">Đang diễn ra</option>
            <option value="Đã kết thúc">Đã kết thúc</option>
          </select>

          <input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{border: "1px solid #ccc",borderRadius:"7px", flex: 1, padding: "8px", fontSize: "14px",width:"860px" }}
          />

          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
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
          <div className="modal-overlay">
            <div className="modal">
              <h3>Sự kiện</h3>

              <label>Tên sự kiện:</label>
              <input
                type="text"
                value={editingEvent.Event_Name}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    Event_Name: e.target.value,
                  })
                }
              />

              <label>Nội dung:</label>
              <textarea
                rows={3}
                value={editingEvent.Content}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, Content: e.target.value })
                }
              />

              <label>Địa điểm:</label>
              <input
                type="text"
                value={editingEvent.Location}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, Location: e.target.value })
                }
              />

              <label>Thời gian bắt đầu:</label>
              <input
                type="datetime-local"
                value={editingEvent.Time_Start}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    Time_Start: e.target.value,
                  })
                }
              />

              <label>Thời gian kết thúc:</label>
              <input
                type="datetime-local"
                value={editingEvent.Time_End}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, Time_End: e.target.value })
                }
              />

              <label>Trạng thái:</label>
              <select
                value={editingEvent.Status}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, Status: e.target.value })
                }
              >
                <option value="Sắp diễn ra">Sắp diễn ra</option>
                <option value="Đang diễn ra">Đang diễn ra</option>
                <option value="Đã kết thúc">Đã kết thúc</option>
              </select>

              <div className="modal-buttons">
                <button
  onClick={() => {
    if (isCreateModal) {
      const newId = Math.max(...events.map(e => e.Event_ID)) + 1;
      const newEvent = { ...editingEvent, Event_ID: newId };
      setEvents([...events, newEvent]);
    } else {
      setEvents((prev) =>
        prev.map((e) =>
          e.Event_ID === editingEvent.Event_ID ? editingEvent : e
        )
      );
    }

    setShowEditModal(false);
    setIsCreateModal(false);
  }}
>
  Lưu
</button>

                <button onClick={() => setShowEditModal(false)}>Hủy</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ControllEvent;
