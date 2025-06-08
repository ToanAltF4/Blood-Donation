import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
    const HOST = process.env.REACT_APP_HOST;
  useEffect(() => {
    axios
      .get(HOST+"/api/news/getnewsbyid/" + id)
      .then((res) => {
        const found = res.data.posts.find(
          (p) => p.Post_ID.toString() === id.toString()
        );
        setPost(found || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu bài viết:", err);
        setLoading(false);
      });
  }, [id]);

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

  if (loading) return <div className="container py-5">Đang tải bài viết...</div>;

  if (!post) {
    return (
      <div className="container py-5 text-center">
        <h4>Bài viết không tồn tại hoặc đã bị xoá.</h4>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        ← Quay lại danh sách
      </button>
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title">{post.Post_Header}</h3>
          <p className="text-muted mb-3">{formatDate(post.Post_Time)}</p>
          <img
          src={post.Post_Img || "https://via.placeholder.com/800x400"}
          alt={post.Post_Header}
          className="card-img-top"
          style={{ objectFit: "cover" }}
        />
          <p className="text-muted mb-3 text-center my-2">Hình ảnh của {post.Post_Header}</p>

        <br></br>
        <br></br>
          <h3 className="card-title">Nội dung</h3>

          <p style={{ whiteSpace: "pre-line" }}>{post.Post_Content}</p>
        </div>
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        ← Quay lại danh sách
      </button>
      </div>
    </div>
  );
}

export default NewsDetail;
