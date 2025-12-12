/**
 * Publisher Controller - Xử lý các API liên quan đến nhà xuất bản
 * Sử dụng MVC pattern với Views để format responses
 */
const Publisher = require('../models/Publisher');
const { PublisherView } = require('../views');

exports.getAllPublishers = async (req, res) => { // Lấy danh sách nhà xuất bản
    try {
        const publishers = await Publisher.getAll();
        const response = PublisherView.list(publishers);
        res.json(response);
    } catch (err) {
        const { response, statusCode } = PublisherView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.getPublisher = async (req, res) => { // Lấy chi tiết nhà xuất bản
    try {
        const publisher = await Publisher.getById(req.params.id);
        const result = PublisherView.detail(publisher);
        
        if (!publisher) {
            const { response, statusCode } = PublisherView.notFound('Nhà xuất bản');
            return res.status(statusCode).json(response);
        }
        
        res.json(result);
    } catch (err) {
        const { response, statusCode } = PublisherView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.createPublisher = async (req, res) => { // Tạo nhà xuất bản mới
    try {
        const publisher = await Publisher.create(req.body);
        const response = PublisherView.created(publisher);
        res.status(201).json(response);
    } catch (err) {
        const { response, statusCode } = PublisherView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.updatePublisher = async (req, res) => { // Cập nhật nhà xuất bản
    try {
        const publisher = await Publisher.update(req.params.id, req.body);
        const response = PublisherView.updated(publisher);
        res.json(response);
    } catch (err) {
        const { response, statusCode } = PublisherView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};

exports.deletePublisher = async (req, res) => { // Xóa nhà xuất bản
    try {
        await Publisher.delete(req.params.id);
        const response = PublisherView.deleted();
        res.json(response);
    } catch (err) {
        const { response, statusCode } = PublisherView.error(err.message, 500, err.message);
        res.status(statusCode).json(response);
    }
};