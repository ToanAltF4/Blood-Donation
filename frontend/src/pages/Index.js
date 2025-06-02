import "./Index.css";
import React, { useState, useEffect } from "react";
import Navbar from "../component/Navbar/navbar";
import { useNavigate } from "react-router-dom";

const dummyNews = [
  {
    id: 1,
    title: "Ngày hội hiến máu 2025",
    date: "2025-05-20",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 2,
    title: "Hiến máu cứu người giữa đêm khuya",
    date: "2025-05-18",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 3,
    title: "Đại học FPT tổ chức hiến máu nhân đạo",
    date: "2025-05-15",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 4,
    title: "Câu chuyện hiến máu của những người hùng",
    date: "2025-05-10",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 5,
    title: "Hiến máu và những điều cần biết",
    date: "2025-05-05",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 6,
    title: "Tầm quan trọng của việc hiến máu định kỳ",
    date: "2025-04-30",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 7,
    title: "Những câu hỏi thường gặp về hiến máu",
    date: "2025-04-25",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 8,
    title: "Cách chăm sóc sau khi hiến máu",
    date: "2025-04-20",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 9,
    title: "Hiến máu và sức khỏe cộng đồng",
    date: "2025-04-15",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 10,
    title: "Câu chuyện cảm động từ người hiến máu",
    date: "2025-04-10",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 11,
    title: "Hiến máu và những lợi ích sức khỏe",
    date: "2025-04-05",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 12,
    title: "Chương trình hiến máu tại bệnh viện XYZ",
    date: "2025-04-01",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 13,
    title: "Hiến máu và những điều cần lưu ý",
    date: "2025-03-30",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 14,
    title: "Câu chuyện hiến máu của những người anh hùng",
    date: "2025-03-25",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 15,
    title: "Hiến máu và những lợi ích cho sức khỏe",
    date: "2025-03-20",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
  {
    id: 16,
    title: "Chương trình hiến máu tại trường đại học ABC",
    date: "2025-03-15",
    image:
      "https://tse3.mm.bing.net/th?id=OIP.p_ZKkTvEYvM49jcJ1do_kgHaFj&pid=Api&P=0&h=180",
  },
];
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
      "Bạn có thể gọi ngay tổng đài hỗ trợ khẩn cấp 1900 868 638 hoặc truy cập ứng dụng để gửi yêu cầu khẩn cấp. Hệ thống sẽ tự động kết nối với các người hiến phù hợp.",
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
  const HOST = process.env.REACT_APP_HOST;
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 8;

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
  return (
    <div>
      <div
        id="homepage"
        className="home-page"
        style={{
          backgroundImage: "url(/img/background.svg)",
          minHeight: "100vh",
        }}
      ></div>
      <div id="intro">
        <div className="intro-section">
          <h2 className="intro-header">Giới thiệu</h2>

          <div className="intro-content">
            {/* Cột trái 30% */}
            <div className="intro-left">
              <h3>Về Doanh nghiệp</h3>
              <p>
                Chúng tôi là một nền tảng hỗ trợ kết nối người hiến máu với các
                cơ sở y tế. Với sứ mệnh "Một giọt máu - Triệu hy vọng", chúng
                tôi mong muốn xây dựng một cộng đồng hiến máu nhân đạo rộng lớn,
                minh bạch và hiệu quả.
              </p>
            </div>

            {/* Cột phải 70% */}
            <div className="intro-right">
              <div className="member-grid">
                <div className="member-box">
                  <h4>Nguyễn Văn A</h4>
                  <p className="member-role">CEO</p>
                  <img
                    src="https://tse4.mm.bing.net/th?id=OIP.PRxNOObh8Efy-7irFJNBygHaHa&pid=Api&P=0&h=180"
                    alt="CEO"
                    className="member-avatar-vertical"
                  />
                  <div className="contact-info">
                    <p>Email: ceo@example.com</p>
                    <p>SĐT: 0901 234 567</p>
                  </div>
                </div>

                <div className="member-box">
                  <h4>Trần Thị B</h4>
                  <p className="member-role">Founder</p>
                  <img
                    src="https://p16-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/b785f99ba39cb08030591a9aeb0868bc~c5_720x720.jpeg"
                    alt="Founder"
                    className="member-avatar-vertical"
                  />
                  <div className="contact-info">
                    <p>Email: founder@example.com</p>
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
              <strong>FPT UNIVERSITY</strong>
            </p>
            <p className="contact-info">
              <strong>TON THAT HOANG MINH</strong> minhtth5@fpt.edu.vn
            </p>
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
