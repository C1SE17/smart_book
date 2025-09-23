const express = require('express');
const router = express.Router();
const AuthorController = require('../controllers/AuthorController');
const { auth, adminOnly } = require('../middleware/auth');

// Lấy danh sách tác giả (chỉ admin)
router.get('/', auth, adminOnly, AuthorController.getAllAuthors);

// Lấy chi tiết tác giả (chỉ admin)
router.get('/:id', auth, adminOnly, AuthorController.getAuthor);

// Tạo tác giả mới (chỉ admin)
router.post('/', auth, adminOnly, AuthorController.createAuthor);

// Cập nhật tác giả (chỉ admin)
router.put('/:id', auth, adminOnly, AuthorController.updateAuthor);

// Xóa tác giả (chỉ admin)
router.delete('/:id', auth, adminOnly, AuthorController.deleteAuthor);

module.exports = router;