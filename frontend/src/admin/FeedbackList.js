import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HOST = process.env.REACT_APP_HOST;

function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra quyền admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'Admin') {
      navigate('/');
      return;
    }
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${HOST}/api/admin/feedback`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeedbacks(res.data);
      } catch (err) {
        setError("Không thể tải danh sách góp ý!");
      }
      setLoading(false);
    };
    fetchFeedbacks();
  }, [navigate]);

  // Hàm cắt ngắn nội dung
  const truncate = (str, n) => str.length > n ? str.slice(0, n) + '...' : str;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Danh sách góp ý của người dùng</h2>
      {loading ? (
        <div className="text-center">Đang tải...</div>
      ) : error ? (
        <div className="text-danger text-center">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <colgroup>
              <col style={{ width: '180px' }} />
              <col style={{ width: '140px' }} />
              <col style={{ width: '220px' }} />
              <col style={{ width: '340px' }} />
            </colgroup>
            <thead className="table-light">
              <tr>
                <th>Họ Tên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Nội dung đóng góp</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.length === 0 ? (
                <tr><td colSpan={4} className="text-center">Chưa có góp ý nào.</td></tr>
              ) : feedbacks.map((fb, idx) => (
                <tr key={fb.Email + fb.Feedback_Content}>
                  <td style={{ maxWidth: 180, wordBreak: 'break-word' }}>{fb.Full_Name}</td>
                  <td style={{ maxWidth: 140, wordBreak: 'break-word' }}>{fb.Phone}</td>
                  <td style={{ maxWidth: 220, wordBreak: 'break-word' }}>{fb.Email}</td>
                  <td style={{ maxWidth: 340, wordBreak: 'break-word', padding: '8px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{
                        display: expandedIndex === idx ? 'inline' : '-webkit-box',
                        WebkitLineClamp: expandedIndex === idx ? 'unset' : 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: expandedIndex === idx ? 'visible' : 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: expandedIndex === idx ? 'pre-line' : 'normal',
                        flex: 1
                      }}>
                        {fb.Feedback_Content}
                      </span>
                      {fb.Feedback_Content.length > 60 && (
                        <span
                          style={{ color: '#007bff', cursor: 'pointer', marginLeft: 8, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}
                          onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                        >
                          {expandedIndex === idx ? 'Ẩn bớt' : 'Xem thêm'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FeedbackList; 