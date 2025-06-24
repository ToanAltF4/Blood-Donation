const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticate');
const memberController = require('../controllers/memberController');

// Đăng ký sự kiện hiến máu
router.post('/register-event', authenticateToken, memberController.registerEvent);
// Lấy danh sách sự kiện đã đăng ký
router.get('/my-registrations', authenticateToken, memberController.getMyRegistrations);
// Lấy lịch sử hiến máu
router.get('/my-donation-history', authenticateToken, memberController.getMyDonationHistory);

module.exports = router; 