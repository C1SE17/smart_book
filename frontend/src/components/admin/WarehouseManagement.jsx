import React, { useState, useEffect } from 'react';

const WarehouseManagement = () => {
    const [warehouseData, setWarehouseData] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [importErrors, setImportErrors] = useState({});
    const [exportErrors, setExportErrors] = useState({});
    const [importForm, setImportForm] = useState({
        book_id: '',
        quantity: '',
        reason: 'Nhập hàng mới'
    });
    const [exportForm, setExportForm] = useState({
        book_id: '',
        quantity: '',
        reason: 'Xuất bán'
    });

    // Mock data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setTimeout(() => {
                setBooks([
                    { book_id: 1, title: 'Thanh Gươm Diệt Quỷ - Tập 1', current_stock: 45 },
                    { book_id: 2, title: 'Harry Potter và Hòn Đá Phù Thủy', current_stock: 23 },
                    { book_id: 3, title: 'One Piece - Tập 1', current_stock: 67 },
                    { book_id: 4, title: 'Attack on Titan - Tập 1', current_stock: 34 },
                    { book_id: 5, title: 'Norwegian Wood', current_stock: 12 }
                ]);

                setWarehouseData([
                    {
                        warehouse_id: 1,
                        book_id: 1,
                        quantity: 45,
                        last_updated: '2024-01-15T10:30:00Z',
                        book_title: 'Thanh Gươm Diệt Quỷ - Tập 1',
                        transactions: [
                            { type: 'import', quantity: 50, date: '2024-01-10', reason: 'Nhập hàng mới' },
                            { type: 'export', quantity: 5, date: '2024-01-12', reason: 'Xuất bán' }
                        ]
                    },
                    {
                        warehouse_id: 2,
                        book_id: 2,
                        quantity: 23,
                        last_updated: '2024-01-14T15:20:00Z',
                        book_title: 'Harry Potter và Hòn Đá Phù Thủy',
                        transactions: [
                            { type: 'import', quantity: 30, date: '2024-01-08', reason: 'Nhập hàng mới' },
                            { type: 'export', quantity: 7, date: '2024-01-13', reason: 'Xuất bán' }
                        ]
                    },
                    {
                        warehouse_id: 3,
                        book_id: 3,
                        quantity: 67,
                        last_updated: '2024-01-15T09:15:00Z',
                        book_title: 'One Piece - Tập 1',
                        transactions: [
                            { type: 'import', quantity: 100, date: '2024-01-05', reason: 'Nhập hàng mới' },
                            { type: 'export', quantity: 33, date: '2024-01-14', reason: 'Xuất bán' }
                        ]
                    }
                ]);

                setLoading(false);
            }, 1000);
        };

        fetchData();
    }, []);

    // Validation functions
    const validateImportForm = (data) => {
        const errors = {};

        if (!data.book_id) {
            errors.book_id = 'Vui lòng chọn sách';
        }
        if (!data.quantity || data.quantity <= 0) {
            errors.quantity = 'Số lượng phải lớn hơn 0';
        }
        if (!data.reason.trim()) {
            errors.reason = 'Lý do là bắt buộc';
        }

        return errors;
    };

    const validateExportForm = (data) => {
        const errors = {};

        if (!data.book_id) {
            errors.book_id = 'Vui lòng chọn sách';
        }
        if (!data.quantity || data.quantity <= 0) {
            errors.quantity = 'Số lượng phải lớn hơn 0';
        }
        if (!data.reason.trim()) {
            errors.reason = 'Lý do là bắt buộc';
        }

        // Check if export quantity exceeds current stock
        const selectedBook = books.find(book => book.book_id === parseInt(data.book_id));
        if (selectedBook && data.quantity > selectedBook.current_stock) {
            errors.quantity = `Số lượng xuất không được vượt quá tồn kho hiện tại (${selectedBook.current_stock})`;
        }

        return errors;
    };

    const handleImport = (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateImportForm(importForm);
        if (Object.keys(errors).length > 0) {
            setImportErrors(errors);
            return;
        }

        const bookId = parseInt(importForm.book_id);
        const quantity = parseInt(importForm.quantity);

        // Update warehouse data
        const existingItem = warehouseData.find(item => item.book_id === bookId);

        if (existingItem) {
            // Update existing item
            const updatedData = warehouseData.map(item =>
                item.book_id === bookId
                    ? {
                        ...item,
                        quantity: item.quantity + quantity,
                        last_updated: new Date().toISOString(),
                        transactions: [
                            ...item.transactions,
                            { type: 'import', quantity, date: new Date().toISOString().split('T')[0], reason: importForm.reason }
                        ]
                    }
                    : item
            );
            setWarehouseData(updatedData);
        } else {
            // Add new item
            const newItem = {
                warehouse_id: Math.max(...warehouseData.map(w => w.warehouse_id)) + 1,
                book_id: bookId,
                quantity: quantity,
                last_updated: new Date().toISOString(),
                book_title: books.find(b => b.book_id === bookId)?.title || '',
                transactions: [
                    { type: 'import', quantity, date: new Date().toISOString().split('T')[0], reason: importForm.reason }
                ]
            };
            setWarehouseData([...warehouseData, newItem]);
        }

        // Update books stock
        setBooks(books.map(book =>
            book.book_id === bookId
                ? { ...book, current_stock: book.current_stock + quantity }
                : book
        ));

        setImportForm({ book_id: '', quantity: '', reason: 'Nhập hàng mới' });
        setShowImportModal(false);
        setImportErrors({});
    };

    const handleExport = (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateExportForm(exportForm);
        if (Object.keys(errors).length > 0) {
            setExportErrors(errors);
            return;
        }

        const bookId = parseInt(exportForm.book_id);
        const quantity = parseInt(exportForm.quantity);

        // Check if enough stock
        const book = books.find(b => b.book_id === bookId);
        if (book && book.current_stock < quantity) {
            alert('Không đủ hàng trong kho!');
            return;
        }

        // Update warehouse data
        const updatedData = warehouseData.map(item =>
            item.book_id === bookId
                ? {
                    ...item,
                    quantity: item.quantity - quantity,
                    last_updated: new Date().toISOString(),
                    transactions: [
                        ...item.transactions,
                        { type: 'export', quantity, date: new Date().toISOString().split('T')[0], reason: exportForm.reason }
                    ]
                }
                : item
        );
        setWarehouseData(updatedData);

        // Update books stock
        setBooks(books.map(book =>
            book.book_id === bookId
                ? { ...book, current_stock: book.current_stock - quantity }
                : book
        ));

        setExportForm({ book_id: '', quantity: '', reason: 'Xuất bán' });
        setShowExportModal(false);
        setExportErrors({});
    };

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { class: 'bg-danger', text: 'Hết hàng' };
        if (quantity < 10) return { class: 'bg-warning', text: 'Sắp hết' };
        if (quantity < 50) return { class: 'bg-info', text: 'Trung bình' };
        return { class: 'bg-success', text: 'Đủ hàng' };
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Quản lý kho</h2>
                <div>
                    <button
                        className="btn btn-success me-2"
                        onClick={() => setShowImportModal(true)}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Nhập hàng
                    </button>
                    <button
                        className="btn btn-warning"
                        onClick={() => setShowExportModal(true)}
                    >
                        <i className="fas fa-minus me-2"></i>
                        Xuất hàng
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <i className="fas fa-boxes text-primary fs-1 mb-2"></i>
                            <h4 className="fw-bold">{warehouseData.length}</h4>
                            <p className="text-muted mb-0">Sản phẩm trong kho</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <i className="fas fa-exclamation-triangle text-warning fs-1 mb-2"></i>
                            <h4 className="fw-bold">
                                {warehouseData.filter(item => item.quantity < 10).length}
                            </h4>
                            <p className="text-muted mb-0">Sắp hết hàng</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <i className="fas fa-times-circle text-danger fs-1 mb-2"></i>
                            <h4 className="fw-bold">
                                {warehouseData.filter(item => item.quantity === 0).length}
                            </h4>
                            <p className="text-muted mb-0">Hết hàng</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <i className="fas fa-chart-line text-success fs-1 mb-2"></i>
                            <h4 className="fw-bold">
                                {warehouseData.reduce((sum, item) => sum + item.quantity, 0)}
                            </h4>
                            <p className="text-muted mb-0">Tổng số lượng</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Warehouse Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Tên sách</th>
                                    <th className="text-center">Số lượng hiện tại</th>
                                    <th className="text-center">Trạng thái</th>
                                    <th>Cập nhật lần cuối</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {warehouseData.map((item) => {
                                    const stockStatus = getStockStatus(item.quantity);
                                    return (
                                        <tr key={item.warehouse_id}>
                                            <td>
                                                <div className="fw-medium text-dark">{item.book_title}</div>
                                            </td>
                                            <td className="text-center">
                                                <span className="fw-bold fs-5">{item.quantity}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge ${stockStatus.class}`}>
                                                    {stockStatus.text}
                                                </span>
                                            </td>
                                            <td className="text-muted small">
                                                {new Date(item.last_updated).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => {
                                                        setExportForm({ ...exportForm, book_id: item.book_id.toString() });
                                                        setShowExportModal(true);
                                                    }}
                                                >
                                                    <i className="fas fa-edit me-1"></i>
                                                    Xuất
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Import Modal */}
            {showImportModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nhập hàng vào kho</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowImportModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleImport}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Chọn sách *</label>
                                        <select
                                            className={`form-select ${importErrors.book_id ? 'is-invalid' : ''}`}
                                            value={importForm.book_id}
                                            onChange={(e) => setImportForm({ ...importForm, book_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Chọn sách</option>
                                            {books.map(book => (
                                                <option key={book.book_id} value={book.book_id}>
                                                    {book.title} (Hiện có: {book.current_stock})
                                                </option>
                                            ))}
                                        </select>
                                        {importErrors.book_id && (
                                            <div className="invalid-feedback">{importErrors.book_id}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Số lượng nhập *</label>
                                        <input
                                            type="number"
                                            className={`form-control ${importErrors.quantity ? 'is-invalid' : ''}`}
                                            value={importForm.quantity}
                                            onChange={(e) => setImportForm({ ...importForm, quantity: e.target.value })}
                                            required
                                            min="1"
                                        />
                                        {importErrors.quantity && (
                                            <div className="invalid-feedback">{importErrors.quantity}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Lý do nhập</label>
                                        <input
                                            type="text"
                                            className={`form-control ${importErrors.reason ? 'is-invalid' : ''}`}
                                            value={importForm.reason}
                                            onChange={(e) => setImportForm({ ...importForm, reason: e.target.value })}
                                        />
                                        {importErrors.reason && (
                                            <div className="invalid-feedback">{importErrors.reason}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowImportModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        Nhập hàng
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            {showExportModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xuất hàng khỏi kho</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowExportModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleExport}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Chọn sách *</label>
                                        <select
                                            className={`form-select ${exportErrors.book_id ? 'is-invalid' : ''}`}
                                            value={exportForm.book_id}
                                            onChange={(e) => setExportForm({ ...exportForm, book_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Chọn sách</option>
                                            {books.map(book => (
                                                <option key={book.book_id} value={book.book_id}>
                                                    {book.title} (Hiện có: {book.current_stock})
                                                </option>
                                            ))}
                                        </select>
                                        {exportErrors.book_id && (
                                            <div className="invalid-feedback">{exportErrors.book_id}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Số lượng xuất *</label>
                                        <input
                                            type="number"
                                            className={`form-control ${exportErrors.quantity ? 'is-invalid' : ''}`}
                                            value={exportForm.quantity}
                                            onChange={(e) => setExportForm({ ...exportForm, quantity: e.target.value })}
                                            required
                                            min="1"
                                        />
                                        {exportErrors.quantity && (
                                            <div className="invalid-feedback">{exportErrors.quantity}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Lý do xuất</label>
                                        <input
                                            type="text"
                                            className={`form-control ${exportErrors.reason ? 'is-invalid' : ''}`}
                                            value={exportForm.reason}
                                            onChange={(e) => setExportForm({ ...exportForm, reason: e.target.value })}
                                        />
                                        {exportErrors.reason && (
                                            <div className="invalid-feedback">{exportErrors.reason}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowExportModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-warning">
                                        Xuất hàng
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WarehouseManagement;
