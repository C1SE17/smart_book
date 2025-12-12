import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash, faSearch, faEye, faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import apiService from '../../services';
import { useTranslation } from 'react-i18next';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [actionType, setActionType] = useState(''); // 'view', 'delete'
    const [formErrors, setFormErrors] = useState({});
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Tăng default để hiển thị nhiều hơn

    // Fetch reviews from Backend API
    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                console.log('Fetching reviews from backend API...');

                // Sử dụng apiService để lấy danh sách reviews
                const response = await apiService.getAllReviews();
                console.log('Fetched reviews response from backend:', response);

                // Xử lý response structure từ baseApi
                let reviewsData = [];
                if (response && response.success && Array.isArray(response.data)) {
                    reviewsData = response.data;
                    console.log('Using real review data from API:', reviewsData.length, 'reviews');
                    console.log('Sample review data:', reviewsData[0]);
                } else if (response && Array.isArray(response)) {
                    // Fallback: nếu response trực tiếp là array
                    reviewsData = response;
                    console.log('Using real review data from API (fallback):', reviewsData.length, 'reviews');
                } else {
                    console.log('No reviews found in database or invalid response structure');
                    console.log('Response structure:', typeof response, response);
                }
                
                setReviews(reviewsData);
            } catch (error) {
                console.error('[ReviewManagement] Error fetching reviews:', error);
                console.error('[ReviewManagement] Error details:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                });

                // Hiển thị thông báo lỗi chi tiết
                let errorMessage = t('reviewManagement.errors.fetchGeneric');
                if (error.message.includes('fetch')) {
                    errorMessage = t('reviewManagement.errors.network');
                } else if (error.message.includes('401')) {
                    errorMessage = t('reviewManagement.errors.unauthorized');
                } else if (error.message.includes('403')) {
                    errorMessage = t('reviewManagement.errors.forbidden');
                } else if (error.message.includes('404')) {
                    errorMessage = t('reviewManagement.errors.notFound');
                } else if (error.message.includes('500')) {
                    errorMessage = t('reviewManagement.errors.server');
                } else if (error.message && error.message.includes('admin')) {
                    errorMessage = t('reviewManagement.errors.adminRequired');
                }

                // Hiển thị thông báo lỗi
                if (window.showToast) {
                    window.showToast(errorMessage, 'error');
                } else {
                    alert(errorMessage);
                }

                // Fallback to empty array on error
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Filter reviews based on search and filters
    const fallbackValue = t('reviewManagement.table.notAvailable');
    const filteredReviews = reviews.filter(review => {
        const userName = review.user_name || review.username || fallbackValue;
        const userEmail = review.user_email || review.user_email || fallbackValue;
        const bookTitle = review.book_title || review.title || fallbackValue;
        const bookAuthor = review.book_author || review.author_name || (typeof review.author === 'object' ? review.author?.name : review.author) || fallbackValue;
        const reviewText = review.review_text || '';

        const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            bookAuthor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reviewText.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;

        return matchesSearch && matchesRating;
    });

    // Pagination calculations
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentReviews = filteredReviews.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterRating, itemsPerPage]);

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle filter changes
    const handleFilterChange = (type, value) => {
        if (type === 'rating') {
            setFilterRating(value);
        }
    };

    // Pagination handlers
    const handlePageChange = (page) => {
        if (page === currentPage) return;
        
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                    pages.push('...');
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // Handle modal actions
    const handleModalAction = (review, action) => {
        setSelectedReview(review);
        setActionType(action);
        setShowModal(true);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (actionType === 'delete') {
            if (window.confirm(t('reviewManagement.confirm.delete'))) {
                try {
                    console.log('Deleting review:', selectedReview.review_id);

                    // Sử dụng apiService để xóa review
                    await apiService.deleteReview(selectedReview.review_id);

                    // Remove review from local state
                    setReviews(prev => prev.filter(review => review.review_id !== selectedReview.review_id));
                    setShowModal(false);

                    if (window.showToast) {
                        window.showToast(t('reviewManagement.messages.deleteSuccess'), 'success');
                    }
                } catch (error) {
                    console.error('Error deleting review:', error);
                    if (window.showToast) {
                        window.showToast(t('reviewManagement.messages.deleteError'), 'error');
                    }
                }
            }
        }
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedReview(null);
        setActionType('');
        setFormErrors({});
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return t('reviewManagement.table.notAvailable');
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return t('reviewManagement.table.notAvailable');
            return date.toLocaleDateString(locale);
        } catch (error) {
            console.error('Error formatting date:', error);
            return t('reviewManagement.table.notAvailable');
        }
    };

    // Render stars
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={i <= rating ? 'text-warning' : 'text-muted'}
                />
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('reviewManagement.loading.aria')}</span>
                </div>
                <p className="mt-3 text-muted">{t('reviewManagement.loading.message')}</p>
                <small className="text-muted">{t('reviewManagement.loading.hint')}</small>
            </div>
        );
    }

    return (
        <div className="container-fluid">
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
            `}</style>
            
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">
                        <FontAwesomeIcon icon={faStar} className="me-2 text-warning" />
                        {t('reviewManagement.title')}
                    </h2>
                    <p className="text-muted mb-0">{t('reviewManagement.subtitle')}</p>
                </div>
                <div className="d-flex align-items-center">
                    <span className="badge bg-dark">
                        {t('reviewManagement.badge.total', { count: reviews.length.toLocaleString(locale) })}
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">{t('reviewManagement.filters.search.label')}</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t('reviewManagement.filters.search.placeholder')}
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                {searchTerm && (
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary" 
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">{t('reviewManagement.filters.rating.label')}</label>
                            <select
                                className="form-select"
                                value={filterRating}
                                onChange={(e) => handleFilterChange('rating', e.target.value)}
                            >
                                <option value="all">{t('reviewManagement.filters.rating.options.all')}</option>
                                <option value="5">{t('reviewManagement.filters.rating.options.fiveStars')}</option>
                                <option value="4">{t('reviewManagement.filters.rating.options.fourStars')}</option>
                                <option value="3">{t('reviewManagement.filters.rating.options.threeStars')}</option>
                                <option value="2">{t('reviewManagement.filters.rating.options.twoStars')}</option>
                                <option value="1">{t('reviewManagement.filters.rating.options.oneStar')}</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">&nbsp;</label>
                            <div className="d-grid">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterRating('all');
                                    }}
                                >
                                    {t('reviewManagement.filters.reset')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive" style={{ minHeight: '400px' }}>
                        
                        <table
                            className="table table-hover table-fixed"
                            style={{ tableLayout: 'fixed', width: '100%' }}
                        >
                            <thead className="table-light">
                                <tr>
                                    <th>{t('reviewManagement.table.headers.user')}</th>
                                    <th>{t('reviewManagement.table.headers.product')}</th>
                                    <th>{t('reviewManagement.table.headers.rating')}</th>
                                    <th>{t('reviewManagement.table.headers.content')}</th>
                                    <th>{t('reviewManagement.table.headers.createdAt')}</th>
                                    <th className="text-center">{t('reviewManagement.table.headers.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentReviews.map((review) => (
                                    <tr key={review.review_id}>
                                        <td>
                                            <div>
                                                <div className="fw-bold">{review.user_name || review.username || t('reviewManagement.table.notAvailable')}</div>
                                                <small className="text-muted">{review.user_email || t('reviewManagement.table.notAvailable')}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div className="fw-bold">{review.book_title || review.title || t('reviewManagement.table.notAvailable')}</div>
                                                <small className="text-muted">
                                                    {t('reviewManagement.table.author', {
                                                        author: review.book_author || review.author_name || (typeof review.author === 'object' ? review.author?.name : review.author) || t('reviewManagement.table.notAvailable')
                                                    })}
                                                </small>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="me-2">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="badge bg-warning text-dark">
                                                    {review.rating}/5
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ maxWidth: '200px' }}>
                                                <p className="mb-0 small">
                                                    {review.review_text ?
                                                        (review.review_text.length > 100 ?
                                                            `${review.review_text.substring(0, 100)}...` :
                                                            review.review_text
                                                        ) :
                                                        t('reviewManagement.table.noContent')
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <small className="text-muted">
                                                {formatDate(review.created_at)}
                                            </small>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <button
                                                    className="btn btn-outline-info btn-sm"
                                                    onClick={() => handleModalAction(review, 'view')}
                                                    title={t('reviewManagement.table.actions.viewTooltip')}
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleModalAction(review, 'delete')}
                                                    title={t('reviewManagement.table.actions.deleteTooltip')}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {currentReviews.length === 0 && (
                        <div className="text-center py-4">
                            <FontAwesomeIcon icon={faStar} size="3x" className="text-muted mb-3" />
                            <p className="text-muted">{t('reviewManagement.table.empty')}</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredReviews.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="d-flex align-items-center">
                                <span className="text-muted me-3">
                                    {t('reviewManagement.pagination.summary', {
                                        start: (startIndex + 1).toLocaleString(locale),
                                        end: Math.min(endIndex, filteredReviews.length).toLocaleString(locale),
                                        total: filteredReviews.length.toLocaleString(locale)
                                    })}
                                </span>
                                <div className="d-flex align-items-center">
                                    <label className="form-label me-2 mb-0">{t('reviewManagement.pagination.itemsPerPage')}</label>
                                    <select
                                        className="form-select form-select-sm"
                                        style={{ width: 'auto' }}
                                        value={itemsPerPage}
                                        onChange={handleItemsPerPageChange}
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value={100}>100</option>
                                        <option value={200}>200</option>
                                    </select>
                                </div>
                            </div>

                            {totalPages > 1 && (
                                <nav>
                                    <ul className="pagination pagination-sm mb-0">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1 || false}
                                                style={{ transition: 'all 0.2s ease' }}
                                            >
                                                {t('reviewManagement.pagination.previous')}
                                            </button>
                                        </li>

                                        {getPageNumbers().map((page, index) => (
                                            <li key={index} className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                                                {page === '...' ? (
                                                    <span className="page-link">...</span>
                                                ) : (
                                                    <button
                                                        className="page-link"
                                                        onClick={() => handlePageChange(page)}
                                                        disabled={false}
                                                        style={{ transition: 'all 0.2s ease' }}
                                                    >
                                                        {page}
                                                    </button>
                                                )}
                                            </li>
                                        ))}

                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages || false}
                                                style={{ transition: 'all 0.2s ease' }}
                                            >
                                                {t('reviewManagement.pagination.next')}
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {actionType === 'view' && t('reviewManagement.modal.title.view')}
                                    {actionType === 'delete' && t('reviewManagement.modal.title.delete')}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {actionType === 'view' && selectedReview && (
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h6>
                                                    <FontAwesomeIcon icon={faUser} className="me-2" />
                                                    {t('reviewManagement.modal.sections.user')}
                                                </h6>
                                                <p><strong>{t('reviewManagement.modal.labels.userName')}</strong> {selectedReview.user_name || selectedReview.username || t('reviewManagement.table.notAvailable')}</p>
                                                <p><strong>{t('reviewManagement.modal.labels.userEmail')}</strong> {selectedReview.user_email || t('reviewManagement.table.notAvailable')}</p>
                                                <p><strong>{t('reviewManagement.modal.labels.userId')}</strong> {selectedReview.user_id}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <h6>
                                                    <FontAwesomeIcon icon={faBook} className="me-2" />
                                                    {t('reviewManagement.modal.sections.product')}
                                                </h6>
                                                <p><strong>{t('reviewManagement.modal.labels.bookTitle')}</strong> {selectedReview.book_title || selectedReview.title || t('reviewManagement.table.notAvailable')}</p>
                                                <p><strong>{t('reviewManagement.modal.labels.bookAuthor')}</strong> {selectedReview.book_author || selectedReview.author_name || (typeof selectedReview.author === 'object' ? selectedReview.author?.name : selectedReview.author) || t('reviewManagement.table.notAvailable')}</p>
                                                <p><strong>{t('reviewManagement.modal.labels.bookId')}</strong> {selectedReview.book_id}</p>
                                            </div>
                                            <div className="col-12 mt-3">
                                                <h6>
                                                    <FontAwesomeIcon icon={faStar} className="me-2" />
                                                    {t('reviewManagement.modal.sections.review')}
                                                </h6>
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="me-2">
                                                        {renderStars(selectedReview.rating)}
                                                    </div>
                                                    <span className="badge bg-warning text-dark fs-6">
                                                        {t('reviewManagement.modal.ratingBadge', { rating: selectedReview.rating })}
                                                    </span>
                                                </div>
                                                <p><strong>{t('reviewManagement.modal.labels.content')}</strong></p>
                                                <div className="border p-3 rounded bg-light">
                                                    {selectedReview.review_text || t('reviewManagement.modal.noContent')}
                                                </div>
                                                <p className="mt-2 mb-0">
                                                    <strong>{t('reviewManagement.modal.labels.createdAt')}</strong> {formatDate(selectedReview.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {actionType === 'delete' && (
                                        <div className="alert alert-warning">
                                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                                            <strong>{t('reviewManagement.modal.deleteWarning.title')}</strong> {t('reviewManagement.modal.deleteWarning.description')}
                                        </div>
                                    )}

                                    {actionType === 'delete' && selectedReview && (
                                        <div className="mb-3">
                                            <h6>{t('reviewManagement.modal.deleteSummary.heading')}</h6>
                                            <div className="border p-3 rounded bg-light">
                                                <p><strong>{t('reviewManagement.modal.labels.userName')}</strong> {selectedReview.user_name || selectedReview.username || t('reviewManagement.table.notAvailable')}</p>
                                                <p><strong>{t('reviewManagement.modal.labels.bookTitle')}</strong> {selectedReview.book_title || selectedReview.title || t('reviewManagement.table.notAvailable')}</p>
                                                <p><strong>{t('reviewManagement.modal.deleteSummary.rating')}</strong> {t('reviewManagement.modal.ratingBadge', { rating: selectedReview.rating })}</p>
                                                <p><strong>{t('reviewManagement.modal.labels.content')}</strong> {selectedReview.review_text || t('reviewManagement.modal.noContent')}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeModal}
                                    >
                                        {t('reviewManagement.modal.buttons.cancel')}
                                    </button>
                                    {actionType === 'delete' && (
                                        <button
                                            type="submit"
                                            className="btn btn-danger"
                                        >
                                            {t('reviewManagement.modal.buttons.delete')}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewManagement;
