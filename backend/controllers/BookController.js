/**
 * Book Controller - Xử lý các API liên quan đến sách
 * Sử dụng MVC pattern với Views để format responses
 */
const Book = require('../models/Book');
const { BookView } = require('../views');

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
        const response = BookView.list(result.books, result.pagination);
        res.json(response);
    } catch (err) {
        const { response, statusCode } = BookView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
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
        const response = BookView.search(result.books, result.pagination);
        res.json(response);
    } catch (err) {
        const { response, statusCode } = BookView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.getBook = async (req, res) => { // Lấy chi tiết sản phẩm
    try {
        const book = await Book.getById(req.params.id);
        const result = BookView.detail(book);
        
        if (!book) {
            const { response, statusCode } = BookView.notFound('Sách');
            return res.status(statusCode).json(response);
        }
        
        res.json(result);
    } catch (err) {
        const { response, statusCode } = BookView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.createBook = async (req, res) => { // Tạo sản phẩm mới
    try {
        const book = await Book.create(req.body);
        const response = BookView.created(book);
        res.status(201).json(response);
    } catch (err) {
        const { response, statusCode } = BookView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.updateBook = async (req, res) => { // Cập nhật sản phẩm
    try {
        const book = await Book.update(req.params.id, req.body);
        const response = BookView.updated(book);
        res.json(response);
    } catch (err) {
        const { response, statusCode } = BookView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.deleteBook = async (req, res) => { // Xóa sản phẩm
    try {
        await Book.delete(req.params.id);
        const response = BookView.deleted();
        res.json(response);
    } catch (err) {
        const { response, statusCode } = BookView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};