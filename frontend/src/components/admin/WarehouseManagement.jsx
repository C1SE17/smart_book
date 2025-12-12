import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useWarehouseManagement } from '../../hooks/useWarehouseManagement';
import { useTranslation } from 'react-i18next';

const WarehouseManagement = () => {
    const {
        warehouseItems,
        books,
        loading,
        error,
        pagination,
        summary,
        createWarehouseItem,
        updateWarehouseItem,
        loadWarehouseOnly
    } = useWarehouseManagement();

    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

    const [showImportModal, setShowImportModal] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [importErrors, setImportErrors] = useState({});
    const [exportErrors, setExportErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const searchTimeoutRef = useRef(null);
    const defaultImportReason = t('warehouseManagement.forms.import.defaultReason');
    const defaultExportReason = t('warehouseManagement.forms.export.defaultReason');
    const [importForm, setImportForm] = useState({
        book_id: '',
        quantity: '',
        reason: defaultImportReason
    });
    const [exportForm, setExportForm] = useState({
        book_id: '',
        quantity: '',
        reason: defaultExportReason
    });
    const previousImportDefault = useRef(defaultImportReason);
    const previousExportDefault = useRef(defaultExportReason);

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
            errors.book_id = 'Please select a book';
        }
        
        // Validate quantity
        if (!data.quantity || data.quantity.toString().trim() === '') {
            errors.quantity = 'Quantity cannot be empty';
        } else {
            // Check if contains non-numeric characters
            const quantityStr = data.quantity.toString().trim();
            if (!/^\d+$/.test(quantityStr)) {
                errors.quantity = 'Quantity must be a number only (no letters or special characters)';
            } else {
                const quantityNum = parseInt(quantityStr);
                if (isNaN(quantityNum) || quantityNum <= 0) {
                    errors.quantity = t('warehouseManagement.forms.errors.quantityPositive');
                }
            }
        }
        
        if (!data.reason.trim()) {
            errors.reason = t('warehouseManagement.forms.errors.reasonRequired');
        }

        return errors;
    };

    const validateExportForm = (data) => {
        const errors = {};

        if (!data.book_id) {
            errors.book_id = 'Please select a book';
        }
        
        // Validate quantity
        if (!data.quantity || data.quantity.toString().trim() === '') {
            errors.quantity = 'Quantity cannot be empty';
        } else {
            // Check if contains non-numeric characters
            const quantityStr = data.quantity.toString().trim();
            if (!/^\d+$/.test(quantityStr)) {
                errors.quantity = 'Quantity must be a number only (no letters or special characters)';
            } else {
                const quantityNum = parseInt(quantityStr);
                if (isNaN(quantityNum) || quantityNum <= 0) {
                    errors.quantity = t('warehouseManagement.forms.errors.quantityPositive');
                } else {
                    // Check if export quantity exceeds current stock
                    const selectedWarehouseItem = warehouseItems.find(item => item.book_id === parseInt(data.book_id));
                    if (selectedWarehouseItem && quantityNum > selectedWarehouseItem.quantity) {
                        errors.quantity = t('warehouseManagement.forms.errors.quantityExceed', {
                            stock: numberFormatter.format(selectedWarehouseItem.quantity)
                        });
                    }
                }
            }
        }
        
        if (!data.reason.trim()) {
            errors.reason = t('warehouseManagement.forms.errors.reasonRequired');
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
                    setImportForm({ book_id: '', quantity: '', reason: defaultImportReason });
                    setShowImportModal(false);
                    setImportErrors({});
                    if (window.showToast) {
                        const message = (result.message && result.message !== 'Success' && result.message !== 'success') 
                            ? result.message 
                            : t('warehouseManagement.messages.importSuccess');
                        window.showToast(message, 'success');
                    }
                } else {
                    if (window.showToast) {
                        window.showToast(result.message || t('warehouseManagement.messages.importError'), 'error');
                    }
                }
            } else {
                // Create new item
                const result = await createWarehouseItem({ book_id: bookId, quantity });
                
                if (result.success) {
                    // Refresh data with current pagination
                    await loadWarehouseOnly(currentPage, itemsPerPage, searchTerm);
                    setImportForm({ book_id: '', quantity: '', reason: defaultImportReason });
                    setShowImportModal(false);
                    setImportErrors({});
                    if (window.showToast) {
                        const message = (result.message && result.message !== 'Success' && result.message !== 'success') 
                            ? result.message 
                            : t('warehouseManagement.messages.importSuccess');
                        window.showToast(message, 'success');
                    }
                } else {
                    if (window.showToast) {
                        window.showToast(result.message || t('warehouseManagement.messages.importError'), 'error');
                    }
                }
            }
        } catch (error) {
            console.error('Error importing:', error);
            if (window.showToast) {
                window.showToast(t('warehouseManagement.messages.importError'), 'error');
            }
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
                if (window.showToast) {
                    window.showToast(t('warehouseManagement.messages.notFound'), 'error');
                }
                return;
            }

            // Check if enough stock
            if (existingItem.quantity < quantity) {
                if (window.showToast) {
                    window.showToast(t('warehouseManagement.messages.insufficient', {
                        stock: numberFormatter.format(existingItem.quantity)
                    }), 'error');
                }
                return;
            }

            // Update warehouse item
            const newQuantity = existingItem.quantity - quantity;
            const result = await updateWarehouseItem(bookId, { quantity: newQuantity });
            
            if (result.success) {
                // Refresh data with current pagination
                await loadWarehouseOnly(currentPage, itemsPerPage, searchTerm);
                setExportForm({ book_id: '', quantity: '', reason: defaultExportReason });
                setShowExportModal(false);
                setExportErrors({});
                if (window.showToast) {
                    const message = (result.message && result.message !== 'Success' && result.message !== 'success') 
                        ? result.message 
                        : t('warehouseManagement.messages.exportSuccess');
                    window.showToast(message, 'success');
                }
            } else {
                if (window.showToast) {
                    window.showToast(result.message || t('warehouseManagement.messages.exportError'), 'error');
                }
            }
        } catch (error) {
            console.error('Error exporting:', error);
            if (window.showToast) {
                window.showToast(t('warehouseManagement.messages.exportError'), 'error');
            }
        }
    };

    const getStockStatus = (quantity) => {
        if (quantity === 0) return { class: 'bg-danger text-white', text: t('warehouseManagement.statuses.out') };
        if (quantity < 10) return { class: 'bg-warning text-dark', text: t('warehouseManagement.statuses.low') };
        if (quantity < 50) return { class: 'bg-info text-white', text: t('warehouseManagement.statuses.medium') };
        return { class: 'bg-success text-white', text: t('warehouseManagement.statuses.good') };
    };

    const totalQuantity = summary?.totalQuantity ?? warehouseItems.reduce((sum, item) => sum + Math.max(item.quantity, 0), 0);
    const totalProducts = summary?.totalProducts ?? (pagination?.totalItems ?? warehouseItems.length);
    const lowStockCount = summary?.lowStock ?? warehouseItems.filter(item => item.quantity > 0 && item.quantity < 10).length;
    const outOfStockCount = summary?.outOfStock ?? warehouseItems.filter(item => item.quantity <= 0).length;
    const perPage = pagination?.itemsPerPage || itemsPerPage;
    const currentDisplayPage = pagination?.currentPage || currentPage;
    const totalItemsCount = pagination?.totalItems ?? warehouseItems.length;
    const totalPagesCount = pagination?.totalPages || Math.max(1, Math.ceil(totalItemsCount / perPage));
    const paginationSummaryStart = totalItemsCount === 0 ? 0 : (currentDisplayPage - 1) * perPage + 1;
    const paginationSummaryEnd = Math.min(currentDisplayPage * perPage, totalItemsCount);

    useEffect(() => {
        setImportForm((prev) => ({
            ...prev,
            reason: prev.reason === previousImportDefault.current ? defaultImportReason : prev.reason
        }));
        previousImportDefault.current = defaultImportReason;
    }, [defaultImportReason]);

    useEffect(() => {
        setExportForm((prev) => ({
            ...prev,
            reason: prev.reason === previousExportDefault.current ? defaultExportReason : prev.reason
        }));
        previousExportDefault.current = defaultExportReason;
    }, [defaultExportReason]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('warehouseManagement.table.loading')}</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* CSS để fix cột không bị lệch và smooth transitions */}
            <style jsx="true">{`
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
                    /* Hover effects removed */
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
                
                /* Badge status styles */
                .badge {
                    padding: 0.5em 0.75em;
                    font-weight: 600;
                    border-radius: 0.375rem;
                    font-size: 0.875rem;
                }
                
                .badge.bg-danger {
                    background-color: #dc3545 !important;
                    color: #ffffff !important;
                }
                
                .badge.bg-warning {
                    background-color: #ffc107 !important;
                    color: #000000 !important;
                }
                
                .badge.bg-info {
                    background-color: #0dcaf0 !important;
                    color: #000000 !important;
                }
                
                .badge.bg-success {
                    background-color: #198754 !important;
                    color: #ffffff !important;
                }
            `}</style>
            
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">{t('warehouseManagement.title')}</h2>
                <div>
                    <button
                        className="btn btn-success me-2"
                        onClick={() => setShowImportModal(true)}
                    >
                        <i className="fas fa-plus me-2"></i>
                        {t('warehouseManagement.importButton')}
                    </button>
                    <button
                        className="btn btn-warning"
                        onClick={() => setShowExportModal(true)}
                    >
                        <i className="fas fa-minus me-2"></i>
                        {t('warehouseManagement.exportButton')}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <i className="fas fa-boxes text-primary fs-1 mb-2"></i>
                            <h4 className="fw-bold">{numberFormatter.format(totalQuantity)}</h4>
                            <p className="text-muted mb-0">{t('warehouseManagement.stats.totalQuantity')}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <i className="fas fa-exclamation-triangle text-warning fs-1 mb-2"></i>
                            <h4 className="fw-bold">{numberFormatter.format(lowStockCount)}</h4>
                            <p className="text-muted mb-0">{t('warehouseManagement.stats.lowStock')}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <i className="fas fa-times-circle text-danger fs-1 mb-2"></i>
                            <h4 className="fw-bold">{numberFormatter.format(outOfStockCount)}</h4>
                            <p className="text-muted mb-0">{t('warehouseManagement.stats.outOfStock')}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                            <i className="fas fa-chart-line text-success fs-1 mb-2"></i>
                            <h4 className="fw-bold">{numberFormatter.format(totalProducts)}</h4>
                            <p className="text-muted mb-0">{t('warehouseManagement.stats.totalProducts')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Warehouse Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold text-dark mb-0">
                        <i className="fas fa-warehouse text-primary me-2"></i>
                        {t('warehouseManagement.table.title')}
                    </h5>
                </div>

                <div className="card-body p-0">
                    {/* Search Bar and Total Count */}
                    <div className="p-3 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-3">
                                <span className="text-muted">
                                    <i className="fas fa-boxes me-1"></i>
                                    {t('warehouseManagement.pagination.summary', {
                                        start: numberFormatter.format(1),
                                        end: numberFormatter.format(1),
                                        total: numberFormatter.format(totalProducts)
                                    }).split(':')[0]}
                                    : <strong className="text-primary">{numberFormatter.format(totalProducts)}</strong>
                                </span>
                                <span className="text-muted">
                                    {t('bookManagement.stats.pageLabel', {
                                        current: currentDisplayPage,
                                        total: totalPagesCount
                                    })}
                                </span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                                <label className="text-muted small">{t('warehouseManagement.itemsPerPage')}</label>
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
                                placeholder={t('warehouseManagement.searchPlaceholder')}
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
                                    <th style={{ width: '40%' }} className="py-3 fw-semibold text-secondary text-start ps-3">{t('warehouseManagement.table.headers.book')}</th>
                                    <th style={{ width: '15%' }} className="py-3 fw-semibold text-secondary">{t('warehouseManagement.table.headers.quantity')}</th>
                                    <th style={{ width: '15%' }} className="py-3 fw-semibold text-secondary">{t('warehouseManagement.table.headers.status')}</th>
                                    <th style={{ width: '20%' }} className="py-3 fw-semibold text-secondary">{t('warehouseManagement.table.headers.updatedAt')}</th>
                                    <th style={{ width: '10%' }} className="py-3 fw-semibold text-secondary">{t('warehouseManagement.table.headers.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="visually-hidden">{t('warehouseManagement.table.loading')}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-danger">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            {error || t('warehouseManagement.table.error')}
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
                                                        {item.author_name && `${t('warehouseManagement.labels.author')}: ${item.author_name}`}
                                                        {item.category_name && ` • ${t('warehouseManagement.labels.category')}: ${item.category_name}`}
                                                    </small>
                                                </td>
                                                <td className="text-center">
                                                    <span className="fw-bold fs-5">{numberFormatter.format(item.quantity)}</span>
                                                </td>
                                                <td className="text-center">
                                                    <span className={`badge ${stockStatus.class}`}>
                                                        {stockStatus.text}
                                                    </span>
                                                </td>
                                                <td className="text-muted small">
                                                    {new Date(item.last_updated).toLocaleString(locale)}
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
                                                        {t('warehouseManagement.actions.export')}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-muted py-4">
                                            <i className="fas fa-inbox fa-2x mb-2"></i>
                                            <div>{t('warehouseManagement.table.empty')}</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPagesCount > 1 && (
                        <div className="d-flex justify-content-between align-items-center p-3 border-top">
                            <div className="text-muted small">
                                {t('warehouseManagement.pagination.summary', {
                                    start: numberFormatter.format(paginationSummaryStart),
                                    end: numberFormatter.format(paginationSummaryEnd),
                                    total: numberFormatter.format(totalItemsCount)
                                })}
                            </div>
                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${!pagination.hasPrevPage || false ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(1)}
                                            disabled={!pagination.hasPrevPage || false}
                                            title={t('warehouseManagement.pagination.first')}
                                        >
                                            <i className="fas fa-angle-double-left"></i>
                                        </button>
                                    </li>
                                    <li className={`page-item ${!pagination.hasPrevPage || false ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(currentDisplayPage - 1)}
                                            disabled={!pagination.hasPrevPage}
                                            title={t('warehouseManagement.pagination.previous')}
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                    </li>
                                    
                                    {/* Show page numbers */}
                                    {Array.from({ length: Math.min(5, totalPagesCount) }, (_, i) => {
                                        let pageNum;
                                        if (totalPagesCount <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentDisplayPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentDisplayPage >= totalPagesCount - 2) {
                                            pageNum = totalPagesCount - 4 + i;
                                        } else {
                                            pageNum = currentDisplayPage - 2 + i;
                                        }
                                        
                                        return (
                                        <li key={pageNum} className={`page-item ${currentDisplayPage === pageNum ? 'active' : ''}`}>
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
                                            onClick={() => handlePageChange(currentDisplayPage + 1)}
                                            disabled={!pagination.hasNextPage}
                                            title={t('warehouseManagement.pagination.next')}
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </li>
                                    <li className={`page-item ${!pagination.hasNextPage || false ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(totalPagesCount)}
                                            disabled={!pagination.hasNextPage}
                                            title={t('warehouseManagement.pagination.last')}
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
                                <h5 className="modal-title">{t('warehouseManagement.forms.import.title')}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowImportModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleImport}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">{t('warehouseManagement.forms.import.bookLabel')}</label>
                                        <select
                                            className={`form-select ${importErrors.book_id ? 'is-invalid' : ''}`}
                                            value={importForm.book_id}
                                            onChange={(e) => setImportForm({ ...importForm, book_id: e.target.value })}
                                        >
                                            <option value="">{t('warehouseManagement.forms.placeholders.selectBook')}</option>
                                            {books.map(book => (
                                                <option key={book.book_id} value={book.book_id}>
                                                    {book.title}
                                                </option>
                                            ))}
                                        </select>
                                        {importErrors.book_id && (
                                            <div className="invalid-feedback">{importErrors.book_id}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">{t('warehouseManagement.forms.import.quantityLabel')}</label>
                                        <input
                                            type="text"
                                            className={`form-control ${importErrors.quantity ? 'is-invalid' : ''}`}
                                            value={importForm.quantity}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Only allow numbers
                                                if (value === '' || /^\d+$/.test(value)) {
                                                    const updatedForm = { ...importForm, quantity: value };
                                                    setImportForm(updatedForm);
                                                    // Clear error when user starts typing
                                                    if (importErrors.quantity) {
                                                        setImportErrors({ ...importErrors, quantity: '' });
                                                    }
                                                }
                                            }}
                                            onBlur={(e) => {
                                                // Validate on blur with current value
                                                const value = e.target.value;
                                                const testForm = { ...importForm, quantity: value };
                                                const errors = validateImportForm(testForm);
                                                if (errors.quantity) {
                                                    setImportErrors({ ...importErrors, quantity: errors.quantity });
                                                }
                                            }}
                                        />
                                        {importErrors.quantity && (
                                            <div className="invalid-feedback">{importErrors.quantity}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">{t('warehouseManagement.forms.import.reasonLabel')}</label>
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
                                        {t('warehouseManagement.forms.buttons.cancel')}
                                    </button>
                                    <button type="submit" className="btn btn-success">
                                        {t('warehouseManagement.forms.import.submit')}
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
                                <h5 className="modal-title">Dispatch Stock</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowExportModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleExport}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">{t('warehouseManagement.forms.export.bookLabel')}</label>
                                        <select
                                            className={`form-select ${exportErrors.book_id ? 'is-invalid' : ''}`}
                                            value={exportForm.book_id}
                                            onChange={(e) => setExportForm({ ...exportForm, book_id: e.target.value })}
                                        >
                                            <option value="">{t('warehouseManagement.forms.placeholders.selectBook')}</option>
                                            {books.map(book => (
                                                <option key={book.book_id} value={book.book_id}>
                                                    {book.title}
                                                </option>
                                            ))}
                                        </select>
                                        {exportErrors.book_id && (
                                            <div className="invalid-feedback">{exportErrors.book_id}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">{t('warehouseManagement.forms.export.quantityLabel')}</label>
                                        <input
                                            type="text"
                                            className={`form-control ${exportErrors.quantity ? 'is-invalid' : ''}`}
                                            value={exportForm.quantity}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Only allow numbers
                                                if (value === '' || /^\d+$/.test(value)) {
                                                    const updatedForm = { ...exportForm, quantity: value };
                                                    setExportForm(updatedForm);
                                                    // Clear error when user starts typing
                                                    if (exportErrors.quantity) {
                                                        setExportErrors({ ...exportErrors, quantity: '' });
                                                    }
                                                }
                                            }}
                                            onBlur={(e) => {
                                                // Validate on blur with current value
                                                const value = e.target.value;
                                                const testForm = { ...exportForm, quantity: value };
                                                const errors = validateExportForm(testForm);
                                                if (errors.quantity) {
                                                    setExportErrors({ ...exportErrors, quantity: errors.quantity });
                                                }
                                            }}
                                        />
                                        {exportErrors.quantity && (
                                            <div className="invalid-feedback">{exportErrors.quantity}</div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">{t('warehouseManagement.forms.export.reasonLabel')}</label>
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
                                        {t('warehouseManagement.forms.buttons.cancel')}
                                    </button>
                                    <button type="submit" className="btn btn-warning">
                                        {t('warehouseManagement.forms.export.submit')}
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
