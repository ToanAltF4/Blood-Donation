const sql = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt'); // chứa secret và expiresIn

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc.' });
    }

    const [rows] = await sql.query(
      'SELECT * FROM User WHERE Email = ? OR Phone = ?',
      [username, username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email không tồn tại.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.Password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu không đúng.' });
    }

    // Tạo JWT Token
    const token = jwt.sign(
      {
        user_id: user.User_ID,
        email: user.Email,
        role: user.Role
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return res.status(200).json({
      message: 'Đăng nhập thành công.',
      token,
      role: user.Role, // ← quan trọng cho phía frontend
      user: {
        user_id: user.User_ID,
        full_name: user.Full_Name,
        cccd: user.CCCD,
        phone: user.Phone,
        email: user.Email,
        location: user.Location,
        role: user.Role,
        blood: user.Blood,
        date_of_birth: user.Date_of_birth,
        family_contact: user.Family_contact
      }
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return res.status(500).json({ message: 'Lỗi server.' });
  }
};

exports.register = async (req, res) => {
  try {
    const { full_name, cccd, phone, email, password, location, role, blood, date_of_birth, family_contact } = req.body;

    if (!full_name || !cccd || !phone || !email || !password || !location) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc.' });
    }

    const [existing] = await sql.query(
      'SELECT * FROM User WHERE Email = ? OR Phone = ? OR CCCD = ?',
      [email, phone, cccd]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email, số điện thoại hoặc CCCD đã tồn tại.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await sql.query(
      `INSERT INTO User (Full_Name, CCCD, Phone, Email, Password, Location, Role, Blood, Date_of_birth, Family_contact)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        cccd,
        phone,
        email,
        hashedPassword,
        location,
        role || 'Member',
        blood || null,
        date_of_birth || null,
        family_contact || null
      ]
    );

    // Lấy user_id vừa insert
    const user_id = result.insertId;

    // Tạo token JWT sau khi đăng ký thành công
    const token = jwt.sign(
      {
        user_id,
        email,
        role: role || 'Member'
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.status(201).json({
      message: 'Đăng ký thành công.',
      token,
      user: {
        user_id,
        full_name,
        cccd,
        phone,
        email,
        location,
        role: role || 'Member',
        blood: blood || null,
        date_of_birth: date_of_birth || null,
        family_contact: family_contact || null
      }
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server.' });
  }
};
