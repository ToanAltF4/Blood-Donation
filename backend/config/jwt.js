require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d' // Token hết hạn sau 7 ngày
};

require('dotenv').config();
const keys = require('./keys');

module.exports = {
  secret: keys.jwtSecret,
  expiresIn: keys.jwtExpiresIn
};
