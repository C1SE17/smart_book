const db = require('../config/db');

const WarehouseModel = {
    getAll: async ({ page = 1, limit = 10, search = '' } = {}) => {
        const offset = (page - 1) * limit;
        
        // Query để lấy dữ liệu warehouse
        let dataQuery = `
            SELECT w.warehouse_id, w.book_id, b.title, w.quantity, w.last_updated,
                   a.name as author_name, c.name as category_name, p.name as publisher_name
            FROM warehouse w
            JOIN books b ON w.book_id = b.book_id
            LEFT JOIN authors a ON b.author_id = a.author_id
            LEFT JOIN categories c ON b.category_id = c.category_id
            LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
        `;
        
        // Query để đếm tổng số warehouse items
        let countQuery = `
            SELECT COUNT(*) as total
            FROM warehouse w
            JOIN books b ON w.book_id = b.book_id
            LEFT JOIN authors a ON b.author_id = a.author_id
            LEFT JOIN categories c ON b.category_id = c.category_id
            LEFT JOIN publishers p ON b.publisher_id = p.publisher_id
        `;
        
        let conditions = [];
        let params = [];

        if (search) {
            // Tìm kiếm theo tên sách, tác giả, danh mục, nhà xuất bản
            conditions.push(`(
                b.title LIKE ? OR 
                a.name LIKE ? OR 
                c.name LIKE ? OR 
                p.name LIKE ?
            )`);
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        if (conditions.length > 0) {
            const whereClause = " WHERE " + conditions.join(" AND ");
            dataQuery += whereClause;
            countQuery += whereClause;
        }

        dataQuery += " ORDER BY w.last_updated DESC LIMIT ? OFFSET ?";
        const dataParams = [...params, limit, offset];

        // Thực hiện cả hai query song song
        const [dataRows] = await db.promise().query(dataQuery, dataParams);
        const [countRows] = await db.promise().query(countQuery, params);
        const [summaryRows] = await db.promise().query(
            `
            SELECT
                COUNT(*) AS total_products,
                SUM(CASE WHEN quantity <= 0 THEN 1 ELSE 0 END) AS out_of_stock,
                SUM(CASE WHEN quantity > 0 AND quantity < 10 THEN 1 ELSE 0 END) AS low_stock,
                COALESCE(SUM(quantity), 0) AS total_quantity_raw,
                COALESCE(SUM(GREATEST(quantity, 0)), 0) AS total_quantity_available
            FROM warehouse
            `
        );
        
        const total = countRows[0].total;
        const totalPages = Math.ceil(total / limit);
        const summaryRow = summaryRows[0] || {};
        
        return {
            warehouseItems: dataRows,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            summary: {
                totalProducts: Number(summaryRow.total_products || 0),
                lowStock: Number(summaryRow.low_stock || 0),
                outOfStock: Number(summaryRow.out_of_stock || 0),
                totalQuantity: Number(summaryRow.total_quantity_available || 0),
                totalQuantityRaw: Number(summaryRow.total_quantity_raw || 0)
            }
        };
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