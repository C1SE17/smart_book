const db = require('../config/db');

// Model Book cho các thao tác cơ sở dữ liệu
class Book {
    static getAll(callback) {
        db.query('SELECT * FROM books', (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    }
}

module.exports = Book;