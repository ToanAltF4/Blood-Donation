const mysql = require('mysql2/promise');
require('dotenv').config();
// Tạo kết nối đến cơ sở dữ liệu MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,      // tối đa 10 kết nối cùng lúc
  queueLimit: 0             // không giới hạn hàng đợi
});

module.exports = pool;
