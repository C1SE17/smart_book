const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => { // Lấy danh sách sản phẩm
    try {
        const { page, limit, category_id, author_id, publisher_id, search } = req.query;
        const books = await Book.getAll({ page: parseInt(page), limit: parseInt(limit), category_id, author_id, publisher_id, search });
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBook = async (req, res) => { // Lấy chi tiết sản phẩm
    try {
        const book = await Book.getById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Sách không tồn tại' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createBook = async (req, res) => { // Tạo sản phẩm mới
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateBook = async (req, res) => { // Cập nhật sản phẩm
    try {
        const book = await Book.update(req.params.id, req.body);
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteBook = async (req, res) => { // Xóa sản phẩm
    try {
        await Book.delete(req.params.id);
        res.json({ message: 'Sách đã được xóa' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};