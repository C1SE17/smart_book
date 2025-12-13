/**
 * Category Controller - Xử lý các API liên quan đến thể loại
 * Sử dụng MVC pattern với Views để format responses
 */
const Category = require('../models/Category');
const { CategoryView } = require('../views');

exports.getAllCategories = async (req, res) => { // Lấy danh sách danh mục
    try {
        const categories = await Category.getAll();
        const response = CategoryView.list(categories);
        res.json(response);
    } catch (err) {
        const { response, statusCode } = CategoryView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.searchCategories = async (req, res) => { // Tìm kiếm danh mục
    try {
        const { q } = req.query;
        const categories = await Category.search(q);
        const response = CategoryView.list(categories, `Tìm thấy ${categories.length} kết quả`);
        res.json(response);
    } catch (err) {
        const { response, statusCode } = CategoryView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.getCategory = async (req, res) => { // Lấy chi tiết danh mục
    try {
        const category = await Category.getById(req.params.id);
        const result = CategoryView.detail(category);
        
        if (!category) {
            const { response, statusCode } = CategoryView.notFound('Danh mục');
            return res.status(statusCode).json(response);
        }
        
        res.json(result);
    } catch (err) {
        const { response, statusCode } = CategoryView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.createCategory = async (req, res) => { // Tạo danh mục mới
    try {
        const category = await Category.create(req.body);
        const response = CategoryView.created(category);
        res.status(201).json(response);
    } catch (err) {
        const { response, statusCode } = CategoryView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.updateCategory = async (req, res) => { // Cập nhật danh mục
    try {
        const category = await Category.update(req.params.id, req.body);
        const response = CategoryView.updated(category);
        res.json(response);
    } catch (err) {
        const { response, statusCode } = CategoryView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.deleteCategory = async (req, res) => { // Xóa danh mục
    try {
        await Category.delete(req.params.id);
        const response = CategoryView.deleted();
        res.json(response);
    } catch (err) {
        const { response, statusCode } = CategoryView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};