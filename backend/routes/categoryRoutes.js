const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { auth, adminOnly } = require('../middleware/auth');

// Lấy danh sách danh mục (công khai cho frontend)
router.get('/', CategoryController.getAllCategories);

// Tìm kiếm danh mục
router.get('/search', CategoryController.searchCategories);

// Lấy chi tiết danh mục (chỉ admin)
router.get('/:id', auth, adminOnly, CategoryController.getCategory);

// Tạo danh mục mới (chỉ admin)
router.post('/', auth, adminOnly, CategoryController.createCategory);

// Cập nhật danh mục (chỉ admin)
router.put('/:id', auth, adminOnly, CategoryController.updateCategory);

// Xóa danh mục (chỉ admin)
router.delete('/:id', auth, adminOnly, CategoryController.deleteCategory);

module.exports = router;