const sql = require('../config/db');

exports.registerEvent = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { Event_ID } = req.body;
    if (!Event_ID) return res.status(400).json({ message: 'Thiếu Event_ID.' });
    // Kiểm tra đã đăng ký chưa
    const [exist] = await sql.query('SELECT * FROM List_Reg WHERE User_ID = ? AND Event_ID = ?', [userId, Event_ID]);
    if (exist.length > 0) return res.status(409).json({ message: 'Bạn đã đăng ký sự kiện này.' });

    // Kiểm tra ngày hiến máu gần nhất
    const [lastDonation] = await sql.query(`
      SELECT Donate_Time FROM Unit_of_Blood
      WHERE User_ID = ?
      ORDER BY Donate_Time DESC
      LIMIT 1
    `, [userId]);
    if (lastDonation.length > 0 && lastDonation[0].Donate_Time) {
      const lastDate = new Date(lastDonation[0].Donate_Time);
      const now = new Date();
      const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
      if (diffDays < 90) {
        return res.status(400).json({
          message: `Thời gian nghỉ ngơi tối thiểu giữa các lần hiến máu là 3 tháng. Bạn đã hiến máu ngày ${lastDate.toLocaleDateString('vi-VN')}. Vui lòng quay lại sau khi đủ thời gian nghỉ ngơi.`
        });
      }
    }

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

exports.getAllEventsForMember = async (req, res) => {
  try {
    const [rows] = await sql.query("SELECT * FROM Event ORDER BY Time_Start DESC");
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server." });
  }
}; 