const sql = require('../config/db');

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await sql.query('SELECT User_ID,Full_Name,Email,Role FROM User');
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    return res.status(500).json({ message: 'Lỗi server.' });
  }
}
exports.changeUserRole = async (req, res) => {
  const { email, newRole } = req.body;
  if (!email || !newRole) {
    return res.status(400).json({ message: 'Thiếu thông tin người dùng hoặc vai trò mới.' });
  }

  try {
    const [result] = await sql.query('UPDATE User SET Role = ? WHERE Email = ?', [newRole, email]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại.' });
    }
    return res.status(200).json({ message: 'Cập nhật vai trò thành công.' });
  } catch (error) {
    console.error('Lỗi cập nhật vai trò người dùng:', error);
    return res.status(500).json({ message: 'Lỗi server.' });
  }
}
