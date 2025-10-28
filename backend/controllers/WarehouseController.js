const WarehouseModel = require('../models/WarehouseModel');

class WarehouseController {
    // Lấy danh sách kho với phân trang
    static async getAll(req, res) {
        try {
            const { page, limit, search } = req.query;
            const result = await WarehouseModel.getAll({
                page: page ? parseInt(page) : 1,
                limit: limit ? parseInt(limit) : 10,
                search
            });
            res.json({ 
                success: true, 
                data: result.warehouseItems,
                pagination: result.pagination
            });
        } catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
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

    // PUBLIC: Trả về số lượng hiển thị an toàn cho danh sách book_ids
    static async getPublicDisplayQuantities(req, res) {
        try {
            let { book_ids } = req.query;
            if (!book_ids) return res.json({ success: true, data: {} });
            if (typeof book_ids === 'string') {
                book_ids = book_ids.split(',').map(s => s.trim()).filter(Boolean);
            }
            // Giới hạn tối đa để tránh abuse
            book_ids = book_ids.slice(0, 50);
            const result = {};
            // Dùng hàm có sẵn theo từng id (đơn giản, an toàn DB hiện tại)
            await Promise.all(book_ids.map(id => new Promise((resolve) => {
                WarehouseModel.getByBookId(id, (err, rows) => {
                    if (!err && rows && rows[0] && typeof rows[0].quantity === 'number') {
                        const qty = rows[0].quantity;
                        // Quy tắc hiển thị an toàn: chỉ trả các mốc threshold
                        let display;
                        if (qty <= 0) display = 0;
                        else if (qty < 5) display = qty; // hiển thị số thật khi gần hết để kích cầu
                        else if (qty < 10) display = 10;
                        else if (qty < 20) display = 20;
                        else display = 20; // không tiết lộ tồn lớn
                        result[id] = display;
                    }
                    resolve();
                });
            })));
            return res.json({ success: true, data: result });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }
}

module.exports = WarehouseController;