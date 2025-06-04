require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d' // Token hết hạn sau 7 ngày
};
