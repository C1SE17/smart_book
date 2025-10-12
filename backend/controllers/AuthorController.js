const Author = require('../models/Author');

exports.getAllAuthors = async (req, res) => { // Lấy danh sách tác giả
    try {
        const authors = await Author.getAll();
        res.json({ success: true, data: authors });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getAuthor = async (req, res) => { // Lấy chi tiết tác giả
    try {
        const author = await Author.getById(req.params.id);
        if (!author) return res.status(404).json({ error: 'Tác giả không tồn tại' });
        res.json(author);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createAuthor = async (req, res) => { // Tạo tác giả mới
    try {
        const author = await Author.create(req.body);
        res.status(201).json(author);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateAuthor = async (req, res) => { // Cập nhật tác giả
    try {
        const author = await Author.update(req.params.id, req.body);
        res.json(author);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAuthor = async (req, res) => { // Xóa tác giả
    try {
        await Author.delete(req.params.id);
        res.json({ message: 'Tác giả đã được xóa' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};