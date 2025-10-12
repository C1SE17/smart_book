const Category = require('../models/Category');

exports.getAllCategories = async (req, res) => { // Lấy danh sách danh mục
    try {
        const categories = await Category.getAll();
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.searchCategories = async (req, res) => { // Tìm kiếm danh mục
    try {
        const { q } = req.query;
        const categories = await Category.search(q);
        res.json({ success: true, data: categories, message: `Tìm thấy ${categories.length} kết quả` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
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
        res.status(201).json({
            success: true,
            data: category,
            message: 'Danh mục đã được tạo thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            message: 'Có lỗi xảy ra khi tạo danh mục'
        });
    }
};

exports.updateCategory = async (req, res) => { // Cập nhật danh mục
    try {
        const category = await Category.update(req.params.id, req.body);
        res.json({
            success: true,
            data: category,
            message: 'Danh mục đã được cập nhật thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            message: 'Có lỗi xảy ra khi cập nhật danh mục'
        });
    }
};

exports.deleteCategory = async (req, res) => { // Xóa danh mục
    try {
        await Category.delete(req.params.id);
        res.json({
            success: true,
            message: 'Danh mục đã được xóa thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            message: 'Có lỗi xảy ra khi xóa danh mục'
        });
    }
};