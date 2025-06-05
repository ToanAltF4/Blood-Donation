import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

function RightEventSidebar({ HOST }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${HOST}/api/admin/getAllEvents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filtered = response.data.filter((e) =>
          ["Sắp diễn ra", "Đang diễn ra"].includes(e.Status)
        );

        setEvents(filtered);
      } catch (error) {
        console.error("Lỗi khi lấy sự kiện:", error);
      }
    };

    fetchEvents();
  }, [HOST]);

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">Sự kiện</h5>
      {events.map((event, idx) => {
        const date = dayjs(event.Time_Start);
        const isOngoing = event.Status === "Đang diễn ra";

        return (
          <div
            key={idx}
            className={`d-flex align-items-center mb-3 rounded shadow-sm p-2 ${
              isOngoing ? "bg-primary text-white" : "bg-white"
            }`}
          >
            {/* Box ngày tháng */}
            <div
              className={`d-flex flex-column align-items-center justify-content-center rounded p-2 me-3 ${
                isOngoing ? "bg-white text-primary" : "bg-warning text-white"
              }`}
              style={{ width: "60px", height: "60px", minWidth: "60px" }}
            >
              <div className="fw-bold fs-5">{date.format("DD")}</div>
              <div className="text-uppercase" style={{ fontSize: "13px" }}>
                {date.format("MMM")}
              </div>
            </div>

            {/* Nội dung */}
            <div className="flex-grow-1">
              <div className="fw-semibold" style={{ fontSize: "15px" }}>
                {event.Event_Name}
              </div>
              <div className="small">
                {String(event.Count_Reg).padStart(3, "0")} đã đăng ký
              </div>
            </div>

            <div className="fs-4 ms-2">{">"}</div>
          </div>
        );
      })}
    </div>
  );
}

export default RightEventSidebar;
