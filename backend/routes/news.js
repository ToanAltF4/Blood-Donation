const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authenticateToken = require('../middlewares/authenticate');
const authorizeRoles = require('../middlewares/authorize');
router.get('/getnews', newsController.getNews);
router.get('/getnewsbyid/:id', newsController.getNewsByID);
router.post("/createnews",authenticateToken, authorizeRoles('Admin', 'Staff'), newsController.createNews);
router.post("/updatenews",authenticateToken, authorizeRoles('Admin', 'Staff'), newsController.updateNews);
router.delete("/deletenews/:id",authenticateToken, authorizeRoles('Admin', 'Staff'), newsController.deleteNews);


module.exports = router;