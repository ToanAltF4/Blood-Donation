const sql = require('../config/db');

exports.registerEvent = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { Event_ID } = req.body;
    if (!Event_ID) return res.status(400).json({ message: 'Thiếu Event_ID.' });
    // Kiểm tra đã đăng ký chưa
    const [exist] = await sql.query('SELECT * FROM List_Reg WHERE User_ID = ? AND Event_ID = ?', [userId, Event_ID]);
    if (exist.length > 0) return res.status(409).json({ message: 'Bạn đã đăng ký sự kiện này.' });
    // Đăng ký mới
    await sql.query('INSERT INTO List_Reg (User_ID, Event_ID, Status) VALUES (?, ?, ?)', [userId, Event_ID, 'pending']);
    return res.status(201).json({ message: 'Đăng ký thành công.' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server.' });
  }
};

exports.getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const [rows] = await sql.query(`
      SELECT lr.List_ID, lr.Status, e.Event_ID, e.Name_Event AS Event_Name, e.Location, e.Time_Start, e.Time_End
      FROM List_Reg lr
      JOIN Event e ON lr.Event_ID = e.Event_ID
      WHERE lr.User_ID = ?
      ORDER BY e.Time_Start DESC
    `, [userId]);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server.' });
  }
};

exports.getMyDonationHistory = async (req, res) => {
  try {
    const userId = req.user.user_id;
    // Chỉ lấy các lần đã được staff duyệt (status = 'approved') và đã có đơn vị máu
    const [rows] = await sql.query(`
      SELECT uob.*, e.Name_Event AS Event_Name
      FROM Unit_of_Blood uob
      JOIN Event e ON uob.Event_ID = e.Event_ID
      JOIN List_Reg lr ON lr.User_ID = uob.User_ID AND lr.Event_ID = uob.Event_ID
      WHERE uob.User_ID = ? AND lr.Status = 'approved'
      ORDER BY uob.Donate_Time DESC
    `, [userId]);
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server.' });
  }
}; 