const express = require('express');
const router = express.Router();
const WarehouseController = require('../controllers/WarehouseController');
const { auth, adminOnly } = require('../middleware/auth');

// Lấy toàn bộ kho
router.get('/', auth, adminOnly, WarehouseController.getAll);

// Lấy kho theo book_id
router.get('/:book_id', auth, adminOnly, WarehouseController.getByBookId);

// Tạo kho cho sách
router.post('/', auth, adminOnly, WarehouseController.create);

// Cập nhật số lượng kho
router.put('/:book_id', auth, adminOnly, WarehouseController.update);

// Xóa kho của sách
router.delete('/:book_id', auth, adminOnly, WarehouseController.delete);

module.exports = router;