import React, { useState } from 'react';
import { useBookManagement } from '../../hooks/useBookManagement';
import DatabaseTest from './DatabaseTest';

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

    // Debug logs
    console.log('📊 BookManagementReal State:', {
        books: books.length,
        categories: categories.length,
        authors: authors.length,
        publishers: publishers.length,
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
            published_date: book.published_date || '',
            cover_image: book.cover_image || '',
            slug: book.slug || ''
        });
        setFormErrors({});
        setShowModal(true);
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
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Quản lý sách (Real API)</h2>
                <button
                    className="btn btn-primary"
                    onClick={handleAddBook}
                >
                    <i className="fas fa-plus me-2"></i>
                    Thêm sách mới
                </button>
            </div>

            {/* Search Bar */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <form onSubmit={handleSearch} className="d-flex">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Tìm kiếm sách theo tên hoặc mô tả..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="btn btn-outline-primary me-2">
                            <i className="fas fa-search"></i>
                        </button>
                        {searchQuery && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleClearSearch}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </form>
                </div>
                <div className="col-md-6 text-end">
                    <button
                        className="btn btn-outline-success me-2"
                        onClick={refreshData}
                        disabled={loading}
                    >
                        <i className="fas fa-sync-alt me-1"></i>
                        Làm mới
                    </button>
                    <span className="text-muted">
                        Tổng: {books.length} sách
                    </span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            {/* Books Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2 text-muted">Đang tải dữ liệu từ database...</p>
                            </div>
                        ) : books.length === 0 ? (
                            <div className="text-center py-5">
                                <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                                <h5 className="text-muted">Không có sách nào</h5>
                                <p className="text-muted">
                                    {searchQuery ? 'Không tìm thấy sách phù hợp với từ khóa tìm kiếm' : 'Database trống hoặc có lỗi kết nối'}
                                </p>
                                {!searchQuery && (
                                    <button className="btn btn-primary" onClick={handleAddBook}>
                                        <i className="fas fa-plus me-2"></i>
                                        Thêm sách đầu tiên
                                    </button>
                                )}
                            </div>
                        ) : (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tên sách</th>
                                        <th>Giá</th>
                                        <th>Tồn kho</th>
                                        <th>Danh mục</th>
                                        <th>Tác giả</th>
                                        <th>Nhà xuất bản</th>
                                        <th className="text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map(book => (
                                        <tr key={book.book_id}>
                                            <td>{book.book_id}</td>
                                            <td>
                                                <div>
                                                    <strong>{book.title}</strong>
                                                    {book.description && (
                                                        <div className="text-muted small">
                                                            {book.description.length > 50
                                                                ? book.description.substring(0, 50) + '...'
                                                                : book.description
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-end">{formatCurrency(book.price)}</td>
                                            <td className="text-center">
                                                <span className={`badge ${book.stock > 10 ? 'bg-success' : book.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                                                    {book.stock}
                                                </span>
                                            </td>
                                            <td>{book.category_id}</td>
                                            <td>{book.author_id}</td>
                                            <td>{book.publisher_id}</td>
                                            <td className="text-center">
                                                <div className="btn-group" role="group">
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
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Database Test Component */}
            <div className="mt-5">
                <DatabaseTest />
            </div>
        </div>
    );
};

export default BookManagement;
