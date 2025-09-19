const Book = require('../models/Book');

class BookController {
    static getAllBooks(req, res) {
        Book.getAll((err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
            }
            res.json(results);
        });
    }
}

module.exports = BookController;