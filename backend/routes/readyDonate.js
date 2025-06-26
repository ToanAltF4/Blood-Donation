const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticate');
const readyDonateController = require('../controllers/readyDonateController');

// Route cho member đăng ký sẵn sàng hiến máu
router.post('/register', authenticateToken, readyDonateController.registerReadyToDonate);

module.exports = router; 