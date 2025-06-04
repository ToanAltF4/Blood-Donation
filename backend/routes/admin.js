const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/authenticate');
const authorizeRoles = require('../middlewares/authorize');
router.get('/getAllUsers',authenticateToken, authorizeRoles('Admin'), adminController.getAllUsers);
router.post('/changeRole', authenticateToken, authorizeRoles('Admin'), adminController.changeUserRole);

module.exports = router;
