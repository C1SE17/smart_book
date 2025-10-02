const WarehouseModel = require('../models/WarehouseModel');

class WarehouseController {
    // Lấy danh sách kho
    static getAll(req, res) {
        WarehouseModel.getAll((err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }

    // Lấy số lượng kho theo book_id
    static getByBookId(req, res) {
        WarehouseModel.getByBookId(req.params.book_id, (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!rows.length) return res.status(404).json({ error: 'Không có kho cho sách này' });
            res.json(rows[0]);
        });
    }

    // Tạo kho cho sách mới
    static create(req, res) {
        const { book_id, quantity } = req.body;
        WarehouseModel.create(book_id, quantity, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Đã tạo kho cho sách', warehouse_id: result.insertId });
        });
    }

    // Cập nhật số lượng kho
    static update(req, res) {
        const { quantity } = req.body;
        WarehouseModel.update(req.params.book_id, quantity, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Đã cập nhật số lượng kho' });
        });
    }

    // Xóa kho của sách
    static delete(req, res) {
        WarehouseModel.delete(req.params.book_id, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Đã xóa kho của sách' });
        });
    }
}

module.exports = WarehouseController;