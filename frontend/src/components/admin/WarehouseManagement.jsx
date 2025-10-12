import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useWarehouseManagement } from '../../hooks/useWarehouseManagement';

const WarehouseManagement = () => {
    const {
        warehouseItems,
        books,
        loading,
        error,
        pagination,
        createWarehouseItem,
        updateWarehouseItem,
        deleteWarehouseItem,
        refreshData,
        loadWarehouseOnly
    } = useWarehouseManagement();

    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [importErrors, setImportErrors] = useState({});
    const [exportErrors, setExportErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const searchTimeoutRef = useRef(null);
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

    // Handle search with debounce để tránh gọi API quá nhiều
    const handleSearch = useCallback(async (searchValue) => {
        setSearchTerm(searchValue);
        setCurrentPage(1); // Reset to first page when searching
        
        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        // Set new timeout để debounce search
        searchTimeoutRef.current = setTimeout(async () => {
            await loadWarehouseOnly(1, itemsPerPage, searchValue);
        }, 300); // 300ms delay
    }, [itemsPerPage, loadWarehouseOnly]);

    // Cleanup timeout khi component unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Handle page change - chỉ load warehouse, không reload toàn bộ và không hiển thị loading
    const handlePageChange = async (page) => {
        if (page === currentPage) return;
        
        setCurrentPage(page);
        await loadWarehouseOnly(page, itemsPerPage, searchTerm, false); // false = không hiển thị loading
    };

    // Handle items per page change
    const handleItemsPerPageChange = async (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page
        await loadWarehouseOnly(1, newItemsPerPage, searchTerm);
    };

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

    const handleImport = async (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateImportForm(importForm);
        if (Object.keys(errors).length > 0) {
            setImportErrors(errors);
            return;
        }

        const bookId = parseInt(importForm.book_id);
        const quantity = parseInt(importForm.quantity);

        try {
            // Tìm warehouse item hiện tại
            const existingItem = warehouseItems.find(item => item.book_id === bookId);
            
            if (existingItem) {
                // Update existing item
                const newQuantity = existingItem.quantity + quantity;
                const result = await updateWarehouseItem(bookId, { quantity: newQuantity });
                
                if (result.success) {
                    // Refresh data with current pagination
                    await loadWarehouseOnly(currentPage, itemsPerPage, searchTerm);
                    alert('Nhập hàng thành công!');
                } else {
                    alert(result.message);
                }
            } else {
                // Create new item
                const result = await createWarehouseItem({ book_id: bookId, quantity });
                
                if (result.success) {
                    // Refresh data with current pagination
                    await loadWarehouseOnly(currentPage, itemsPerPage, searchTerm);
                    alert('Nhập hàng thành công!');
                } else {
                    alert(result.message);
                }
            }

            setImportForm({ book_id: '', quantity: '', reason: 'Nhập hàng mới' });
            setShowImportModal(false);
            setImportErrors({});
        } catch (error) {
            console.error('Error importing:', error);
            alert('Có lỗi xảy ra khi nhập hàng. Vui lòng thử lại.');
        }
    };

    const handleExport = async (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateExportForm(exportForm);
        if (Object.keys(errors).length > 0) {
            setExportErrors(errors);
            return;
        }

        const bookId = parseInt(exportForm.book_id);
        const quantity = parseInt(exportForm.quantity);

        try {
            // Tìm warehouse item hiện tại
            const existingItem = warehouseItems.find(item => item.book_id === bookId);
            
            if (!existingItem) {
                alert('Không tìm thấy sản phẩm trong kho!');
                return;
            }

            // Check if enough stock
            if (existingItem.quantity < quantity) {
                alert(`Không đủ hàng trong kho! Hiện có: ${existingItem.quantity}`);
                return;
            }

            // Update warehouse item
            const newQuantity = existingItem.quantity - quantity;
            const result = await updateWarehouseItem(bookId, { quantity: newQuantity });
            
            if (result.success) {
                // Refresh data with current pagination
                await loadWarehouseOnly(currentPage, itemsPerPage, searchTerm);
                alert('Xuất hàng thành công!');
            } else {
                alert(result.message);
            }

            setExportForm({ book_id: '', quantity: '', reason: 'Xuất bán' });
            setShowExportModal(false);
            setExportErrors({});
        } catch (error) {
            console.error('Error exporting:', error);
            alert('Có lỗi xảy ra khi xuất hàng. Vui lòng thử lại.');
        }
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
            {/* CSS để fix cột không bị lệch và smooth transitions */}
            <style jsx>{`
                .table-responsive {
                    scrollbar-width: thin;
                    scrollbar-color: #dee2e6 #f8f9fa;
                }
                .table-responsive::-webkit-scrollbar {
                    height: 8px;
                }
                .table-responsive::-webkit-scrollbar-track {
                    background: #f8f9fa;
                }
                .table-responsive::-webkit-scrollbar-thumb {
                    background: #dee2e6;
                    border-radius: 4px;
                }
                .table-responsive::-webkit-scrollbar-thumb:hover {
                    background: #adb5bd;
                }
                .table-fixed {
                    table-layout: fixed !important;
                    width: 100% !important;
                }
                .table-fixed th,
                .table-fixed td {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .table-fixed th:first-child,
                .table-fixed td:first-child {
                    white-space: normal;
                    word-wrap: break-word;
                }
                
                /* Smooth transitions for table rows */
                .table tbody tr {
                    transition: all 0.3s ease-in-out;
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .table tbody tr.fade-out {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                
                .table tbody tr.fade-in {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                
                /* Smooth button transitions */
                .page-link {
                    transition: all 0.2s ease-in-out !important;
                }
                
                .page-link:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .page-item.active .page-link {
                    transform: scale(1.05);
                }
                
                /* Loading spinner animation */
                .pagination-spinner {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
            
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
                            <h4 className="fw-bold">{pagination.totalItems || 0}</h4>
                            <p className="text-muted mb-0">Sản phẩm trong kho</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <i className="fas fa-exclamation-triangle text-warning fs-1 mb-2"></i>
                            <h4 className="fw-bold">
                                {warehouseItems.filter(item => item.quantity < 10).length}
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
                                {warehouseItems.filter(item => item.quantity === 0).length}
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
                                {warehouseItems.reduce((sum, item) => sum + item.quantity, 0)}
                            </h4>
                            <p className="text-muted mb-0">Tổng số lượng</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Warehouse Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold text-dark mb-0">
                        <i className="fas fa-warehouse text-primary me-2"></i>
                        Danh sách sản phẩm trong kho
                    </h5>
                </div>

                <div className="card-body p-0">
                    {/* Search Bar and Total Count */}
                    <div className="p-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-3">
                                <span className="text-muted">
                                    <i className="fas fa-boxes me-1"></i>
                                    Tổng số sản phẩm: <strong className="text-primary">{pagination.totalItems || 0}</strong>
                                </span>
                                <span className="text-muted">
                                    Trang {pagination.currentPage || 1} / {pagination.totalPages || 1}
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <label className="text-muted small">Hiển thị:</label>
                                <select 
                                    className="form-select form-select-sm" 
                                    style={{width: 'auto'}}
                                    value={itemsPerPage}
                                    onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Tìm kiếm sản phẩm theo tên, tác giả, danh mục..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {searchTerm && (
                                <button type="button" className="btn btn-outline-secondary" onClick={() => handleSearch('')}>
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="table-responsive position-relative" style={{ overflowX: 'auto' }}>
                        <table 
                            className="table table-hover mb-0 align-middle text-center table-fixed"
                        >
                            <thead className="bg-light">
                                <tr>
                                    <th style={{ width: "40%" }} className="py-3 fw-semibold text-secondary text-start ps-3">Tên sách</th>
                                    <th style={{ width: "15%" }} className="py-3 fw-semibold text-secondary">Số lượng hiện tại</th>
                                    <th style={{ width: "15%" }} className="py-3 fw-semibold text-secondary">Trạng thái</th>
                                    <th style={{ width: "20%" }} className="py-3 fw-semibold text-secondary">Cập nhật lần cuối</th>
                                    <th style={{ width: "10%" }} className="py-3 fw-semibold text-secondary">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-danger">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            {error}
                                        </td>
                                    </tr>
                                ) : warehouseItems.length > 0 ? (
                                    warehouseItems.map((item) => {
                                        const stockStatus = getStockStatus(item.quantity);
                                        return (
                                            <tr key={item.warehouse_id} className="border-bottom">
                                                <td className="text-start ps-3">
                                                    <div className="fw-bold text-primary text-truncate" title={item.title}>
                                                        {item.title}
                                                    </div>
                                                    <small className="text-muted text-truncate d-block">
                                                        {item.author_name && `Tác giả: ${item.author_name}`}
                                                        {item.category_name && ` • Danh mục: ${item.category_name}`}
                                                    </small>
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
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-muted py-4">
                                            <i className="fas fa-inbox fa-2x mb-2"></i>
                                            <div>Không có dữ liệu sản phẩm trong kho</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center p-3 border-top">
                            <div className="text-muted small">
                                Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} 
                                trong tổng số {pagination.totalItems} sản phẩm
                            </div>
                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${!pagination.hasPrevPage || false ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(1)}
                                            disabled={!pagination.hasPrevPage || false}
                                            title="Trang đầu"
                                        >
                                            <i className="fas fa-angle-double-left"></i>
                                        </button>
                                    </li>
                                    <li className={`page-item ${!pagination.hasPrevPage || false ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={!pagination.hasPrevPage || false}
                                            title="Trang trước"
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                    </li>
                                    
                                    {/* Show page numbers */}
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + i;
                                        } else {
                                            pageNum = pagination.currentPage - 2 + i;
                                        }
                                        
                                        return (
                                            <li key={pageNum} className={`page-item ${pagination.currentPage === pageNum ? 'active' : ''} ${false ? 'disabled' : ''}`}>
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => handlePageChange(pageNum)}
                                                    disabled={false}
                                                >
                                                    {pageNum}
                                                </button>
                                            </li>
                                        );
                                    })}
                                    
                                    <li className={`page-item ${!pagination.hasNextPage || false ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={!pagination.hasNextPage || false}
                                            title="Trang sau"
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </li>
                                    <li className={`page-item ${!pagination.hasNextPage || false ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(pagination.totalPages)}
                                            disabled={!pagination.hasNextPage || false}
                                            title="Trang cuối"
                                        >
                                            <i className="fas fa-angle-double-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
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
