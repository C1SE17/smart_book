const db = require('../config/db');

const WarehouseModel = {
    getAll: (callback) => {
        db.query(
            `SELECT w.warehouse_id, w.book_id, b.title, w.quantity, w.last_updated
             FROM warehouse w
             JOIN books b ON w.book_id = b.book_id`,
            callback
        );
    },
    getByBookId: (book_id, callback) => {
        db.query(
            `SELECT * FROM warehouse WHERE book_id = ?`, [book_id], callback
        );
    },
    create: (book_id, quantity, callback) => {
        db.query(
            `INSERT INTO warehouse (book_id, quantity) VALUES (?, ?)`,
            [book_id, quantity], callback
        );
    },
    update: (book_id, quantity, callback) => {
        db.query(
            `UPDATE warehouse SET quantity = ? WHERE book_id = ?`,
            [quantity, book_id], callback
        );
    },
    delete: (book_id, callback) => {
        db.query(
            `DELETE FROM warehouse WHERE book_id = ?`, [book_id], callback
        );
    }
};

module.exports = WarehouseModel;