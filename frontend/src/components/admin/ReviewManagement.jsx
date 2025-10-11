import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash, faSearch, faEye, faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import apiService from '../../services';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRating, setFilterRating] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [actionType, setActionType] = useState(''); // 'view', 'delete'
    const [formErrors, setFormErrors] = useState({});

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20); // Tăng default để hiển thị nhiều hơn
    const [isPageChanging, setIsPageChanging] = useState(false);

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
                    console.log('✅ Using real review data from API:', reviewsData.length, 'reviews');
                    console.log('📊 Sample review data:', reviewsData[0]);
                } else if (response && Array.isArray(response)) {
                    // Fallback: nếu response trực tiếp là array
                    reviewsData = response;
                    console.log('✅ Using real review data from API (fallback):', reviewsData.length, 'reviews');
                } else {
                    console.log('⚠️ No reviews found in database or invalid response structure');
                    console.log('Response structure:', typeof response, response);
                }
                
                setReviews(reviewsData);
            } catch (error) {
                console.error('💥 [ReviewManagement] Error fetching reviews:', error);
                console.error('💥 [ReviewManagement] Error details:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                });

                // Hiển thị thông báo lỗi chi tiết
                let errorMessage = 'Không thể tải danh sách đánh giá';
                if (error.message.includes('fetch')) {
                    errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.';
                } else if (error.message.includes('401')) {
                    errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
                } else if (error.message.includes('403')) {
                    errorMessage = 'Bạn không có quyền truy cập trang này.';
                } else if (error.message.includes('404')) {
                    errorMessage = 'API endpoint không tồn tại.';
                } else if (error.message.includes('500')) {
                    errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
                } else if (error.message && error.message.includes('admin')) {
                    errorMessage = '🔐 Bạn cần đăng nhập với tài khoản admin để xem tất cả đánh giá. Hiện tại đang sử dụng dữ liệu mẫu.';
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
    const filteredReviews = reviews.filter(review => {
        const userName = review.user_name || review.username || 'N/A';
        const userEmail = review.user_email || review.user_email || 'N/A';
        const bookTitle = review.book_title || review.title || 'N/A';
        const bookAuthor = review.book_author || review.author_name || (typeof review.author === 'object' ? review.author?.name : review.author) || 'N/A';
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

        setIsPageChanging(true);

        // Smooth transition with slight delay
        setTimeout(() => {
            setCurrentPage(page);
            setIsPageChanging(false);
        }, 150);
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
            if (window.confirm(`Bạn có chắc chắn muốn xóa đánh giá này?`)) {
                try {
                    console.log('Deleting review:', selectedReview.review_id);

                    // Sử dụng apiService để xóa review
                    await apiService.deleteReview(selectedReview.review_id);

                    // Remove review from local state
                    setReviews(prev => prev.filter(review => review.review_id !== selectedReview.review_id));
                    setShowModal(false);

                    if (window.showToast) {
                        window.showToast('Đánh giá đã được xóa thành công!', 'success');
                    }
                } catch (error) {
                    console.error('Error deleting review:', error);
                    if (window.showToast) {
                        window.showToast('Có lỗi xảy ra khi xóa đánh giá!', 'error');
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
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('vi-VN');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'N/A';
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
                    <span className="visually-hidden">Đang tải...</span>
                </div>
                <p className="mt-3 text-muted">Đang tải danh sách đánh giá từ database...</p>
                <small className="text-muted">Có thể mất vài giây để tải 5000+ đánh giá</small>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">
                        <FontAwesomeIcon icon={faStar} className="me-2 text-warning" />
                        Quản lý đánh giá
                    </h2>
                    <p className="text-muted mb-0">Quản lý đánh giá sản phẩm từ khách hàng</p>
                </div>
                <div className="d-flex align-items-center">
                    <span className="badge bg-warning">
                        Tổng: {reviews.length.toLocaleString()} đánh giá
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Tìm kiếm</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm theo tên, email, sách, tác giả..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Đánh giá</label>
                            <select
                                className="form-select"
                                value={filterRating}
                                onChange={(e) => handleFilterChange('rating', e.target.value)}
                            >
                                <option value="all">Tất cả đánh giá</option>
                                <option value="5">5 sao</option>
                                <option value="4">4 sao</option>
                                <option value="3">3 sao</option>
                                <option value="2">2 sao</option>
                                <option value="1">1 sao</option>
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
                                    Xóa bộ lọc
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="card">
                <div className="card-body position-relative">
                    {/* Loading overlay for page changes */}
                    {isPageChanging && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                zIndex: 10,
                                borderRadius: '0.375rem'
                            }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang chuyển trang...</span>
                            </div>
                        </div>
                    )}

                    <div className="table-responsive" style={{ minHeight: '400px' }}>
                        <table
                            className="table table-hover"
                            style={{
                                transition: 'opacity 0.2s ease-in-out',
                                opacity: isPageChanging ? 0.7 : 1
                            }}
                        >
                            <thead className="table-light">
                                <tr>
                                    <th>Người dùng</th>
                                    <th>Sản phẩm</th>
                                    <th>Đánh giá</th>
                                    <th>Nội dung</th>
                                    <th>Ngày tạo</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentReviews.map((review) => (
                                    <tr key={review.review_id}>
                                        <td>
                                            <div>
                                                <div className="fw-bold">{review.user_name || review.username || 'N/A'}</div>
                                                <small className="text-muted">{review.user_email || 'N/A'}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div className="fw-bold">{review.book_title || review.title || 'N/A'}</div>
                                                <small className="text-muted">Tác giả: {review.book_author || review.author_name || (typeof review.author === 'object' ? review.author?.name : review.author) || 'N/A'}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="me-2">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="badge bg-warning text-white">
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
                                                        'Không có nội dung'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                        <td>
                                            <small className="text-muted">
                                                {formatDate(review.created_at)}
                                            </small>
                                        </td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button
                                                    className="btn btn-outline-info btn-sm"
                                                    onClick={() => handleModalAction(review, 'view')}
                                                    title="Xem chi tiết"
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleModalAction(review, 'delete')}
                                                    title="Xóa đánh giá"
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
                            <p className="text-muted">Không tìm thấy đánh giá nào</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredReviews.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="d-flex align-items-center">
                                <span className="text-muted me-3">
                                    Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredReviews.length).toLocaleString()} trong {filteredReviews.length.toLocaleString()} kết quả
                                </span>
                                <div className="d-flex align-items-center">
                                    <label className="form-label me-2 mb-0">Hiển thị:</label>
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
                                                disabled={currentPage === 1 || isPageChanging}
                                                style={{ transition: 'all 0.2s ease' }}
                                            >
                                                Trước
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
                                                        disabled={isPageChanging}
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
                                                disabled={currentPage === totalPages || isPageChanging}
                                                style={{ transition: 'all 0.2s ease' }}
                                            >
                                                Sau
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
                                    {actionType === 'view' && 'Chi tiết đánh giá'}
                                    {actionType === 'delete' && 'Xóa đánh giá'}
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
                                                    Thông tin người dùng
                                                </h6>
                                                <p><strong>Tên:</strong> {selectedReview.user_name || selectedReview.username || 'N/A'}</p>
                                                <p><strong>Email:</strong> {selectedReview.user_email || 'N/A'}</p>
                                                <p><strong>ID:</strong> {selectedReview.user_id}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <h6>
                                                    <FontAwesomeIcon icon={faBook} className="me-2" />
                                                    Thông tin sản phẩm
                                                </h6>
                                                <p><strong>Tên sách:</strong> {selectedReview.book_title || selectedReview.title || 'N/A'}</p>
                                                <p><strong>Tác giả:</strong> {selectedReview.book_author || selectedReview.author_name || (typeof selectedReview.author === 'object' ? selectedReview.author?.name : selectedReview.author) || 'N/A'}</p>
                                                <p><strong>ID sách:</strong> {selectedReview.book_id}</p>
                                            </div>
                                            <div className="col-12 mt-3">
                                                <h6>
                                                    <FontAwesomeIcon icon={faStar} className="me-2" />
                                                    Đánh giá
                                                </h6>
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="me-2">
                                                        {renderStars(selectedReview.rating)}
                                                    </div>
                                                    <span className="badge bg-warning text-dark fs-6">
                                                        {selectedReview.rating}/5 sao
                                                    </span>
                                                </div>
                                                <p><strong>Nội dung:</strong></p>
                                                <div className="border p-3 rounded bg-light">
                                                    {selectedReview.review_text || 'Không có nội dung đánh giá'}
                                                </div>
                                                <p className="mt-2 mb-0">
                                                    <strong>Ngày tạo:</strong> {formatDate(selectedReview.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {actionType === 'delete' && (
                                        <div className="alert alert-warning">
                                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                                            <strong>Cảnh báo:</strong> Bạn sắp xóa vĩnh viễn đánh giá này. Hành động này không thể hoàn tác!
                                        </div>
                                    )}

                                    {actionType === 'delete' && selectedReview && (
                                        <div className="mb-3">
                                            <h6>Thông tin đánh giá sẽ bị xóa:</h6>
                                            <div className="border p-3 rounded bg-light">
                                                <p><strong>Người dùng:</strong> {selectedReview.user_name || selectedReview.username || 'N/A'}</p>
                                                <p><strong>Sách:</strong> {selectedReview.book_title || selectedReview.title || 'N/A'}</p>
                                                <p><strong>Đánh giá:</strong> {selectedReview.rating}/5 sao</p>
                                                <p><strong>Nội dung:</strong> {selectedReview.review_text || 'Không có nội dung'}</p>
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
                                        Hủy
                                    </button>
                                    {actionType === 'delete' && (
                                        <button
                                            type="submit"
                                            className="btn btn-danger"
                                        >
                                            Xóa đánh giá
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
