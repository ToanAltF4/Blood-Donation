const express = require('express');
const router = express.Router();
const sql = require('../config/db');

// Cập nhật thông tin người dùng
router.put('/update', async (req, res) => {
  const {
    email,
    full_name,
    phone,
    cccd,
    location,
    blood
  } = req.body;

  console.log("Dữ liệu nhận được từ frontend:", req.body);

  if (!email) {
    return res.status(400).json({ message: 'Email là bắt buộc để xác định người dùng.' });
  }

  try {
    const [result] = await sql.execute(
      `UPDATE User
       SET Full_Name = ?, Phone = ?, CCCD = ?, Location = ?, Blood = ?
       WHERE Email = ?`,
      [full_name, phone, cccd, location, blood, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng với email đã cung cấp.' });
    }

    // 🔁 Truy vấn lại thông tin user vừa cập nhật
    const [rows] = await sql.execute(`SELECT * FROM User WHERE Email = ?`, [email]);
    const updatedUser = rows[0];

    return res.status(200).json({ message: 'Cập nhật thành công.', user: {
        full_name: updatedUser.Full_Name,
        email: updatedUser.Email,
        phone: updatedUser.Phone,
        cccd: updatedUser.CCCD,
        location: updatedUser.Location,
        blood: updatedUser.Blood,
        user_id: updatedUser.User_ID,
        role: updatedUser.Role,
        family_contact: updatedUser.Family_Contact,
        date_of_birth: updatedUser.Date_of_birth
    } });
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
});

module.exports = router;
