const sql = require('../config/db');
exports.getNews = async (req, res) => {
  try {
    const [rows] = await sql.query(
      `SELECT Post_ID,Post_Img, Post_Header, Post_Time, User_ID
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