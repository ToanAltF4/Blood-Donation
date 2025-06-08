import React, { useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2"; // Thêm import này
import axios from "axios";

function ControllNews() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const HOST = process.env.REACT_APP_HOST;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")); // Lưu thông tin người dùng vào localStorage
    if (!user || !user.role) {
      navigate("/");
      return;
    }
    if (user.role != "Admin" && user.role != "Staff") {
      navigate("/");
    }
    fetchNews();
  }, []);

  const openModal = (mode, post = null) => {
    setModalMode(mode);
    setEditingPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
  };

  const handleSave = async () => {
    if (!editingPost?.Post_Header || !editingPost?.Post_Content) {
      Swal.fire(
        "Thiếu thông tin!",
        "Vui lòng điền đầy đủ các trường!",
        "warning"
      );
      return;
    }

    try {
      if (modalMode === "add") {
        const res = await axios.post(
          HOST + "/api/news/createnews",
          {
            Post_Header: editingPost.Post_Header,
            Post_Content: editingPost.Post_Content,
            Post_Img: editingPost.Post_Img || "",
            User_ID: 1, // Hoặc từ user session
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire("Thành công!", "Bài đăng đã được thêm.", "success");
      } else {
        const res = await axios.post(
          HOST + `/api/news/updatenews`,
          {
            id: editingPost.Post_ID,
            Post_Header: editingPost.Post_Header,
            Post_Content: editingPost.Post_Content,
            Post_Img: editingPost.Post_Img || "",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        Swal.fire("Thành công!", "Bài đăng đã được cập nhật.", "success");
      }

      // Reload danh sách bài viết sau khi thao tác
      fetchNews(); // Hàm dùng fetch lại danh sách từ API
      closeModal();
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      Swal.fire("Lỗi", "Không thể xử lý bài viết!", "error");
    }
  };

  const handleDelete = (id) => {
    const postToDelete = posts.find((p) => p.Post_ID === id);
    Swal.fire({
      title: "Xác nhận xoá?",
      text: `Bạn có chắc muốn xoá bài đăng "${postToDelete?.Post_Header}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(HOST + `/api/news/deletenews/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire("Đã xoá!", "Bài đăng đã được xoá.", "success");
          fetchNews(); // Load lại dữ liệu
        } catch (error) {
          console.error("Lỗi xoá:", error);
          Swal.fire("Lỗi", "Không thể xoá bài viết", "error");
        }
      }
    });
  };
  const fetchNews = async () => {
    try {
      const res = await axios.get(HOST + "/api/news/getnews");
      if (Array.isArray(res.data.posts)) {
        console.log(res.data);
        setPosts(res.data.posts);
      } else {
        setPosts([]);
        console.error("Dữ liệu không hợp lệ:", res.data);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách:", err);
      setPosts([]);
    }
  };

  const filteredPosts = posts.filter((post) =>
    (post.Post_Header || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / rowsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Quản Lý Bài Đăng</h2>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Tìm kiếm bài viết..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => openModal("add")} variant="primary">
          + Thêm mới bài đăng
        </Button>
      </div>

      <div className="d-flex justify-content-end mb-2">
        <span className="me-2">Rows per page:</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="form-select w-auto"
        >
          <option>10</option>
          <option>20</option>
          <option>50</option>
        </select>
      </div>

      <table className="table table-bordered table-striped text-center">
        <thead className="table-dark">
          <tr>
            <th>ID_post</th>
            <th>Post_Header</th>
            <th style={{ width: "300px" }}>Content</th>
            <th>Time</th>
            <th style={{ width: "120px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPosts.map((post) => (
            <tr key={post.Post_ID}>
              <td>{post.Post_ID}</td>
              <td>
                <strong>{post.Post_Header}</strong>
              </td>
              <td
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "300px",
                }}
              >
                {post.Post_Content}
              </td>
              <td>
                {new Date(post.Post_Time).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => openModal("edit", post)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(post.Post_ID)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          {paginatedPosts.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                Không tìm thấy bài viết
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          Trang {currentPage}/{totalPages}
        </div>
        <div>
          <Button
            variant="secondary"
            size="sm"
            className="me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt;
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt;
          </Button>
        </div>
      </div>

      {/* Modal Thêm/Sửa */}
      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        className="w-100 vh-100"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(1px)",
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add" ? "Thêm mới bài đăng" : "Chỉnh sửa bài đăng"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control
                type="text"
                value={editingPost?.Post_Header || ""}
                onChange={(e) =>
                  setEditingPost({
                    ...editingPost,
                    Post_Header: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={editingPost?.Post_Content || ""}
                onChange={(e) =>
                  setEditingPost({
                    ...editingPost,
                    Post_Content: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Link ảnh</Form.Label>
              <Form.Control
                type="text"
                placeholder="https://example.com/image.jpg"
                value={editingPost?.Post_Img || ""}
                onChange={(e) =>
                  setEditingPost({
                    ...editingPost,
                    Post_Img: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ControllNews;
