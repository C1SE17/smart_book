const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => { // Lấy danh sách danh mục
    try {
        const categories = await Category.getAll();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCategory = async (req, res) => { // Lấy chi tiết danh mục
    try {
        const category = await Category.getById(req.params.id);
        if (!category) return res.status(404).json({ error: 'Danh mục không tồn tại' });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createCategory = async (req, res) => { // Tạo danh mục mới
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCategory = async (req, res) => { // Cập nhật danh mục
    try {
        const category = await Category.update(req.params.id, req.body);
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteCategory = async (req, res) => { // Xóa danh mục
    try {
        await Category.delete(req.params.id);
        res.json({ message: 'Danh mục đã được xóa' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};