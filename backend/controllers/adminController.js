const sql = require("../config/db");

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await sql.query(
      "SELECT User_ID,Full_Name,Email,Role FROM User"
    );
    return res.status(200).json(rows);
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};
exports.changeUserRole = async (req, res) => {
  const { email, newRole } = req.body;
  if (!email || !newRole) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin người dùng hoặc vai trò mới." });
  }

  try {
    const [result] = await sql.query(
      "UPDATE User SET Role = ? WHERE Email = ?",
      [newRole, email]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }
    return res.status(200).json({ message: "Cập nhật vai trò thành công." });
  } catch (error) {
    console.error("Lỗi cập nhật vai trò người dùng:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};
exports.getAllEvents = async (req, res) => {
  try {
    // Lấy thông tin sự kiện và người đăng ký
    const [rows] = await sql.query(`
      SELECT 
        e.Event_ID,
        e.Name_Event,
        e.Content,
        e.Location,
        e.Time_Start,
        e.Time_End,
        e.Status,
        e.Count_Reg,
        u.Full_Name
      FROM Event e
      LEFT JOIN List_Reg lr ON e.Event_ID = lr.Event_ID
      LEFT JOIN User u ON lr.User_ID = u.User_ID
      ORDER BY e.Event_ID;
    `);

    // Gom nhóm theo Event_ID
    const eventsMap = {};

    for (const row of rows) {
      const eventId = row.Event_ID;

      if (!eventsMap[eventId]) {
        eventsMap[eventId] = {
          Event_ID: row.Event_ID,
          Event_Name: row.Name_Event,
          Content: row.Content,
          Location: row.Location,
          Time_Start: row.Time_Start,
          Time_End: row.Time_End,
          Status: row.Status,
          Count_Reg: row.Count_Reg,
          Registrants: [],
        };
      }

      if (row.Full_Name) {
        eventsMap[eventId].Registrants.push(row.Full_Name);
      }
    }

    const finalResult = Object.values(eventsMap);

    return res.status(200).json(finalResult);
  } catch (error) {
    console.error("Lỗi lấy danh sách sự kiện kèm người đăng ký:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

exports.addEvent = async (req, res) => {
  const {
    Name_Event,
    Content,
    Location,
    Time_Start,
    Time_End,
    Status,
    User_ID, // người tạo sự kiện
  } = req.body;

  // Kiểm tra đầu vào
  if (
    !Name_Event ||
    !Content ||
    !Location ||
    !Time_Start ||
    !Time_End ||
    !Status ||
    !User_ID
  ) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin sự kiện hoặc người tạo." });
  }

  try {
    const [result] = await sql.query(
      `INSERT INTO Event (User_ID, Name_Event, Content, Location, Time_Start, Time_End, Status, Count_Reg)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [User_ID, Name_Event, Content, Location, Time_Start, Time_End, Status, 0]
    );

    return res.status(201).json({
      message: "Thêm sự kiện thành công.",
      Event_ID: result.insertId,
    });
  } catch (error) {
    console.error("Lỗi thêm sự kiện:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

exports.changeEvent = async (req, res) => {
  const { Event_ID, Name_Event, Content, Location, Time_Start, Time_End, Status } =
    req.body;

  // Kiểm tra thiếu trường
  if (
    !Name_Event ||
    !Content ||
    !Location ||
    !Time_Start ||
    !Time_End ||
    !Status
  ) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin để cập nhật sự kiện." });
  }

  try {
    const [result] = await sql.query(
      `UPDATE Event
       SET Name_Event = ?, Content = ?, Location = ?, Time_Start = ?, Time_End = ?, Status = ?
       WHERE Event_ID = ?`,
      [Name_Event, Content, Location, Time_Start, Time_End, Status, Event_ID]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sự kiện để cập nhật." });
    }

    return res.status(200).json({ message: "Cập nhật sự kiện thành công." });
  } catch (error) {
    console.error("Lỗi cập nhật sự kiện:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};

exports.deleteEvent = async (req, res) => {
  const { Event_ID } = req.body;
  try {
    const [result] = await sql.query("DELETE FROM Event WHERE Event_ID = ?", [
      Event_ID,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sự kiện để xóa." });
    }

    return res.status(200).json({ message: "Xóa sự kiện thành công." });
  } catch (error) {
    console.error("Lỗi xóa sự kiện:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};
exports.getAllUnitOfBlood = async (req, res) => {
  try {
    const [rows] = await sql.query(`
      SELECT 
  uob.*, 
  usr.Full_Name, 
  usr.Phone,
  e.Name_Event AS Event_Name
FROM Unit_of_Blood uob
JOIN User usr ON uob.User_ID = usr.User_ID
JOIN Event e ON uob.Event_ID = e.Event_ID;

    `);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn vị máu:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
};
