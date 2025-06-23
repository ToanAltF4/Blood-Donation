const express = require('express');
const router = express.Router();
const sql = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// 🔒 Tạo transporter gửi mail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true nếu dùng port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ 1. Gửi mã OTP dưới dạng JWT qua email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Vui lòng nhập email.' });

  try {
    const [users] = await sql.execute('SELECT * FROM User WHERE Email = ?', [email]);
    if (users.length === 0)
      return res.status(404).json({ message: 'Email không tồn tại.' });

    // // 👉 Tạo OTP là JWT token chứa email, hết hạn sau 5 phút
    // const otpToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });

    // // 👉 Gửi email với mã token làm OTP
    // await transporter.sendMail({
    //   from: `"Blood Donation System" <${process.env.SMTP_USER}>`,
    //   to: email,
    //   subject: 'Mã OTP khôi phục mật khẩu',
    //   html: `<p>Mã OTP của bạn là:</p><b>${otpToken}</b><br/><small>Hiệu lực trong 5 phút.</small>`,
    // });

    // return res.status(200).json({ message: 'Đã gửi OTP (JWT) về email.' });

    // 👉 Tạo OTP: 6 chữ số ngẫu nhiên
const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Ví dụ: "483920"

// 👉 Gửi email chứa OTP
await transporter.sendMail({
  from: `"Blood Donation System" <${process.env.SMTP_USER}>`,
  to: email,
  subject: 'Mã OTP khôi phục mật khẩu',
  html: `<p>Mã OTP của bạn là:</p><h2>${otpCode}</h2><p>Hiệu lực trong 5 phút.</p>`,
});

// 👉 Trả về OTP để client lưu vào localStorage (tạm, như bạn đang làm)
res.status(200).json({
  message: 'OTP đã được gửi về email.',
  otp: otpCode, // gửi về để client lưu vào localStorage (reset-otp-token)
});


  } catch (err) {
    console.error('❌ Lỗi gửi email OTP:', err);
    return res.status(500).json({ message: 'Không thể gửi OTP.' });
  }
});

// ✅ 2. Xác thực OTP (token JWT)
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, enteredOtp, otpStored, expiresAt } = req.body;

    // 👉 Kiểm tra đầu vào
    if (!email || !enteredOtp || !otpStored) {
      return res.status(400).json({ message: 'Thiếu thông tin xác thực OTP.' });
    }

    // 👉 So sánh mã OTP
    if (enteredOtp !== otpStored) {
      return res.status(400).json({ message: 'Mã OTP không đúng.' });
    }

    // 👉 (Tùy chọn) Kiểm tra hết hạn
    if (expiresAt && Date.now() > Number(expiresAt)) {
      return res.status(400).json({ message: 'Mã OTP đã hết hạn.' });
    }

    // ✅ Thành công
    return res.status(200).json({ message: 'Xác minh OTP thành công. Cho phép đặt lại mật khẩu.', email });

  } catch (error) {
    console.error('Lỗi xác minh OTP:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ khi xác minh OTP.' });
  }
});



// ✅ 3. Đặt lại mật khẩu
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Thiếu thông tin email hoặc mật khẩu mới.' });
  }

  try {
    // Mã hóa mật khẩu mới
    const hashed = await bcrypt.hash(newPassword, 10);

    // Cập nhật vào database
    const [result] = await sql.execute(
      'UPDATE User SET Password = ? WHERE Email = ?',
      [hashed, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này.' });
    }

    return res.status(200).json({ message: 'Đặt lại mật khẩu thành công.' });
  } catch (err) {
    console.error('Lỗi reset mật khẩu:', err);
    return res.status(500).json({ message: 'Lỗi máy chủ khi đặt lại mật khẩu.' });
  }
});


module.exports = router;
