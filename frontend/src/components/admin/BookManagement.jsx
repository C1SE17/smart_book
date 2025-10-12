import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useBookManagement } from '../../hooks/useBookManagement';

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
        searchBooks,
        refreshData,
        loadBooksOnly
    } = useBookManagement();

    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const searchTimeoutRef = useRef(null);
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

    // Debug logs - thêm vào đầu component
    console.log('📊 BookManagement Debug:', {
        books: books.length,
        categories: categories,
        authors: authors,
        publishers: publishers,
        loading,
        error,
        pagination
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
            await loadBooksOnly(1, itemsPerPage, searchValue);
        }, 300); // 300ms delay
    }, [itemsPerPage, loadBooksOnly]);

    // Cleanup timeout khi component unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Handle page change - chỉ load sách, không reload toàn bộ và không hiển thị loading
    const handlePageChange = async (page) => {
        if (page === currentPage) return;
        
        setCurrentPage(page);
        await loadBooksOnly(page, itemsPerPage, searchTerm, false); // false = không hiển thị loading
    };

    // Handle items per page change
    const handleItemsPerPageChange = async (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page
        await loadBooksOnly(1, newItemsPerPage, searchTerm);
    };

    // Validation function
    const validateForm = (data) => {
        const errors = {};
        if (!data.title || data.title.trim().length < 2) {
            errors.title = 'Tên sách phải có ít nhất 2 ký tự';
        }
        if (!data.price || data.price <= 0) {
            errors.price = 'Giá sách phải lớn hơn 0';
        }
        if (!data.stock || data.stock < 0) {
            errors.stock = 'Số lượng tồn kho không được âm';
        }
        if (!data.category_id) {
            errors.category_id = 'Vui lòng chọn danh mục';
        }
        if (!data.author_id) {
            errors.author_id = 'Vui lòng chọn tác giả';
        }
        if (!data.publisher_id) {
            errors.publisher_id = 'Vui lòng chọn nhà xuất bản';
        }
        return errors;
    };

    const handleAddBook = () => {
        setEditingBook(null);
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

    const handleEditBook = (book) => {
        setEditingBook(book);
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

    // Helper function để format date cho input
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';

        // Nếu là ISO string, chuyển về yyyy-MM-dd
        if (dateString.includes('T')) {
            return dateString.split('T')[0];
        }

        // Nếu đã là yyyy-MM-dd thì giữ nguyên
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return dateString;
        }

        // Nếu là format khác, thử parse
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
            try {
                const result = await deleteBook(bookId);
                if (result.success) {
                    // Refresh data with current pagination
                    await loadBooksOnly(currentPage, itemsPerPage, searchTerm);
                    alert(result.message);
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Có lỗi xảy ra khi xóa sách. Vui lòng thử lại.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const bookData = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            category_id: parseInt(formData.category_id),
            author_id: parseInt(formData.author_id),
            publisher_id: parseInt(formData.publisher_id),
            slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-')
        };

        try {
            let result;
            if (editingBook) {
                // Update book
                result = await updateBook(editingBook.book_id, bookData);
            } else {
                // Add new book
                result = await createBook(bookData);
            }

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
                // Refresh data with current pagination
                await loadBooksOnly(currentPage, itemsPerPage, searchTerm);
                alert(result.message);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error saving book:', error);
            alert('Có lỗi xảy ra khi lưu sách. Vui lòng thử lại.');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <div className="card border-0 shadow-sm rounded-3">
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
            
            <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
                <h5 className="fw-bold text-dark mb-0">
                    <i className="fas fa-book-open text-primary me-2"></i>
                    Quản lý sách
                </h5>
                <button className="btn btn-primary btn-sm" onClick={handleAddBook}>
                    <i className="fas fa-plus me-1"></i> Thêm sách mới
                </button>
            </div>

            <div className="card-body p-0">
                {/* Search Bar and Total Count */}
                <div className="p-3 border-bottom">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-muted">
                                <i className="fas fa-book me-1"></i>
                                Tổng số sách: <strong className="text-primary">{pagination.totalItems || 0}</strong>
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
                            placeholder="Tìm kiếm sách theo tên, tác giả, danh mục..."
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

                    <div className="table-responsive position-relative">
                    <table
                        className="table table-hover mb-0 align-middle text-center table-fixed"
                    >
                        <thead className="bg-light">
                            <tr>
                                <th style={{ width: "5%" }} className="py-3 fw-semibold text-secondary">ID</th>
                                <th style={{ width: "25%" }} className="py-3 fw-semibold text-secondary text-start ps-3">Tên sách</th>
                                <th style={{ width: "10%" }} className="py-3 fw-semibold text-secondary">Giá</th>
                                <th style={{ width: "10%" }} className="py-3 fw-semibold text-secondary">Tồn kho</th>
                                <th style={{ width: "10%" }} className="py-3 fw-semibold text-secondary">Danh mục</th>
                                <th style={{ width: "10%" }} className="py-3 fw-semibold text-secondary">Tác giả</th>
                                <th style={{ width: "10%" }} className="py-3 fw-semibold text-secondary">NXB</th>
                                <th style={{ width: "15%" }} className="py-3 fw-semibold text-secondary">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-4 text-danger">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {error}
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
                                            {book.stock}
                                        </td>
                                        <td className="fw-semibold text-dark">
                                            {book.category_name || `Category ${book.category_id}`}
                                        </td>
                                        <td className="fw-semibold text-dark">
                                            {book.author_name || `Author ${book.author_id}`}
                                        </td>
                                        <td className="fw-semibold text-dark">
                                            {book.publisher_name || `Publisher ${book.publisher_id}`}
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => handleEditBook(book)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDeleteBook(book.book_id)}
                                                    title="Xóa"
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
                                        <div>Không có dữ liệu sách</div>
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
                            trong tổng số {pagination.totalItems} sách
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

            {/* Modal thêm/sửa sách */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingBook ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
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
                                            <label className="form-label">Tên sách *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                            {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Giá *</label>
                                            <input
                                                type="number"
                                                className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            />
                                            {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Số lượng tồn kho *</label>
                                            <input
                                                type="number"
                                                className={`form-control ${formErrors.stock ? 'is-invalid' : ''}`}
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            />
                                            {formErrors.stock && <div className="invalid-feedback">{formErrors.stock}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Danh mục *</label>
                                            <select
                                                className={`form-select ${formErrors.category_id ? 'is-invalid' : ''}`}
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            >
                                                <option value="">Chọn danh mục</option>
                                                {categories && categories.length > 0 ? (
                                                    categories.map(category => (
                                                        <option key={category.category_id} value={category.category_id}>
                                                            {category.name || `Category ${category.category_id}`}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>Đang tải danh mục...</option>
                                                )}
                                            </select>
                                            {formErrors.category_id && <div className="invalid-feedback">{formErrors.category_id}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Tác giả *</label>
                                            <select
                                                className={`form-select ${formErrors.author_id ? 'is-invalid' : ''}`}
                                                value={formData.author_id}
                                                onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                                            >
                                                <option value="">Chọn tác giả</option>
                                                {authors && authors.length > 0 ? (
                                                    authors.map(author => (
                                                        <option key={author.author_id} value={author.author_id}>
                                                            {author.name || `Author ${author.author_id}`}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>Đang tải tác giả...</option>
                                                )}
                                            </select>
                                            {formErrors.author_id && <div className="invalid-feedback">{formErrors.author_id}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Nhà xuất bản *</label>
                                            <select
                                                className={`form-select ${formErrors.publisher_id ? 'is-invalid' : ''}`}
                                                value={formData.publisher_id}
                                                onChange={(e) => setFormData({ ...formData, publisher_id: e.target.value })}
                                            >
                                                <option value="">Chọn nhà xuất bản</option>
                                                {publishers && publishers.length > 0 ? (
                                                    publishers.map(publisher => (
                                                        <option key={publisher.publisher_id} value={publisher.publisher_id}>
                                                            {publisher.name || `Publisher ${publisher.publisher_id}`}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option disabled>Đang tải nhà xuất bản...</option>
                                                )}
                                            </select>
                                            {formErrors.publisher_id && <div className="invalid-feedback">{formErrors.publisher_id}</div>}
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Mô tả</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Ngày xuất bản</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.published_date}
                                                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Hình ảnh bìa</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                value={formData.cover_image}
                                                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                                                placeholder="URL hình ảnh"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingBook ? 'Cập nhật' : 'Thêm mới'}
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
