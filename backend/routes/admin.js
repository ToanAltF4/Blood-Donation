const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/authenticate');
const authorizeRoles = require('../middlewares/authorize');
const { testSMTPConnection } = require('../utils/mailer');

router.get('/getAllUsers',authenticateToken, authorizeRoles('Admin'), adminController.getAllUsers);
router.post('/changeRole', authenticateToken, authorizeRoles('Admin'), adminController.changeUserRole);
router.get('/getAllEvents', authenticateToken, authorizeRoles('Admin','Staff'), adminController.getAllEvents);
router.post('/addEvent', authenticateToken, authorizeRoles('Admin','Staff'), adminController.addEvent);
router.post('/changeEvents' , authenticateToken, authorizeRoles('Admin','Staff'), adminController.changeEvent);
router.post('/deleteEvents', authenticateToken, authorizeRoles('Admin','Staff'), adminController.deleteEvent);
router.get('/getAllBloodBanks', authenticateToken, authorizeRoles('Admin','Staff'), adminController.getAllUnitOfBlood);

// Routes for EventDetail
router.get('/getEventById/:id', authenticateToken, authorizeRoles('Admin','Staff'), adminController.getEventById);
router.get('/getDonorsByEvent/:id', authenticateToken, authorizeRoles('Admin','Staff'), adminController.getDonorsByEvent);
router.post('/updateDonor', authenticateToken, authorizeRoles('Admin','Staff'), adminController.updateDonor);
router.post('/updateBloodUnitStatus', authenticateToken, authorizeRoles('Admin','Staff'), adminController.updateBloodUnitStatus);

// Test kết nối SMTP
router.get('/test-smtp', authenticateToken, authorizeRoles('Admin', 'Staff'), async (req, res) => {
  try {
    const isConnected = await testSMTPConnection();
    if (isConnected) {
      return res.status(200).json({ message: 'Kết nối SMTP thành công!' });
    } else {
      return res.status(500).json({ message: 'Không thể kết nối SMTP. Vui lòng kiểm tra cấu hình.' });
    }
  } catch (error) {
    console.error('Lỗi test SMTP:', error);
    return res.status(500).json({ message: 'Lỗi khi test kết nối SMTP.' });
  }
});

// Lấy danh sách yêu cầu máu khẩn cấp
router.get('/emergency-requests', authenticateToken, authorizeRoles('Staff'), adminController.getEmergencyRequests);
// Cập nhật trạng thái yêu cầu máu khẩn cấp
router.post('/update-emergency-status', authenticateToken, authorizeRoles('Staff'), adminController.updateEmergencyStatus);

// ==== EVENT REPORT CRUD (STAFF + ADMIN) ====
router.get('/event-reports', authenticateToken, authorizeRoles('Admin','Staff'), adminController.getAllEventReports);
router.post('/event-reports', authenticateToken, authorizeRoles('Admin','Staff'), adminController.createEventReport);
router.put('/event-reports', authenticateToken, authorizeRoles('Admin','Staff'), adminController.updateEventReport);
router.delete('/event-reports', authenticateToken, authorizeRoles('Admin','Staff'), adminController.deleteEventReport);

module.exports = router;
