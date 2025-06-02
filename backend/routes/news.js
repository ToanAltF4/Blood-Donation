const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/getnews', newsController.getNews);


module.exports = router;