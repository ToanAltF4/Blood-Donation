require('dotenv').config();
const keys = require('./keys');

module.exports = {
  secret: keys.jwtSecret,
  expiresIn: keys.jwtExpiresIn
};
