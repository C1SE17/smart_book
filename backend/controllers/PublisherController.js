const Publisher = require('../models/Publisher');

exports.getAllPublishers = async (req, res) => { // Lấy danh sách nhà xuất bản
    try {
        const publishers = await Publisher.getAll();
        res.json({ success: true, data: publishers });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getPublisher = async (req, res) => { // Lấy chi tiết nhà xuất bản
    try {
        const publisher = await Publisher.getById(req.params.id);
        if (!publisher) return res.status(404).json({ error: 'Nhà xuất bản không tồn tại' });
        res.json(publisher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createPublisher = async (req, res) => { // Tạo nhà xuất bản mới
    try {
        const publisher = await Publisher.create(req.body);
        res.status(201).json(publisher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updatePublisher = async (req, res) => { // Cập nhật nhà xuất bản
    try {
        const publisher = await Publisher.update(req.params.id, req.body);
        res.json(publisher);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletePublisher = async (req, res) => { // Xóa nhà xuất bản
    try {
        await Publisher.delete(req.params.id);
        res.json({ message: 'Nhà xuất bản đã được xóa' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};