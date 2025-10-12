const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');
const { auth, adminOnly } = require('../middleware/auth');

// Lấy danh sách sản phẩm (công khai, hỗ trợ filter và search)
router.get('/', BookController.getAllBooks);

// Tìm kiếm sách
router.get('/search', BookController.searchBooks);

// Lấy chi tiết sản phẩm (công khai)
router.get('/:id', BookController.getBook);

// Tạo sản phẩm mới (chỉ admin)
router.post('/', auth, adminOnly, BookController.createBook);

// Cập nhật sản phẩm (chỉ admin)
router.put('/:id', auth, adminOnly, BookController.updateBook);

// Xóa sản phẩm (chỉ admin)
router.delete('/:id', auth, adminOnly, BookController.deleteBook);

module.exports = router;