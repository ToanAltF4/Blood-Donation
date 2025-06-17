const express = require("express");
const router = express.Router();
const sql = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, jwtConfig.secret, (err, user) => {
      if (err) return res.sendStatus(403); // Token không hợp lệ
      req.user = user; // Gắn user vào request
      next();
    });
  } else {
    res.sendStatus(401); // Không có token
  }
}
// 👉 Hàm kiểm tra hợp lệ trước khi update
async function validateUserProfileUpdate({
  email,
  phone,
  cccd,
  date_of_birth,
}) {
  if (!date_of_birth || !/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth)) {
    return { valid: false, message: "Ngày sinh không hợp lệ." };
  }

  // Kiểm tra tuổi
  const birthDate = new Date(date_of_birth);
  const now = new Date();
  const age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();
  const isOver18 = age > 18 || (age === 18 && monthDiff >= 0);

  if (!isOver18) {
    return { valid: false, message: "Người dùng phải từ 18 tuổi trở lên." };
  }

  // Kiểm tra trùng CCCD với người khác
  const [cccdCheck] = await sql.execute(
    "SELECT Email FROM User WHERE CCCD = ? AND Email != ?",
    [cccd, email]
  );
  if (cccdCheck.length > 0) {
    return { valid: false, message: "CCCD đã tồn tại trong hệ thống." };
  }

  // Kiểm tra trùng số điện thoại với người khác
  const [phoneCheck] = await sql.execute(
    "SELECT Email FROM User WHERE Phone = ? AND Email != ?",
    [phone, email]
  );
  if (phoneCheck.length > 0) {
    return {
      valid: false,
      message: "Số điện thoại đã tồn tại trong hệ thống.",
    };
  }

  return { valid: true };
}

// 👉 API cập nhật thông tin người dùng
router.put("/update", async (req, res) => {
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
    return res
      .status(400)
      .json({ message: "Email là bắt buộc để xác định người dùng." });
  }
  const validation = await validateUserProfileUpdate({
    email,
    phone,
    cccd,
    date_of_birth,
  });
  if (!validation.valid) {
    return res.status(400).json({ message: validation.message });
  }
  try {
    // 👉 Chuyển định dạng ngày sinh về giờ Việt Nam (UTC+7) trước khi lưu
    const dateForDB = date_of_birth;
    if (!dateForDB) {
      return res.status(400).json({ message: "Ngày sinh không hợp lệ." });
    }

    const [result] = await sql.execute(
      `UPDATE User
       SET Full_Name = ?, Phone = ?, CCCD = ?, Location = ?, Blood = ?, Date_of_birth = ?, Family_contact = ?
       WHERE Email = ?`,
      [
        full_name,
        phone,
        cccd,
        location,
        blood,
        dateForDB,
        family_contact,
        email,
      ]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng với email đã cung cấp." });
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
      return res
        .status(404)
        .json({
          message: "Lỗi khi lấy lại thông tin người dùng sau cập nhật.",
        });
    }

    return res.status(200).json({
      message: "Cập nhật thành công.",
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
        role: updatedUser.Role,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật thông tin người dùng:", error);
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." });
  }
});
router.put("/change-password", authenticateJWT, async (req, res) => {
  const { current_password, new_password } = req.body;
  const email = req.user.email;

  if (!new_password) {
    return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới." });
  }

  try {
    const [rows] = await sql.execute("SELECT Password FROM User WHERE Email = ?", [email]);
    const user = rows[0];

    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng." });

    // ✅ Nếu chưa có mật khẩu, cho phép tạo luôn
    if (!user.Password) {
      const hashed = await bcrypt.hash(new_password, 10);
      await sql.execute("UPDATE User SET Password = ? WHERE Email = ?", [hashed, email]);
      return res.status(200).json({ message: "Tạo mật khẩu thành công." });
    }

    // ✅ Nếu đã có mật khẩu, yêu cầu nhập mật khẩu cũ để đổi
    if (!current_password) {
      return res.status(400).json({ message: "Vui lòng nhập mật khẩu hiện tại để đổi." });
    }

    const isMatch = await bcrypt.compare(current_password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu hiện tại không đúng." });
    }

    const hashed = await bcrypt.hash(new_password, 10);
    await sql.execute("UPDATE User SET Password = ? WHERE Email = ?", [hashed, email]);

    return res.status(200).json({ message: "Đổi mật khẩu thành công." });
  } catch (err) {
    console.error("❌ Lỗi đổi mật khẩu:", err);
    return res.status(500).json({ message: "Lỗi máy chủ." });
  }
});
router.get("/profile", authenticateJWT, async (req, res) => {
  const email = req.user.email;

  try {
    const [rows] = await sql.execute(
      `SELECT User_ID, Full_Name, Email, Phone, CCCD, Location, Role, Blood,
              DATE_FORMAT(Date_of_birth, '%Y-%m-%d') AS Date_of_birth,
              Family_contact, Password
       FROM User WHERE Email = ?`,
      [email]
    );

    const user = rows[0];
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng." });

    // ✅ Trả về user (ẩn mật khẩu) và thêm flag hasPassword
    const {
      Password,
      ...safeUser
    } = user;

    res.status(200).json({
      user: {
        ...safeUser,
        hasPassword: !!Password // 👈 xác định có mật khẩu hay chưa
      }
    });
  } catch (error) {
    console.error("❌ Lỗi lấy thông tin profile:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
});

module.exports = router;
