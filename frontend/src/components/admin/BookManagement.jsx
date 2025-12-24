import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useBookManagement } from '../../hooks/useBookManagement';
import { useTranslation } from 'react-i18next';

const BookManagement = () => {
    const {
        books,
        categories,
        authors,
        publishers,
        loading,
        error,
        pagination,
        createBook,
        updateBook,
        deleteBook,
        loadBooksOnly
    } = useBookManagement();

    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0
            }),
        [locale]
    );

    const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const searchTimeoutRef = useRef(null);
    const slugManuallyEditedRef = useRef(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        author_id: '',
        publisher_id: '',
        published_date: '',
        cover_image: '',
        slug: ''
    });

    const formatCurrency = (amount) => currencyFormatter.format(Number(amount || 0));
    const formatNumber = (value) => numberFormatter.format(Number(value || 0));

    const handleSearch = useCallback(
        async (searchValue) => {
            setSearchTerm(searchValue);
            setCurrentPage(1);

            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            searchTimeoutRef.current = setTimeout(async () => {
                await loadBooksOnly(1, itemsPerPage, searchValue);
            }, 300);
        },
        [itemsPerPage, loadBooksOnly]
    );

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Auto-generate slug from title (both create and edit)
    useEffect(() => {
        // Only auto-generate if slug hasn't been manually edited
        if (!slugManuallyEditedRef.current) {
            const formatSlug = (text) => {
                if (!text || !text.trim()) return '';
                return text
                    .toLowerCase()
                    .replace(/đ/g, 'd') // Replace đ with d before normalize
                    .replace(/Đ/g, 'd') // Replace Đ with d before normalize
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Remove Vietnamese diacritics
                    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                    .replace(/\s+/g, '-') // Replace spaces with hyphens
                    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
                    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
                    .trim();
            };
            
            // Auto-generate slug from title (works for both create and edit)
            // When title is empty, slug is also empty
            const generatedSlug = formatSlug(formData.title);
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.title]);

    const handlePageChange = async (page) => {
        if (page === currentPage) return;
        setCurrentPage(page);
        await loadBooksOnly(page, itemsPerPage, searchTerm, false);
    };

    const handleItemsPerPageChange = async (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
        await loadBooksOnly(1, newItemsPerPage, searchTerm);
    };

    const validateForm = (data) => {
        const errors = {};
        if (!data.title || data.title.trim().length < 2) {
            errors.title = t('bookManagement.form.errors.title');
        }
        if (!data.slug || data.slug.trim().length < 2) {
            errors.slug = t('bookManagement.form.errors.slug');
        }
        if (!data.price || data.price <= 0) {
            errors.price = t('bookManagement.form.errors.price');
        }
        if (!data.stock || data.stock < 0) {
            errors.stock = t('bookManagement.form.errors.stock');
        }
        if (!data.category_id) {
            errors.category_id = t('bookManagement.form.errors.category');
        }
        if (!data.author_id) {
            errors.author_id = t('bookManagement.form.errors.author');
        }
        if (!data.publisher_id) {
            errors.publisher_id = t('bookManagement.form.errors.publisher');
        }
        if (!data.description || data.description.trim() === '') {
            errors.description = 'Description is required';
        }
        return errors;
    };

    const handleAddBook = () => {
        setEditingBook(null);
        slugManuallyEditedRef.current = false; // Reset flag when adding new book
        setFormData({
            title: '',
            description: '',
            price: '',
            stock: '',
            category_id: '',
            author_id: '',
            publisher_id: '',
            published_date: '',
            cover_image: '',
            slug: ''
        });
        setFormErrors({});
        setShowModal(true);
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        if (dateString.includes('T')) {
            return dateString.split('T')[0];
        }
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString;
        }
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const handleEditBook = (book) => {
        setEditingBook(book);
        slugManuallyEditedRef.current = false; // Reset flag when editing book
        setFormData({
            title: book.title || '',
            description: book.description || '',
            price: book.price || '',
            stock: book.stock || '',
            category_id: book.category_id || '',
            author_id: book.author_id || '',
            publisher_id: book.publisher_id || '',
            published_date: book.published_date ? formatDateForInput(book.published_date) : '',
            cover_image: book.cover_image || '',
            slug: book.slug || ''
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleDeleteBook = async (bookId) => {
        if (window.confirm(t('bookManagement.confirm.delete'))) {
            try {
                const result = await deleteBook(bookId);
                if (result.success) {
                    await loadBooksOnly(currentPage, itemsPerPage, searchTerm);
                    alert(result.message || t('bookManagement.messages.deleteSuccess'));
                } else {
                    alert(result.message || t('bookManagement.messages.deleteError'));
                }
            } catch (err) {
                console.error('Error deleting book:', err);
                alert(t('bookManagement.messages.deleteError'));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Format slug: normalize, remove diacritics, replace spaces with hyphens
        const formatSlug = (text) => {
            if (!text) return '';
            return text
                .toLowerCase()
                .replace(/đ/g, 'd') // Replace đ with d before normalize
                .replace(/Đ/g, 'd') // Replace Đ with d before normalize
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remove Vietnamese diacritics
                .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
                .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
                .trim();
        };

        const finalSlug = formData.slug 
            ? formatSlug(formData.slug) 
            : formatSlug(formData.title);

        const bookData = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10),
            category_id: parseInt(formData.category_id, 10),
            author_id: parseInt(formData.author_id, 10),
            publisher_id: parseInt(formData.publisher_id, 10),
            slug: finalSlug
        };

        try {
            const result = editingBook
                ? await updateBook(editingBook.book_id, bookData)
                : await createBook(bookData);

            if (result.success) {
                setShowModal(false);
                setFormErrors({});
                setFormData({
                    title: '',
                    description: '',
                    price: '',
                    stock: '',
                    category_id: '',
                    author_id: '',
                    publisher_id: '',
                    published_date: '',
                    cover_image: '',
                    slug: ''
                });
                await loadBooksOnly(currentPage, itemsPerPage, searchTerm);
                alert(
                    result.message ||
                        (editingBook
                            ? t('bookManagement.messages.updateSuccess')
                            : t('bookManagement.messages.createSuccess'))
                );
            } else {
                alert(result.message || t('bookManagement.messages.saveError'));
            }
        } catch (err) {
            console.error('Error saving book:', err);
            alert(t('bookManagement.messages.saveError'));
        }
    };

    const totalItems = pagination.totalItems || 0;
    const totalPages = pagination.totalPages || 1;
    const current = pagination.currentPage || 1;
    const perPage = pagination.itemsPerPage || itemsPerPage;
    const summaryStart = totalItems === 0 ? 0 : (current - 1) * perPage + 1;
    const summaryEnd = Math.min(current * perPage, totalItems);

    return (
        <div className="card border-0 shadow-sm rounded-3">
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
            `}</style>
            
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
                <h2 className="fw-bold text-dark mb-0" style={{fontSize: '1.75rem'}}>
                    <i className="fas fa-book-open text-primary me-2"></i>
                    {t('bookManagement.title')}
                </h2>
                <button className="btn btn-primary btn-sm" onClick={handleAddBook}>
                    <i className="fas fa-plus me-1"></i> {t('bookManagement.addButton')}
                </button>
            </div>

            <div className="card-body p-0">
                {/* Search Bar and Total Count */}
                <div className="p-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-muted">
                                {t('bookManagement.stats.totalLabel')}{' '}
                                <strong className="text-primary">{formatNumber(totalItems)}</strong>
                            </span>
                            <span className="text-muted">
                                {t('bookManagement.stats.pageLabel', {
                                    current,
                                    total: totalPages
                                })}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <label className="text-muted small">{t('bookManagement.itemsPerPage')}</label>
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
                            placeholder={t('bookManagement.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {searchTerm && (
                            <button type="button" className="btn btn-outline-secondary" onClick={() => handleSearch('')}>
                                <i className="fas fa-times" aria-hidden="true"></i>
                                <span className="visually-hidden">{t('bookManagement.buttons.clearSearch')}</span>
                            </button>
                        )}
                    </div>
                </div>

                    <div className="table-responsive position-relative">
                    <table
                        className="table table-hover mb-0 align-middle text-center table-fixed"
                    >
                        <thead className="bg-light">
                            <tr>
                                <th style={{ width: "5%" }} className="py-3 fw-semibold text-secondary">{t('bookManagement.table.headers.id')}</th>
                                <th style={{ width: "25%" }} className="py-3 fw-semibold text-secondary text-start ps-3">{t('bookManagement.table.headers.title')}</th>
                                <th style={{ width: "10%" }} className="py-3 fw-semibold text-secondary">{t('bookManagement.table.headers.price')}</th>
                                <th style={{ width: "10%" }} className="py-3 fw-semibold text-secondary">{t('bookManagement.table.headers.stock')}</th>
                                <th style={{ width: "10%" }} className="py-3 fw-semibold text-secondary">{t('bookManagement.table.headers.category')}</th>
                                <th style={{ width: "10%" }} className="py-3 fw-semibold text-secondary">{t('bookManagement.table.headers.author')}</th>
                                <th style={{ width: "10%" }} className="py-3 fw-semibold text-secondary">{t('bookManagement.table.headers.publisher')}</th>
                                <th style={{ width: "15%" }} className="py-3 fw-semibold text-secondary">{t('bookManagement.table.headers.actions')}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">{t('bookManagement.table.loading')}</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-danger">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {error || t('bookManagement.table.error')}
                                    </td>
                                </tr>
                            ) : books.length > 0 ? (
                                books.map((book) => (
                                    <tr key={book.book_id} className="border-bottom">
                                        <td className="fw-semibold text-dark">{book.book_id}</td>
                                        <td className="text-start ps-3">
                                            <div className="fw-bold text-primary text-truncate" title={book.title}>
                                                {book.title}
                                            </div>
                                            <small className="text-muted text-truncate d-block">{book.description}</small>
                                        </td>
                                        <td className="fw-bold text-success">
                                            {formatCurrency(book.price)}
                                        </td>
                                        <td className="fw-semibold text-dark">
                                            {formatNumber(book.stock)}
                                        </td>
                                        <td className="fw-semibold text-dark">
                                            {book.category_name || t('bookManagement.fallback.category', { id: book.category_id })}
                                        </td>
                                        <td className="fw-semibold text-dark">
                                            {book.author_name || t('bookManagement.fallback.author', { id: book.author_id })}
                                        </td>
                                        <td className="fw-semibold text-dark">
                                            {book.publisher_name || t('bookManagement.fallback.publisher', { id: book.publisher_id })}
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => handleEditBook(book)}
                                                    title={t('bookManagement.actions.edit')}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDeleteBook(book.book_id)}
                                                    title={t('bookManagement.actions.delete')}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-muted py-4">
                                        <i className="fas fa-inbox fa-2x mb-2"></i>
                                        <div>{t('bookManagement.table.empty')}</div>
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
                            {t('bookManagement.pagination.summary', {
                                start: formatNumber(summaryStart),
                                end: formatNumber(summaryEnd),
                                total: formatNumber(totalItems)
                            })}
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${!pagination.hasPrevPage || false ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => handlePageChange(1)}
                                        disabled={!pagination.hasPrevPage || false}
                                        title={t('bookManagement.pagination.first')}
                                    >
                                        <i className="fas fa-angle-double-left"></i>
                                    </button>
                                </li>
                                <li className={`page-item ${!pagination.hasPrevPage || false ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={!pagination.hasPrevPage || false}
                                        title={t('bookManagement.pagination.previous')}
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
                                        title={t('bookManagement.pagination.next')}
                                    >
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </li>
                                <li className={`page-item ${!pagination.hasNextPage || false ? 'disabled' : ''}`}>
                                    <button 
                                        className="page-link" 
                                        onClick={() => handlePageChange(pagination.totalPages)}
                                        disabled={!pagination.hasNextPage || false}
                                        title={t('bookManagement.pagination.last')}
                                    >
                                        <i className="fas fa-angle-double-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* Modal thêm/sửa sách */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingBook ? t('bookManagement.form.titleEdit') : t('bookManagement.form.titleAdd')}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">{t('bookManagement.form.labels.title')}</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                            {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">{t('bookManagement.form.labels.slug')}</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.slug ? 'is-invalid' : ''}`}
                                                value={formData.slug}
                                                onChange={(e) => {
                                                    slugManuallyEditedRef.current = true; // Mark as manually edited
                                                    setFormData({ ...formData, slug: e.target.value });
                                                }}
                                                placeholder={t('bookManagement.form.placeholders.slug')}
                                            />
                                            {formErrors.slug && <div className="invalid-feedback">{formErrors.slug}</div>}
                                            <small className="form-text text-muted">
                                                {t('bookManagement.form.hints.slug')}
                                            </small>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">{t('bookManagement.form.labels.price')}</label>
                                            <input
                                                type="number"
                                                className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            />
                                            {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">{t('bookManagement.form.labels.stock')}</label>
                                            <input
                                                type="number"
                                                className={`form-control ${formErrors.stock ? 'is-invalid' : ''}`}
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            />
                                            {formErrors.stock && <div className="invalid-feedback">{formErrors.stock}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">{t('bookManagement.form.labels.category')}</label>
                                            <select
                                                className={`form-select ${formErrors.category_id ? 'is-invalid' : ''}`}
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            >
                                                <option value="">{t('bookManagement.form.select.category')}</option>
                                                {categories && categories.length > 0 ? (
                                                    categories.map(category => (
                                                        <option key={category.category_id} value={category.category_id}>
                                                            {category.name || t('bookManagement.fallback.category', { id: category.category_id })}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>{t('bookManagement.form.select.loadingCategories')}</option>
                                                )}
                                            </select>
                                            {formErrors.category_id && <div className="invalid-feedback">{formErrors.category_id}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">{t('bookManagement.form.labels.author')}</label>
                                            <select
                                                className={`form-select ${formErrors.author_id ? 'is-invalid' : ''}`}
                                                value={formData.author_id}
                                                onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                                            >
                                                <option value="">{t('bookManagement.form.select.author')}</option>
                                                {authors && authors.length > 0 ? (
                                                    authors.map(author => (
                                                        <option key={author.author_id} value={author.author_id}>
                                                            {author.name || t('bookManagement.fallback.author', { id: author.author_id })}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>{t('bookManagement.form.select.loadingAuthors')}</option>
                                                )}
                                            </select>
                                            {formErrors.author_id && <div className="invalid-feedback">{formErrors.author_id}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">{t('bookManagement.form.labels.publisher')}</label>
                                            <select
                                                className={`form-select ${formErrors.publisher_id ? 'is-invalid' : ''}`}
                                                value={formData.publisher_id}
                                                onChange={(e) => setFormData({ ...formData, publisher_id: e.target.value })}
                                            >
                                                <option value="">{t('bookManagement.form.select.publisher')}</option>
                                                {publishers && publishers.length > 0 ? (
                                                    publishers.map(publisher => (
                                                        <option key={publisher.publisher_id} value={publisher.publisher_id}>
                                                            {publisher.name || t('bookManagement.fallback.publisher', { id: publisher.publisher_id })}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>{t('bookManagement.form.select.loadingPublishers')}</option>
                                                )}
                                            </select>
                                            {formErrors.publisher_id && <div className="invalid-feedback">{formErrors.publisher_id}</div>}
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">{t('bookManagement.form.labels.description')}</label>
                                            <textarea
                                                className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                                                rows="3"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                            {formErrors.description && (
                                                <div className="invalid-feedback">{formErrors.description}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">{t('bookManagement.form.labels.publishedDate')}</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.published_date}
                                                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">{t('bookManagement.form.labels.coverImage')}</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                value={formData.cover_image}
                                                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                                                placeholder={t('bookManagement.form.placeholders.coverImage')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        {t('bookManagement.form.buttons.cancel')}
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingBook ? t('bookManagement.form.buttons.update') : t('bookManagement.form.buttons.create')}
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

export default BookManagement;
