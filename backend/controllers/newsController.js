const sql = require('../config/db');
exports.getNews = async (req, res) => {
  try {
    const [rows] = await sql.query(
      `SELECT Post_ID,Post_Img, Post_Header,Post_Content, Post_Time, User_ID
       FROM Post
       ORDER BY Post_Time DESC`
    );

    res.status(200).json({
      message: 'Lấy danh sách bài viết thành công.',
      posts: rows
    });
  } catch (error) {
    console.error('Lỗi lấy bài viết:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách bài viết.' });
  }
};

exports.getNewsByID = async (req, res) => {
  try {
    const [rows] = await sql.query(
      `SELECT Post_ID,Post_Img, Post_Header,Post_Content, Post_Time, User_ID
       FROM Post WHERE Post_ID = ?
       ORDER BY Post_Time DESC`,
      [req.params.id]
    );

    res.status(200).json({
      message: 'Lấy danh sách bài viết thành công.',
      posts: rows
    });
  } catch (error) {
    console.error('Lỗi lấy bài viết:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách bài viết.' });
  }
};

exports.createNews = async (req, res) => {
  const { Post_Header, Post_Content, Post_Img, User_ID } = req.body;

  if (!Post_Header || !Post_Content || !User_ID) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
  }

  const query = `
    INSERT INTO Post (Post_Header, Post_Content, Post_Img, Post_Time, User_ID)
    VALUES (?, ?, ?, NOW(), ?)
  `;

  try {
    const [result] = await sql.execute(query, [
      Post_Header,
      Post_Content,
      Post_Img || null,
      User_ID,
    ]);

    res.status(201).json({ message: "Tạo bài đăng thành công.", Post_ID: result.insertId });
  } catch (error) {
    console.error("Lỗi khi tạo bài đăng:", error);
    res.status(500).json({ message: "Lỗi server khi tạo bài đăng." });
  }
};

// Cập nhật bài đăng
exports.updateNews = async (req, res) => {
  const {id, Post_Header, Post_Content, Post_Img } = req.body;

  if (!Post_Header || !Post_Content) {
    return res.status(400).json({ message: "Thiếu tiêu đề hoặc nội dung." });
  }

  const query = `
    UPDATE Post
    SET Post_Header = ?, Post_Content = ?, Post_Img = ?
    WHERE Post_ID = ?
  `;

  try {
    const [result] = await sql.execute(query, [
      Post_Header,
      Post_Content,
      Post_Img || null,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài viết." });
    }

    res.json({ message: "Cập nhật bài viết thành công." });
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật." });
  }
};

// Xóa bài đăng
exports.deleteNews = async (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM Post WHERE Post_ID = ?`;

  try {
    const [result] = await sql.execute(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài viết để xoá." });
    }

    res.json({ message: "Xoá bài viết thành công." });
  } catch (error) {
    console.error("Lỗi khi xoá bài viết:", error);
    res.status(500).json({ message: "Lỗi server khi xoá." });
  }
};