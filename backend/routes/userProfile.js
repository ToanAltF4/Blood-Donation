const express = require('express');
const router = express.Router();
const sql = require('../config/db');


// 👉 API cập nhật thông tin người dùng
router.put('/update', async (req, res) => {
  const {
    email,
    full_name,
    phone,
    cccd,
    location,
    blood,
    date_of_birth,
    family_contact,
  } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email là bắt buộc để xác định người dùng.' });
  }

  try {
    // 👉 Chuyển định dạng ngày sinh về giờ Việt Nam (UTC+7) trước khi lưu
    const dateForDB = date_of_birth;
    if (!dateForDB) {
      return res.status(400).json({ message: 'Ngày sinh không hợp lệ.' });
    }

    const [result] = await sql.execute(
      `UPDATE User
       SET Full_Name = ?, Phone = ?, CCCD = ?, Location = ?, Blood = ?, Date_of_birth = ?, Family_contact = ?
       WHERE Email = ?`,
      [full_name, phone, cccd, location, blood, dateForDB, family_contact, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng với email đã cung cấp.' });
    }

    const [rows] = await sql.execute(
  `SELECT User_ID, Full_Name, Email, Phone, CCCD, Location, Blood,
          DATE_FORMAT(Date_of_birth, '%Y-%m-%d') AS Date_of_birth,
          Family_contact, Role
   FROM User
   WHERE Email = ?`,
  [email]
);
    const updatedUser = rows[0];

    if (!updatedUser) {
      return res.status(404).json({ message: 'Lỗi khi lấy lại thông tin người dùng sau cập nhật.' });
    }

    return res.status(200).json({
      message: 'Cập nhật thành công.',
      user: {
        user_id: updatedUser.User_ID,
        full_name: updatedUser.Full_Name,
        email: updatedUser.Email,
        phone: updatedUser.Phone,
        cccd: updatedUser.CCCD,
        location: updatedUser.Location,
        blood: updatedUser.Blood,
        date_of_birth: updatedUser.Date_of_birth, // chỉ ngày
        family_contact: updatedUser.Family_contact,
        role: updatedUser.Role
      }
    });
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật thông tin người dùng:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
});

module.exports = router;
