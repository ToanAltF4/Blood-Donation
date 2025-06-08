import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function News() {
  const [allPosts, setAllPosts] = useState([]);
  const [displayedPosts, setDisplayedPosts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();


  const HOST = process.env.REACT_APP_HOST;

  useEffect(() => {
    axios
      .get(HOST + "/api/news/getnews")
      .then((res) => {
        if (Array.isArray(res.data.posts)) {
          // Sort bài mới nhất lên đầu
          const sorted = res.data.posts.sort(
            (a, b) => new Date(b.Post_Time) - new Date(a.Post_Time)
          );
          setAllPosts(sorted);
          setDisplayedPosts(sorted.slice(0, 10));
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải bài viết:", err);
      });
  }, []);

  const handleLoadMore = () => {
    const next = visibleCount + 10;
    setDisplayedPosts(allPosts.slice(0, next));
    setVisibleCount(next);
  };

  const formatDate = (isoTime) => {
    const date = new Date(isoTime);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (displayedPosts.length === 0)
    return <div className="container py-5">Đang tải bài viết...</div>;

  const latestPost = displayedPosts[0];
  const otherPosts = displayedPosts.slice(1);

  return (
    <div className="container py-5">
      <div className="row mb-4">
        {/* Bài viết lớn nhất */}
        <div className="col-12" >
          <div className="card shadow-lg mb-4" >
            <img
              src={latestPost.Post_Img || "https://via.placeholder.com/800x400"}
              className="card-img-top"
              style={{ height: "400px", objectFit: "cover",cursor: "pointer", }}
              onClick={() => navigate(`/news/${latestPost.Post_ID}`)}

              alt={latestPost.Post_Header}
            />
            <div className="card-body">
              <h4 className="card-title">{latestPost.Post_Header}</h4>
              <p className="card-text text-muted">
                {formatDate(latestPost.Post_Time)}
              </p>
              <p className="card-text">{latestPost.Post_Content}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Các bài nhỏ hơn */}
      <div className="row">
        {otherPosts.map((post) => (
          <div
            key={post.Post_ID}
            className="col-md-4 mb-4"
            onMouseEnter={() => setHoveredCard(post.Post_ID)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div
              className="card h-100"
              style={{
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                transform:
                  hoveredCard === post.Post_ID
                    ? "translateY(-6px)"
                    : "translateY(0)",
                boxShadow:
                  hoveredCard === post.Post_ID
                    ? "0 8px 20px rgba(0, 0, 0, 0.15)"
                    : "none",
              }}
              onClick={() => navigate(`/news/${post.Post_ID}`)}
            >
              <img
                src={post.Post_Img || "https://via.placeholder.com/400x200"}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
                alt={post.Post_Header}
              />
              <div className="card-body">
                <h6 className="card-title">{post.Post_Header}</h6>
                <p className="card-text text-muted mb-1">
                  {formatDate(post.Post_Time)}
                </p>
                <p className="card-text" style={{ fontSize: "14px" }}>
                  {post.Post_Content.slice(0, 100)}...
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nút xem thêm */}
      {visibleCount < allPosts.length && (
        <div className="text-center mt-4">
          <button className="btn btn-outline-primary" onClick={handleLoadMore}>
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
}

export default News;
