const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');

// Định nghĩa tuyến đường
router.get('/books', BookController.getAllBooks);

module.exports = router;