import "./Index.css";
import React, { useState, useEffect } from "react";
import Navbar from "../component/Navbar/navbar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const HOST = process.env.REACT_APP_HOST;

// Wrapper function để xử lý vấn đề aria-hidden
const showAlert = (options) => {
  // Xóa aria-hidden từ root element trước khi hiển thị alert
  const rootElement = document.getElementById('root');
  if (rootElement && rootElement.getAttribute('aria-hidden') === 'true') {
    rootElement.removeAttribute('aria-hidden');
  }
  
  return Swal.fire({
    ...options,
    backdrop: false,
    allowOutsideClick: false,
    allowEscapeKey: true,
    customClass: {
      container: 'swal-no-aria-hidden',
      ...options.customClass
    },
    didOpen: () => {
      // Đảm bảo không có element nào trong popup có focus
      const popup = document.querySelector('.swal2-popup');
      if (popup) {
        popup.setAttribute('tabindex', '-1');
        popup.focus();
      }
    },
    willClose: () => {
      // Khôi phục focus về element trước đó
      const rootElement = document.getElementById('root');
      if (rootElement) {
        rootElement.focus();
      }
    }
  });
};

const faqList = [
  {
    question: "Tôi có thể hiến máu bao nhiêu lần trong năm?",
    answer:
      "Mỗi người có thể hiến máu tối đa 4 lần/năm, cách nhau ít nhất 12 tuần giữa 2 lần hiến.",
  },
  {
    question: "Hiến máu có ảnh hưởng đến sức khỏe không?",
    answer:
      "Không. Cơ thể sẽ tái tạo lượng máu đã hiến trong vòng vài ngày. Người khỏe mạnh có thể hiến máu định kỳ.",
  },
  {
    question: "Quy trình hiến máu như thế nào?",
    answer:
      "Quy trình bao gồm: (1) Đăng ký và khai báo y tế, (2) Kiểm tra huyết áp, cân nặng, (3) Lấy máu, (4) Nghỉ ngơi và theo dõi sau hiến.",
  },
  {
    question: "Khi tôi cần máu khẩn cấp thì làm gì?",
    answer:
      "Bạn có thể gọi ngay tổng đài hỗ trợ khẩn cấp 0868396721 hoặc truy cập website để gửi yêu cầu khẩn cấp. Hệ thống sẽ tự động kết nối với các người hiến phù hợp.",
  },
  {
    question: "Có vết bầm nhẹ sau khi hiến máu, tôi nên làm gì?",
    answer:
      "Nếu có vết bầm hoặc sưng nhẹ, bạn có thể chườm đá lạnh trong 10–15 phút, 2–3 lần/ngày để giảm sưng. Nếu có biểu hiện bất thường, hãy liên hệ cơ sở y tế.",
  },
  {
    question: "Sau khi hiến máu nên ăn gì để phục hồi?",
    answer:
      "Bạn nên uống nhiều nước và bổ sung các thực phẩm giàu sắt như thịt đỏ, gan, trứng, rau xanh đậm và trái cây chứa vitamin C để hỗ trợ quá trình tái tạo máu.",
  },
];
function Index() {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showReadyDonateModal, setShowReadyDonateModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showBloodLookupModal, setShowBloodLookupModal] = useState(false);
  const [lookupBlood, setLookupBlood] = useState("");
  const [emergencyBlood, setEmergencyBlood] = useState("");
  const [emergencyLoading, setEmergencyLoading] = useState(false);
  const newsPerPage = 8;
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState("");
  const [feedbackError, setFeedbackError] = useState("");

  // Lấy user từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isMember = user && user.role === "Member";

  // Danh sách nhóm máu
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const emergencyAddress = "99 Lê Văn Việt, Phường Tân Phú, TP Thủ Đức";

  // Quy tắc truyền máu (đơn giản hóa)
  const bloodCompatibility = {
    "A+": { receive: ["A+", "A-", "O+", "O-"], donate: ["A+", "AB+"] },
    "A-": { receive: ["A-", "O-"], donate: ["A-", "A+", "AB-", "AB+"] },
    "B+": { receive: ["B+", "B-", "O+", "O-"], donate: ["B+", "AB+"] },
    "B-": { receive: ["B-", "O-"], donate: ["B-", "B+", "AB-", "AB+"] },
    "AB+": { receive: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] , donate: ["AB+"] },
    "AB-": { receive: ["A-", "B-", "AB-", "O-"] , donate: ["AB-", "AB+"] },
    "O+": { receive: ["O+", "O-"] , donate: ["O+", "A+", "B+", "AB+"] },
    "O-": { receive: ["O-"] , donate: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"] },
  };

  // Gọi API khi component mount
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(HOST+'/api/news/getnews');
        const data = await res.json();
        if (res.ok) {
          setNewsList(data.posts); // Lưu danh sách bài viết từ API
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error('Lỗi khi gọi API:', err);
      }
    };

    fetchNews();
  }, []);

  const totalPages = Math.ceil(newsList.length / newsPerPage);
  const indexOfLast = currentPage * newsPerPage;
  const indexOfFirst = indexOfLast - newsPerPage;
  const currentNews = newsList.slice(indexOfFirst, indexOfLast);

  const handleClick = (postId) => {
    navigate(`/news/${postId}`);
  };
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
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

  // Xử lý đăng ký sẵn sàng hiến máu
  const handleReadyDonateClick = () => {
    if (!isUserInfoComplete(user)) {
      showAlert({
        icon: "warning",
        title: "Vui lòng cập nhật đầy đủ thông tin cá nhân để đăng ký sẵn sàng hiến máu!",
        showConfirmButton: true,
        customClass: {
          container: 'swal-no-aria-hidden'
        }
      });
      return;
    }
    setShowReadyDonateModal(true);
  };

  const handleReadyDonate = async () => {
    try {
      // Kiểm tra HTTPS cho geolocation trên public domain
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        showAlert({
          icon: "warning",
          title: "Yêu cầu HTTPS",
          text: "Để lấy vị trí, website cần được truy cập qua HTTPS trên public domain.",
          customClass: {
            container: 'swal-no-aria-hidden'
          }
        });
        return;
      }

      // Kiểm tra hỗ trợ geolocation
      if (!navigator.geolocation) {
        showAlert({
          icon: "error",
          title: "Trình duyệt không hỗ trợ",
          text: "Trình duyệt của bạn không hỗ trợ lấy vị trí.",
          customClass: {
            container: 'swal-no-aria-hidden'
          }
        });
        return;
      }

      // Lấy vị trí hiện tại
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      // Gọi API đăng ký
      const token = localStorage.getItem('token');
      const response = await fetch(`${HOST}/api/ready-donate/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ latitude, longitude })
      });
      const data = await response.json();
      if (response.ok) {
        showAlert({
          icon: "success",
          title: "Đăng ký sẵn sàng hiến máu thành công!",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            container: 'swal-no-aria-hidden'
          }
        });
        setShowReadyDonateModal(false);
      } else {
        showAlert({
          icon: "error",
          title: data.message || 'Có lỗi xảy ra!',
          customClass: {
            container: 'swal-no-aria-hidden'
          }
        });
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      
      if (error.code === 1) {
        showAlert({
          icon: "warning",
          title: "Quyền truy cập bị từ chối",
          text: "Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt để đăng ký!",
          customClass: {
            container: 'swal-no-aria-hidden'
          }
        });
      } else if (error.code === 2) {
        showAlert({
          icon: "error",
          title: "Không thể xác định vị trí",
          text: "Không thể xác định vị trí hiện tại. Vui lòng thử lại!",
          customClass: {
            container: 'swal-no-aria-hidden'
          }
        });
      } else if (error.code === 3) {
        showAlert({
          icon: "error",
          title: "Hết thời gian chờ",
          text: "Không thể lấy vị trí trong thời gian quy định. Vui lòng thử lại!",
          customClass: {
            container: 'swal-no-aria-hidden'
          }
        });
      } else {
        showAlert({
          icon: "error",
          title: "Có lỗi xảy ra khi lấy vị trí!",
          text: error.message || "Vui lòng thử lại sau.",
          customClass: {
            container: 'swal-no-aria-hidden'
          }
        });
      }
    }
  };

  // Gửi yêu cầu máu khẩn cấp
  const handleSendEmergency = async () => {
    if (!emergencyBlood) {
      showAlert({ 
        icon: 'warning', 
        title: 'Vui lòng chọn nhóm máu cần khẩn cấp!',
        customClass: {
          container: 'swal-no-aria-hidden'
        }
      });
      return;
    }
    setEmergencyLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${HOST}/api/member/emergency`, {
        Blood_need: emergencyBlood,
        Location: emergencyAddress,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowEmergencyModal(false);
      setEmergencyBlood("");
      showAlert({ 
        icon: 'success', 
        title: 'Đã gửi yêu cầu máu khẩn cấp!',
        customClass: {
          container: 'swal-no-aria-hidden'
        }
      });
    } catch (error) {
      showAlert({ 
        icon: 'error', 
        title: 'Lỗi', 
        text: 'Không gửi được yêu cầu!',
        customClass: {
          container: 'swal-no-aria-hidden'
        }
      });
    }
    setEmergencyLoading(false);
  };

  const handleSubmitFeedback = async () => {
    setFeedbackSuccess("");
    setFeedbackError("");
    if (!feedbackContent.trim()) {
      setFeedbackError("Vui lòng nhập nội dung góp ý!");
      return;
    }
    setFeedbackLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${HOST}/api/member/feedback`, { content: feedbackContent }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 201) {
        setFeedbackSuccess("Cảm ơn bạn đã gửi phản hồi về hệ thống!");
        setFeedbackContent("");
      } else {
        setFeedbackError(res.data.message || "Có lỗi xảy ra!");
      }
    } catch (err) {
      setFeedbackError(err.response?.data?.message || "Không gửi được góp ý!");
    }
    setFeedbackLoading(false);
  };

  return (
    <div>
      <div
        id="homepage"
        className="home-page"
        style={{
          backgroundImage: "url(/img/background.svg)",
          minHeight: "100vh"
        }}
      >
      
        {/* Nút Đăng ký sẵn sàng hiến máu cho member */}
        {isMember && (
          <div className="d-flex justify-content-center" style={{ position: "absolute", top: "25vh",left: 60 }}>
            <button
              className="btn btn-warning btn-lg fw-bold shadow"
              style={{ borderRadius: 30, padding: "18px 60px", fontSize: 32 }}
              onClick={handleReadyDonateClick}
            >
              Đăng ký sẵn sàng hiến máu
            </button>
          </div>
        )}
        {/* Button khẩn cấp cho member */}
      {isMember && (
        <div style={{ position: "absolute", top: "30vh", right: 60 }}>
          <button
            className="btn btn-danger rounded-circle shadow "
            style={{ width: 108, marginLeft: 90, height: 108, fontSize: 18, fontWeight: 'bold', textAlign: 'center', lineHeight: 1.1, boxShadow: '0 4px 16px rgba(220,53,69,0.2)' }}
            title="Cần máu khẩn cấp"
            onClick={() => setShowEmergencyModal(true)}
          >
            Cần máu<br/>khẩn cấp
          </button>
          <div className="mt-3 d-flex justify-content-center">
            <button
              className="btn btn-info fw-bold"
              style={{ borderRadius: 30, padding: "10px 28px", fontSize: 18 }}
              onClick={() => setShowBloodLookupModal(true)}
            >
              Tra cứu nhóm máu
            </button>
          </div>
        </div>
      )}

        {/* Nút Đăng ký ngay cho member */}
        {isMember && (
          <div style={{ position: "absolute", top: "98vh", left: 60 }}>
            <button
              className="btn btn-danger btn-lg fw-bold shadow"
              style={{ borderRadius: 30, padding: "16px 48px", fontSize: 28 }}
              onClick={() => navigate("/register-event")}
            >
              Đăng ký ngay
            </button>
          </div>
        )}
      </div>

      {/* Modal đăng ký sẵn sàng hiến máu */}
      {showReadyDonateModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3>Xác nhận đăng ký sẵn sàng hiến máu</h3>
            <p>Bạn có chắc chắn muốn đăng ký sẵn sàng hiến máu không?</p>
            <p><strong>Lưu ý:</strong> Hệ thống sẽ yêu cầu quyền truy cập vị trí của bạn.</p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowReadyDonateModal(false)}
                style={{ outline: 'none' }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              >
                Hủy
              </button>
              <button
                className="btn btn-success"
                onClick={handleReadyDonate}
                style={{ outline: 'none' }}
                onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)'}
                onBlur={(e) => e.target.style.boxShadow = 'none'}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      
      {/* Modal form khẩn cấp */}
      {showEmergencyModal && (
        <div className="modal fade show d-block w-100 vh-100" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title"><i className="bi bi-exclamation-triangle-fill me-2"></i>Yêu cầu máu khẩn cấp</h5>
                <button type="button" className="btn-close" onClick={() => setShowEmergencyModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Nhóm máu cần khẩn cấp</label>
                  <select
                    className="form-select"
                    value={emergencyBlood}
                    onChange={e => setEmergencyBlood(e.target.value)}
                  >
                    <option value="">-- Chọn nhóm máu --</option>
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Địa chỉ nhận máu</label>
                  <input
                    className="form-control"
                    value={emergencyAddress}
                    disabled
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger fw-bold"
                  onClick={handleSendEmergency}
                  disabled={emergencyLoading}
                >
                  {emergencyLoading ? 'Đang gửi...' : 'Gửi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal tra cứu nhóm máu */}
      {showBloodLookupModal && (
        <div className="modal fade show d-block w-100 vh-100" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title"><i className="bi bi-search me-2"></i>Tra cứu nhóm máu</h5>
                <button type="button" className="btn-close" onClick={() => setShowBloodLookupModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Chọn nhóm máu của bạn</label>
                  <select
                    className="form-select"
                    value={lookupBlood}
                    onChange={e => setLookupBlood(e.target.value)}
                  >
                    <option value="">-- Chọn nhóm máu --</option>
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                {lookupBlood && (
                  <>
                    <div className="mb-2">
                      <strong>Nhóm máu có thể nhận:</strong>
                      <div className="mt-1">
                        {bloodCompatibility[lookupBlood].receive.map(bg => (
                          <span key={bg} className="badge bg-success me-2 mb-1" style={{ fontSize: 16 }}>{bg}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mb-2">
                      <strong>Nhóm máu có thể hiến:</strong>
                      <div className="mt-1">
                        {bloodCompatibility[lookupBlood].donate.map(bg => (
                          <span key={bg} className="badge bg-primary me-2 mb-1" style={{ fontSize: 16 }}>{bg}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowBloodLookupModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div id="intro">
        <div className="intro-section">
          <h2 className="intro-header">Giới thiệu</h2>

          <div className="intro-content">
            {/* Cột trái 30% */}
            <div className="intro-left">
              <h3>Về Cơ Sở Y Tế</h3>
              <p>
                Chúng tôi là một nền tảng hỗ trợ kết nối người hiến máu với
                cơ sở y tế. Với sứ mệnh "Một giọt máu - Triệu hy vọng", chúng
                tôi mong muốn xây dựng một cộng đồng hiến máu nhân đạo rộng lớn,
                minh bạch và hiệu quả, đồng thời truy xuất thông tin của khách hàng
                để đảm bảo quyền lợi và an toàn cho người hiến máu.
              </p>
            </div>

            {/* Cột phải 70% */}
            <div className="intro-right">
              <div className="member-grid">
                <div className="member-box">
                  <h4>Phạm Đức Toàn</h4>
                  <p className="member-role">fullstack Developer</p>
                  <img
                    src="https://tse4.mm.bing.net/th?id=OIP.PRxNOObh8Efy-7irFJNBygHaHa&pid=Api&P=0&h=180"
                    alt="CEO"
                    className="member-avatar-vertical"
                  />
                  <div className="contact-info">
                    <p>Email: toanpdse180165@fpt.edu.vn</p>
                    <p>SĐT: 0868 396 721</p>
                  </div>
                </div>

                <div className="member-box">
                  <h4>Nguyễn Văn Tiên</h4>
                  <p className="member-role">Frontend Developer</p>
                  <img
                    src="https://p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/b785f99ba39cb08030591a9aeb0868bc~c5_720x720.jpeg"
                    alt="Founder"
                    className="member-avatar-vertical"
                  />
                  <div className="contact-info">
                    <p>Email: tiennvse180325@fpt.edu.vn</p>
                    <p>SĐT: 0912 345 678</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="careful" className="careful-section">
        <h2 className="intro-header">Lưu Ý</h2>
        <div className="careful-container">
          {/* Cột trái */}
          <div className="careful-left">
            <h3 className="careful-title">Tiêu chuẩn tham gia hiến máu</h3>
            <div className="standards-grid">
              <div className="standard-box">
                <h4 className="standard-title">Đủ 18 – 60 tuổi</h4>
                <p className="standard-desc">
                  Người tham gia phải nằm trong Độ tuổi hiến máu phải trong
                  khoảng từ 18 đến 55 tuổi đối với nữ và 18 đến 60 tuổi đối với
                  nam.
                </p>
              </div>
              <div className="standard-box">
                <h4 className="standard-title">Cân nặng đủ</h4>
                <p className="standard-desc">
                  Nam ≥ 45kg, nữ ≥ 42kg để đảm bảo đủ thể tích máu cần thiết.
                </p>
              </div>

              <div className="standard-box">
                <h4 className="standard-title">Không mắc bệnh truyền nhiễm</h4>
                <p className="standard-desc">
                  Không mắc hoặc không có các hành vi nguy cơ lây nhiễm HIV,
                  không nhiễm viêm gan B, viêm gan C, và các virus lây qua đường
                  truyền máu
                </p>
              </div>

              <div className="standard-box">
                <h4 className="standard-title">Không nghiện</h4>
                <p className="standard-desc">
                  Không nghiện ma túy, rượu bia và các chất khích thích
                </p>
              </div>

              <div className="standard-box">
                <h4 className="standard-title">Không mang thai</h4>
                <p className="standard-desc">
                  Phụ nữ mang thai hoặc đang nuôi con dưới 1 tuổi không được
                  hiến máu.
                </p>
              </div>

              <div className="standard-box">
                <h4 className="standard-title">Thời gian hiến máu</h4>
                <p className="standard-desc">
                  Nam giới không được hiến quá 4 lần/năm, nữ không quá 3
                  lần/năm.
                </p>
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div className="careful-right">
            <h3 className="careful-title">Lưu ý khi hiến máu</h3>
            <div className="caution-box">
              <h2 style={{ color: "#2e97de" }}>Nên</h2>
              <ul>
                <li>Ngủ đủ giấc trước ngày hiến máu</li>
                <li>Ăn nhẹ,uống nhiều nước, không uống rượu</li>
                <li>Thông báo sức khỏe rõ ràng cho cơ sở y tế</li>
              </ul>
            </div>
            <div className="caution-box">
              <h2 style={{ color: "#f62609" }}>Không nên</h2>
              <ul>
                <li>Hiến máu khi đang cảm hoặc sốt</li>
                <li>Tập luyện mạnh sau khi hiến</li>
                <li>Hiến máu khi thiếu ngủ</li>
              </ul>
            </div>
            <div className="caution-box">
              <h2 style={{ color: "#DC7900" }}>Lưu ý</h2>
              <ul>
                <li>Ở lại theo dõi 10-15 phút sau hiến</li>
                <li>Uống đủ nước, ăn nhẹ sau hiến</li>
                <li>Tránh vận động mạnh trong 24h</li>
                <li>
                  Liên hệ ngay cho nhân viên y tế để được hỗ trợ khi cần thiết
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
       <div id="news" className="news-section">
      <h2 className="news-title">Tin Tức</h2>

      <div className="news-grid">
        {currentNews.map((news) => (
          <div
            key={news.Post_ID}
            className="news-box"
            onClick={() => handleClick(news.Post_ID)}
          >
            <img src={news.Post_Img} alt={news.Post_Header} className="news-img" />
            <div className="news-overlay">
              <h4>{news.Post_Header}</h4>
              <p>{new Date(news.Post_Time).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="news-pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Xem tất cả */}
      <div className="view-all-button">
        <button onClick={() => navigate('/news')}>Xem tất cả</button>
      </div>
    </div>
      <div id="contact" className="contact-section">
        <h2 style={{ textAlign: "center", color: "#f4f4f4" }}>
          Blood Donation
        </h2>
        <div className="contact-container">
          {/* Bên trái */}
          <div className="contact-left">
            <h2 className="contact-header">Chỉ đạo thực hiện:</h2>
            <div className="contact-logo">
              <img
                src="https://haitrieu.com/wp-content/uploads/2021/10/Logo-Dai-hoc-FPT-1024x399.png"
                alt="FPT University Logo"
              />
            </div>
            <p className="contact-info">
              <strong>LECTURER</strong>
            </p>
            <p className="contact-info">
              <strong>TON THAT HOANG MINH</strong> minhtth5@fpt.edu.vn
            </p>

            {/* Feedback box cho member */}
            {isMember && (
              <div className="card shadow-sm mt-4" style={{ maxWidth: 340, marginLeft: '0px', borderRadius: 12 }}>
                <div className="card-body p-3">
                  <textarea
                    className="form-control mb-2"
                    style={{ minHeight: 60, fontSize: 15, borderRadius: 8, resize: 'vertical' }}
                    placeholder="đóng góp ý kiến của bạn..."
                    value={feedbackContent}
                    onChange={e => setFeedbackContent(e.target.value)}
                    maxLength={500}
                  />
                  <button
                    className="btn btn-primary w-100 fw-bold"
                    style={{ borderRadius: 8, fontSize: 15 }}
                    onClick={handleSubmitFeedback}
                    disabled={feedbackLoading}
                  >
                    {feedbackLoading ? 'Đang gửi...' : 'Gửi'}
                  </button>
                  {feedbackSuccess && <div className="text-success text-center mt-2">{feedbackSuccess}</div>}
                  {feedbackError && <div className="text-danger text-center mt-2">{feedbackError}</div>}
                </div>
              </div>
            )}
          </div>

          {/* Bên phải */}
          <div className="contact-right">
            <h3 className="faq-header">Câu hỏi thường gặp</h3>
            <div className="faq-list">
              {faqList.map((faq, index) => (
                <div key={index} className="accordion-item">
                  <div
                    className={`accordion-header-box ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onClick={() => toggleAccordion(index)}
                  >
                    {faq.question}
                  </div>
                  <div
                    className={`accordion-body-box ${
                      activeIndex === index ? "show" : ""
                    }`}
                  >
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
