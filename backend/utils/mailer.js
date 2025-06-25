const nodemailer = require('nodemailer');
require('dotenv').config();

// Tạo transporter gửi mail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true nếu dùng port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Hàm gửi email thông báo máu được sử dụng
const sendBloodUsedNotification = async (donorEmail, donorName, eventName, donationDate, bloodType, volume) => {
  try {
    const mailOptions = {
      from: `"Blood Donation System" <${process.env.SMTP_USER}>`,
      to: donorEmail,
      subject: 'Thông báo: Máu của bạn đã được sử dụng',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #e74c3c; margin: 0; font-size: 28px;">🩸 Blood Donation System</h1>
              <p style="color: #7f8c8d; margin: 10px 0 0 0; font-size: 16px;">Hệ thống quản lý hiến máu</p>
            </div>
            
            <div style="border-left: 4px solid #e74c3c; padding-left: 20px; margin: 20px 0;">
              <h2 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 22px;">Thông báo quan trọng</h2>
              <p style="color: #34495e; margin: 0; font-size: 16px; line-height: 1.6;">
                Xin chào <strong>${donorName}</strong>,
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #2c3e50; margin: 0 0 15px 0; font-size: 16px; line-height: 1.6;">
                Chúng tôi rất vui mừng thông báo rằng <strong>máu của bạn đã được sử dụng</strong> để cứu giúp bệnh nhân cần thiết.
              </p>
              
              <div style="background-color: #e8f5e8; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <h3 style="color: #27ae60; margin: 0 0 10px 0; font-size: 18px;">📋 Thông tin chi tiết:</h3>
                <ul style="color: #2c3e50; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                  <li><strong>Sự kiện hiến máu:</strong> ${eventName}</li>
                  <li><strong>Ngày hiến máu:</strong> ${new Date(donationDate).toLocaleDateString('vi-VN')}</li>
                  <li><strong>Nhóm máu:</strong> ${bloodType}</li>
                  <li><strong>Thể tích:</strong> ${volume} ml</li>
                </ul>
              </div>
            </div>
            
            <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 18px;">💝 Lời cảm ơn</h3>
              <p style="color: #856404; margin: 0; font-size: 16px; line-height: 1.6;">
                Cảm ơn bạn đã tham gia hiến máu tình nguyện. Hành động của bạn đã góp phần cứu sống những bệnh nhân cần thiết. 
                Chúng tôi mong rằng bạn sẽ tiếp tục tham gia các sự kiện hiến máu trong tương lai.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
              <p style="color: #7f8c8d; margin: 0; font-size: 14px;">
                Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.
              </p>
              <p style="color: #7f8c8d; margin: 5px 0 0 0; font-size: 14px;">
                Trân trọng,<br>
                <strong>Đội ngũ Blood Donation System</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email thông báo máu được sử dụng đã gửi thành công:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Lỗi gửi email thông báo máu được sử dụng:', error);
    return { success: false, error: error.message };
  }
};

// Hàm kiểm tra kết nối SMTP
const testSMTPConnection = async () => {
  try {
    await transporter.verify();
    console.log('Kết nối SMTP thành công!');
    return true;
  } catch (error) {
    console.error('Lỗi kết nối SMTP:', error);
    return false;
  }
};

module.exports = {
  transporter,
  sendBloodUsedNotification,
  testSMTPConnection
}; 