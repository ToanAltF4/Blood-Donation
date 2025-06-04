const sql = require('../config/db');

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await sql.query('SELECT * FROM User');
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    return res.status(500).json({ message: 'Lỗi server.' });
  }
}