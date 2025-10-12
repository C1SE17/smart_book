const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => { // Lấy danh sách sản phẩm
    try {
        const { page, limit, category_id, author_id, publisher_id, search } = req.query;
        const result = await Book.getAll({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 10,
            category_id,
            author_id,
            publisher_id,
            search
        });
        res.json({ 
            success: true, 
            data: result.books,
            pagination: result.pagination
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.searchBooks = async (req, res) => { // Tìm kiếm sách
    try {
        const { q, page, limit, category_id, author_id, publisher_id } = req.query;
        const result = await Book.getAll({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 100,
            category_id,
            author_id,
            publisher_id,
            search: q
        });
        res.json({ 
            success: true, 
            data: result.books, 
            pagination: result.pagination,
            message: `Tìm thấy ${result.pagination.totalItems} kết quả` 
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getBook = async (req, res) => { // Lấy chi tiết sản phẩm
    try {
        const book = await Book.getById(req.params.id);
        if (!book) return res.status(404).json({ success: false, message: 'Sách không tồn tại' });
        res.json({ success: true, data: book });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.createBook = async (req, res) => { // Tạo sản phẩm mới
    try {
        const book = await Book.create(req.body);
        res.status(201).json({
            success: true,
            data: book,
            message: 'Sách đã được tạo thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            message: 'Có lỗi xảy ra khi tạo sách'
        });
    }
};

exports.updateBook = async (req, res) => { // Cập nhật sản phẩm
    try {
        const book = await Book.update(req.params.id, req.body);
        res.json({
            success: true,
            data: book,
            message: 'Sách đã được cập nhật thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            message: 'Có lỗi xảy ra khi cập nhật sách'
        });
    }
};

exports.deleteBook = async (req, res) => { // Xóa sản phẩm
    try {
        await Book.delete(req.params.id);
        res.json({
            success: true,
            message: 'Sách đã được xóa thành công'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
            message: 'Có lỗi xảy ra khi xóa sách'
        });
    }
};