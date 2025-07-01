const sql = require('../config/db');
const mailer = require('../utils/mailer');

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

// Lấy danh sách người sẵn sàng hiến máu (cho Staff)
exports.getReadyDonors = async (req, res) => {
  try {
    const [rows] = await sql.query(`
      SELECT 
        lp.ListPrepare_ID,
        lp.User_ID,
        u.Full_Name,
        u.Phone,
        u.Email,
        u.Blood,
        u.Latitude,
        u.Longitude
      FROM ListPrepare lp
      JOIN User u ON lp.User_ID = u.User_ID
      ORDER BY lp.ListPrepare_ID DESC
    `);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi lấy danh sách người sẵn sàng hiến máu:', error);
    return res.status(500).json({ message: 'Lỗi server.' });
  }
};

// Gửi thông báo khẩn cấp tới danh sách user_id
exports.sendEmergencyRequest = async (req, res) => {
  try {
    const { user_ids, center_lat, center_lng, time_option } = req.body;
    if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      return res.status(400).json({ message: 'Danh sách người nhận trống.' });
    }
    // Lấy thông tin email của các user
    const [users] = await sql.query(
      `SELECT Email, Full_Name FROM User WHERE User_ID IN (${user_ids.map(() => '?').join(',')})`,
      user_ids
    );
    const timeMap = { '2': '2 tiếng', '4': '4 tiếng', '8': '8 tiếng' };
    let count = 0;
    for (const user of users) {
      if (!user.Email) continue;
      await mailer.sendEmergencyBloodRequestMail(user.Email, user.Full_Name || '', time_option);
      count++;
    }
    return res.status(200).json({ message: `Đã gửi thông báo đến ${count} người có email.` });
  } catch (error) {
    console.error('Lỗi gửi thông báo khẩn cấp:', error);
    return res.status(500).json({ message: 'Lỗi server khi gửi thông báo.' });
  }
}; 