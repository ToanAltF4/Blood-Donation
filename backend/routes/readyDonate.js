const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticate');
const authorizeRoles = require('../middlewares/authorize');
const readyDonateController = require('../controllers/readyDonateController');

// Route cho member đăng ký sẵn sàng hiến máu
router.post('/register', authenticateToken, readyDonateController.registerReadyToDonate);

// Route cho Staff lấy danh sách người sẵn sàng hiến máu
router.get('/ready-donors', authenticateToken, authorizeRoles('Staff','Admin'), readyDonateController.getReadyDonors);

// Route cho Staff gửi thông báo khẩn cấp
router.post('/send-emergency', authenticateToken, authorizeRoles('Staff'), readyDonateController.sendEmergencyRequest);
module.exports = router; 