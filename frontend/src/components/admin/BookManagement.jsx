import React, { useState, useEffect } from 'react';

const BookManagement = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formErrors, setFormErrors] = useState({});
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

    // Mock data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setTimeout(() => {
                setBooks([
                    {
                        book_id: 1,
                        title: 'Thanh Gươm Diệt Quỷ - Tập 1',
                        description: 'Câu chuyện về Tanjiro Kamado và cuộc hành trình trở thành thợ săn quỷ.',
                        price: 815000,
                        stock: 45,
                        category_id: 6,
                        author_id: 1,
                        publisher_id: 1,
                        published_date: '2016-02-15',
                        cover_image: '/images/book1.jpg',
                        slug: 'thanh-guom-diet-quy-tap-1',
                        created_at: '2024-01-01',
                        updated_at: '2024-01-15',
                        category_name: 'Manga/Comic',
                        author_name: 'Koyoharu Gotouge',
                        publisher_name: 'Kim Đồng'
                    },
                    {
                        book_id: 2,
                        title: 'Harry Potter và Hòn Đá Phù Thủy',
                        description: 'Cuộc phiêu lưu đầu tiên của Harry Potter tại trường Hogwarts.',
                        price: 320000,
                        stock: 23,
                        category_id: 2,
                        author_id: 3,
                        publisher_name: 'NXB Trẻ',
                        published_date: '1997-06-26',
                        cover_image: '/images/book2.jpg',
                        slug: 'harry-potter-va-hon-da-phu-thuy',
                        created_at: '2024-01-01',
                        updated_at: '2024-01-15',
                        category_name: 'Tiểu thuyết',
                        author_name: 'J.K. Rowling',
                        publisher_name: 'NXB Trẻ'
                    }
                ]);

                setCategories([
                    { category_id: 1, name: 'Văn học' },
                    { category_id: 2, name: 'Tiểu thuyết' },
                    { category_id: 4, name: 'Khoa học' },
                    { category_id: 5, name: 'Lịch sử' },
                    { category_id: 6, name: 'Manga/Comic' }
                ]);

                setAuthors([
                    { author_id: 1, name: 'Koyoharu Gotouge' },
                    { author_id: 2, name: 'Fujiko F. Fujio' },
                    { author_id: 3, name: 'J.K. Rowling' },
                    { author_id: 4, name: 'Gosho Aoyama' },
                    { author_id: 5, name: 'Eiichiro Oda' }
                ]);

                setPublishers([
                    { publisher_id: 1, name: 'Kim Đồng' },
                    { publisher_id: 2, name: 'NXB Trẻ' },
                    { publisher_id: 3, name: 'NXB Hội Nhà Văn' },
                    { publisher_id: 4, name: 'NXB Văn Học' }
                ]);

                setLoading(false);
            }, 1000);
        };

        fetchData();
    }, []);

    // Validation function
    const validateForm = (data) => {
        const errors = {};

        if (!data.title.trim()) {
            errors.title = 'Tên sách là bắt buộc';
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
            title: book.title,
            description: book.description,
            price: book.price.toString(),
            stock: book.stock.toString(),
            category_id: book.category_id.toString(),
            author_id: book.author_id.toString(),
            publisher_id: book.publisher_id.toString(),
            published_date: book.published_date,
            cover_image: book.cover_image,
            slug: book.slug
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleDeleteBook = (bookId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
            setBooks(books.filter(book => book.book_id !== bookId));
        }
    };

    const handleSubmit = (e) => {
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
            if (editingBook) {
                // Update book
                const updatedBooks = books.map(book =>
                    book.book_id === editingBook.book_id
                        ? {
                            ...book,
                            ...bookData,
                            updated_at: new Date().toISOString().split('T')[0],
                            category_name: categories.find(c => c.category_id === bookData.category_id)?.name || book.category_name,
                            author_name: authors.find(a => a.author_id === bookData.author_id)?.name || book.author_name,
                            publisher_name: publishers.find(p => p.publisher_id === bookData.publisher_id)?.name || book.publisher_name
                        }
                        : book
                );
                setBooks(updatedBooks);
            } else {
                // Add new book
                const newBook = {
                    book_id: Math.max(...books.map(b => b.book_id)) + 1,
                    ...bookData,
                    created_at: new Date().toISOString().split('T')[0],
                    updated_at: new Date().toISOString().split('T')[0],
                    category_name: categories.find(c => c.category_id === bookData.category_id)?.name || '',
                    author_name: authors.find(a => a.author_id === bookData.author_id)?.name || '',
                    publisher_name: publishers.find(p => p.publisher_id === bookData.publisher_id)?.name || ''
                };
                setBooks([...books, newBook]);
            }

            setShowModal(false);
            setFormErrors({});
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
                <h2 className="fw-bold text-dark">Quản lý sách</h2>
                <button
                    className="btn btn-primary"
                    onClick={handleAddBook}
                >
                    <i className="fas fa-plus me-2"></i>
                    Thêm sách mới
                </button>
            </div>

            {/* Books Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Hình ảnh</th>
                                    <th>Tên sách</th>
                                    <th>Tác giả</th>
                                    <th>Danh mục</th>
                                    <th>Nhà xuất bản</th>
                                    <th className="text-end">Giá</th>
                                    <th className="text-center">Tồn kho</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map((book) => (
                                    <tr key={book.book_id}>
                                        <td>
                                            <img
                                                src={book.cover_image}
                                                alt={book.title}
                                                className="rounded"
                                                style={{ width: '50px', height: '70px', objectFit: 'cover' }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/50x70/6c757d/ffffff?text=No+Image';
                                                }}
                                            />
                                        </td>
                                        <td>
                                            <div className="fw-medium text-dark">{book.title}</div>
                                            <div className="text-muted small" style={{ maxWidth: '200px' }}>
                                                {book.description.substring(0, 100)}...
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-dark">
                                                {book.author_name}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-primary">
                                                {book.category_name}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-info text-dark">
                                                {book.publisher_name}
                                            </span>
                                        </td>
                                        <td className="text-end fw-bold">
                                            {formatCurrency(book.price)}
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge ${book.stock > 10 ? 'bg-success' : book.stock > 0 ? 'bg-warning' : 'bg-danger'}`}>
                                                {book.stock}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="btn-group btn-group-sm">
                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => handleEditBook(book)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger"
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
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-xl">
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
                                        <div className="col-md-8 mb-3">
                                            <label className="form-label">Tên sách *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                required
                                            />
                                            {formErrors.title && (
                                                <div className="invalid-feedback">{formErrors.title}</div>
                                            )}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Slug</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                placeholder="Tự động tạo nếu để trống"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Mô tả</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="row">
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">Giá *</label>
                                            <input
                                                type="number"
                                                className={`form-control ${formErrors.price ? 'is-invalid' : ''}`}
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                required
                                                min="0"
                                                step="1000"
                                            />
                                            {formErrors.price && (
                                                <div className="invalid-feedback">{formErrors.price}</div>
                                            )}
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">Số lượng tồn kho *</label>
                                            <input
                                                type="number"
                                                className={`form-control ${formErrors.stock ? 'is-invalid' : ''}`}
                                                value={formData.stock}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                required
                                                min="0"
                                            />
                                            {formErrors.stock && (
                                                <div className="invalid-feedback">{formErrors.stock}</div>
                                            )}
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">Ngày xuất bản</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={formData.published_date}
                                                onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-3 mb-3">
                                            <label className="form-label">Hình ảnh</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                value={formData.cover_image}
                                                onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                                                placeholder="URL hình ảnh"
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Tác giả *</label>
                                            <select
                                                className={`form-select ${formErrors.author_id ? 'is-invalid' : ''}`}
                                                value={formData.author_id}
                                                onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                                                required
                                            >
                                                <option value="">Chọn tác giả</option>
                                                {authors.map(author => (
                                                    <option key={author.author_id} value={author.author_id}>
                                                        {author.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.author_id && (
                                                <div className="invalid-feedback">{formErrors.author_id}</div>
                                            )}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Danh mục *</label>
                                            <select
                                                className={`form-select ${formErrors.category_id ? 'is-invalid' : ''}`}
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                                required
                                            >
                                                <option value="">Chọn danh mục</option>
                                                {categories.map(category => (
                                                    <option key={category.category_id} value={category.category_id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.category_id && (
                                                <div className="invalid-feedback">{formErrors.category_id}</div>
                                            )}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Nhà xuất bản *</label>
                                            <select
                                                className={`form-select ${formErrors.publisher_id ? 'is-invalid' : ''}`}
                                                value={formData.publisher_id}
                                                onChange={(e) => setFormData({ ...formData, publisher_id: e.target.value })}
                                                required
                                            >
                                                <option value="">Chọn nhà xuất bản</option>
                                                {publishers.map(publisher => (
                                                    <option key={publisher.publisher_id} value={publisher.publisher_id}>
                                                        {publisher.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.publisher_id && (
                                                <div className="invalid-feedback">{formErrors.publisher_id}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
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
