import React, { useState } from 'react';
import { useBookManagement } from '../../hooks/useBookManagement';

const BookManagement = () => {
    const {
        books,
        categories,
        authors,
        publishers,
        loading,
        error,
        createBook,
        updateBook,
        deleteBook,
        searchBooks,
        refreshData
    } = useBookManagement();

    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
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
        error
    });

    // Handle search
    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            await searchBooks(searchQuery);
        } else {
            await refreshData();
        }
    };

    // Clear search
    const handleClearSearch = async () => {
        setSearchQuery('');
        await refreshData();
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
                {/* Search Bar */}
                <div className="p-3 border-bottom">
                    <form onSubmit={handleSearch} className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm sách..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="btn btn-outline-primary">
                            <i className="fas fa-search"></i>
                        </button>
                        {searchQuery && (
                            <button type="button" className="btn btn-outline-secondary" onClick={handleClearSearch}>
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </form>
                </div>

                <div className="table-responsive">
                    <table
                        className="table table-hover mb-0 align-middle text-center"
                        style={{ tableLayout: "fixed", width: "100%" }}
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
                                            {book.category_id}
                                        </td>
                                        <td className="fw-semibold text-dark">
                                            {book.author_id}
                                        </td>
                                        <td className="fw-semibold text-dark">
                                            {book.publisher_id}
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
                                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            />
                                            {formErrors.title && <div className="invalid-feedback">{formErrors.title}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Giá *</label>
                                            <input
                                                type="number"
                                                className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
                                                value={formData.price}
                                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                            />
                                            {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Số lượng tồn kho *</label>
                                            <input
                                                type="number"
                                                className={`form-control ${formErrors.stock ? 'is-invalid' : ''}`}
                                                value={formData.stock}
                                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                            />
                                            {formErrors.stock && <div className="invalid-feedback">{formErrors.stock}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Danh mục *</label>
                                            <select
                                                className={`form-select ${formErrors.category_id ? 'is-invalid' : ''}`}
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                            >
                                                <option value="">Chọn danh mục</option>
                                                {categories && categories.length > 0 ? (
                                                    categories.map(category => (
                                                        <option key={category.category_id} value={category.category_id}>
                                                            {category.category_name || category.name || `Category ${category.category_id}`}
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
                                                onChange={(e) => setFormData({...formData, author_id: e.target.value})}
                                            >
                                                <option value="">Chọn tác giả</option>
                                                {authors && authors.length > 0 ? (
                                                    authors.map(author => (
                                                        <option key={author.author_id} value={author.author_id}>
                                                            {author.author_name || author.name || `Author ${author.author_id}`}
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
                                                onChange={(e) => setFormData({...formData, publisher_id: e.target.value})}
                                            >
                                                <option value="">Chọn nhà xuất bản</option>
                                                {publishers && publishers.length > 0 ? (
                                                    publishers.map(publisher => (
                                                        <option key={publisher.publisher_id} value={publisher.publisher_id}>
                                                            {publisher.publisher_name || publisher.name || `Publisher ${publisher.publisher_id}`}
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
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Ngày xuất bản</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.published_date}
                                                onChange={(e) => setFormData({...formData, published_date: e.target.value})}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Hình ảnh bìa</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                value={formData.cover_image}
                                                onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
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
