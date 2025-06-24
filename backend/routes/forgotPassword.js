const express = require('express');
const router = express.Router();
const sql = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const otpStore = {}; // Lưu trữ OTP tạm thời trong bộ nhớ 

//  Tạo transporter gửi mail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true nếu dùng port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

//  định dạng email
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//  1. Gửi mã OTP dưới dạng JWT qua email
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Vui lòng nhập email.' });
  if (!validateEmail(email)) return res.status(400).json({ message: `Sai định dạng email.` });

  try {
    const [users] = await sql.execute('SELECT * FROM User WHERE Email = ?', [email]);
    if (users.length === 0)
      return res.status(404).json({ message: 'Email không tồn tại.' });

    // Tạo OTP: 6 chữ số ngẫu nhiên
const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Ví dụ: "483920"
const expiresAt = Date.now() + 60 * 1000; // otp 1 phút

otpStore[email] = {otp: otpCode, expiresAt}; // Lưu OTP và thời gian hết hạn vào bộ nhớ tạm

// Gửi email chứa OTP
await transporter.sendMail({
  from: `"Blood Donation System" <${process.env.SMTP_USER}>`,
  to: email,
  subject: 'Mã OTP khôi phục mật khẩu',
 
  html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 24px;">
        <h2 style="color: #3D6889; margin: 0;">Blood Donation</h2>
        <p style="margin-top: 24px; font-size: 16px; color: #4B004B;">Xin chào,</p>
        <p style="font-size: 16px; color: #4B004B;">Mã xác minh tài khoản của bạn là:</p>
        <h2 style="font-size: 32px; font-weight: bold; color: #3D6889; letter-spacing: 8px; margin: 24px 0 8px 0;">
          ${otpCode}
        </h2>
        <p style="font-size: 16px; color: #555; margin: 0;">Mã OTP có hiệu lực trong 1 phút.</p>
      </div>
    `,

});

// Trả về OTP để client lưu vào tạm localStorage 
res.status(200).json({
  message: 'OTP đã được gửi về email.',
  otp: otpCode, // gửi về để client lưu vào localStorage (reset-otp-token)
  expiresAt, // thời gian hết hạn otp
});


  } catch (err) {
    console.error('Lỗi gửi email OTP:', err);
    return res.status(500).json({ message: 'Không thể gửi OTP.' });
  }
});

// 2. Xác thực OTP 
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, enteredOtp } = req.body;

    // Kiểm tra đầu vào
    if (!email || !enteredOtp) {
      return res.status(400).json({ message: 'Thiếu thông tin xác thực OTP.' });
    }
    
    // lấy thong tin OTP từ store theo mail
    const otpData = otpStore[email]
    if (!otpData) {
      return res.status(400).json({ message: 'Không tìm thấy mã OTP.' });
    }

    // (Tùy chọn) Kiểm tra hết hạn
    if ( Date.now() > otpData.expiresAt) {
      return res.status(400).json({ message: 'Mã OTP đã hết hạn.' });
    }

       //  So sánh mã OTP
    if (enteredOtp !== otpData.otp) {
      return res.status(400).json({ message: 'Mã OTP không đúng.' });
    }

    delete otpStore[email]; // Xóa OTP đã sử dụng

    //  Thành công
    return res.status(200).json({ message: 'Xác minh OTP thành công. Cho phép đặt lại mật khẩu.', email });

  } catch (error) {
    console.error('Lỗi xác minh OTP:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ khi xác minh OTP.' });
  }
});



// 3. Đặt lại mật khẩu
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
