const sql = require('../config/db');

// Đăng ký sẵn sàng hiến máu
exports.registerReadyToDonate = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Thiếu thông tin vị trí.' });
    }

    // Cập nhật vị trí cho user
    await sql.query(
      'UPDATE User SET Latitude = ?, Longitude = ? WHERE User_ID = ?',
      [latitude, longitude, userId]
    );

    // Kiểm tra xem đã có trong ListPrepare chưa
    const [existing] = await sql.query(
      'SELECT * FROM ListPrepare WHERE User_ID = ?',
      [userId]
    );

    if (existing.length === 0) {
      // Thêm vào ListPrepare
      await sql.query(
        'INSERT INTO ListPrepare (User_ID) VALUES (?)',
        [userId]
      );
    }

    return res.status(200).json({ message: 'Đăng ký sẵn sàng hiến máu thành công.' });
  } catch (error) {
    console.error('Lỗi đăng ký sẵn sàng hiến máu:', error);
    return res.status(500).json({ message: 'Lỗi server.' });
  }
}; 