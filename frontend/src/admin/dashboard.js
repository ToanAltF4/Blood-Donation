import React, { useState } from "react";
import DataTable from "react-data-table-component";
import ReactApexChart from "react-apexcharts";
import { FaTint } from "react-icons/fa"; // icon máu
import RightEventSidebar from "./RightEventSideBar"; // Import component bên phải
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [bloodUnits, setBloodUnits] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const HOST = process.env.REACT_APP_HOST;

  const [recentDonations, setRecentDonations] = useState([]);
  const bloodSummary = bloodUnits.reduce((acc, unit) => {
    const type = unit.Unit_Blood;
    const volume = unit.Volume || 0;
    if (!acc[type]) acc[type] = 0;
    acc[type] += volume;
    return acc;
  }, {});

  // Chuyển sang mảng để dùng cho chart
  const bloodTypes = Object.keys(bloodSummary).map((type) => ({
    type,
    volume: bloodSummary[type],
  }));
    const navigate = useNavigate();
  

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Lưu thông tin người dùng vào localStorage
    if (!user || !user.role) {
      navigate("/");
      return;
    }
    if (user.role != "Admin") {
      navigate("/");
    }
    const fetchBloodUnits = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${HOST}/api/admin/getAllBloodBanks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        setBloodUnits(data);

        // Sắp xếp theo thời gian hiến máu mới nhất
        const sorted = [...data].sort((a, b) => new Date(b.Donate_Time) - new Date(a.Donate_Time));
        const mapped = sorted.map((item) => ({
          name: item.Full_Name,
          phone: item.Phone,
          event: item.Event_Name || "Không rõ",
          blood: item.Unit_Blood,
          donateTime: item.Donate_Time,
        }));
        setRecentDonations(mapped);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu máu:", error);
      }
    };

    fetchBloodUnits();
  }, []);

  const customStyles = {
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
        fontSize: "18px",
      },
    },
  };

  const donutData = {
    series: bloodTypes.map((b) => b.volume),
    options: {
      labels: bloodTypes.map((b) => b.type),
      chart: {
        type: "donut",
        events: {
          dataPointSelection: (event, chartContext, config) => {
            const index = config.dataPointIndex;
            setSelectedIndex(index);
          },
          click: (event, chartContext, config) => {
            if (config.dataPointIndex === -1) setSelectedIndex(null);
          },
        },
      },
      legend: { position: "bottom" },
      tooltip: {
        y: { formatter: (val) => `${val} ml` },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                formatter: () =>
                  selectedIndex !== null
                    ? bloodTypes[selectedIndex].type
                    : "Nhóm máu",
                fontSize: "18px",
                offsetY: -5,
              },
              value: {
                show: true,
                formatter: () =>
                  selectedIndex !== null
                    ? `${bloodTypes[selectedIndex].volume} ml`
                    : "",
                fontSize: "16px",
                offsetY: 5,
              },
              total: { show: false },
            },
          },
        },
      },
    },
  };

  const columns = [
    { name: "Tên", selector: (row) => row.name, sortable: true },
    { name: "Sự kiện", selector: (row) => row.event },
    { name: "SĐT", selector: (row) => row.phone },
    { name: "Unit", selector: (row) => row.blood, width: "80px" },
    { name: "Ngày", selector: (row) => new Date(row.donateTime).toLocaleDateString('vi-VN'), width: "120px" },
  ];
  const totalDonations = bloodUnits.length;

  const totalVolume = bloodUnits.reduce((sum, unit) => {
    return sum + (unit.Volume || 0);
  }, 0);
  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Cột bên trái 80% */}
        <div className="col-md-9">
          {/* 1. Nhóm máu */}
          <div className="row mb-4">
            {bloodTypes.map((b, idx) => (
              <div className="col-md-3" key={idx}>
                <div className="card shadow-sm p-3 mb-2 d-flex flex-row align-items-center">
                  <FaTint size={50} color="#dc3545" className="me-3" />
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                      {b.volume}
                    </div>
                    <div>{b.type} ml máu</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 2 + 3. Bảng và Donut chart */}
          <div className="row">
            {/* 2. Data Table */}
            <div className="col-md-8 mb-4">
              <div className="card shadow-sm p-3">
                <h5 className="mb-3">Hiến máu gần đây</h5>
                <DataTable
                  columns={columns}
                  data={recentDonations}
                  pagination
                  paginationPerPage={6} // 👈 số dòng hiển thị mặc định
                  paginationRowsPerPageOptions={[6, 10, 15]} // 👈 tuỳ chọn dropdown
                  dense
                  customStyles={customStyles}
                  highlightOnHover
                  striped
                />
              </div>
            </div>

            {/* 3. Donut Chart */}
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm p-3 text-center">
                <h5 className="mb-3">Kho máu</h5>
                {bloodTypes.length > 0 && (
                  <ReactApexChart
                    options={donutData.options}
                    series={donutData.series}
                    type="donut"
                    height={280}
                  />
                )}
              </div>
            </div>
          </div>
          {/* 4. Thống kê nhỏ phía dưới */}
          <div className="row">
            {[
              {
                title: "Tổng người sẵn sàng hiến",
                count: 0, // (có thể đếm từ danh sách User khác nếu cần)
                icon: (
                  <i
                    className="bi bi-person-heart"
                    style={{ fontSize: "2.5rem", color: "#0d6efd" }}
                  ></i>
                ),
              },
              {
                title: "Tổng số lượng hiến",
                count: bloodUnits.length,
                icon: (
                  <i
                    className="bi bi-person-check-fill"
                    style={{ fontSize: "2.5rem", color: "#198754" }}
                  ></i>
                ),
              },
              {
                title: "Tổng mililit máu",
                count: totalVolume,
                icon: (
                  <i
                    className="bi bi-droplet-half"
                    style={{ fontSize: "2.5rem", color: "#dc3545" }}
                  ></i>
                ),
              },
            ].map((item, idx) => (
              <div className="col-md-4 mb-4" key={idx}>
                <div className="card shadow-sm p-3 d-flex flex-column">
                  <h6 className="mb-3">{item.title}</h6>
                  <div className="d-flex align-items-center">
                    <div className="w-50 d-flex justify-content-center">
                      {item.icon}
                    </div>
                    <div
                      className="w-50 text-end"
                      style={{
                        fontSize: "40px",
                        fontWeight: "bold",
                        marginRight: "100px",
                      }}
                    >
                      {item.count}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột bên phải (20%) – bạn sẽ thêm sau */}
        <div className="col-md-3">
          <RightEventSidebar HOST={HOST} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
