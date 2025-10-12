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
        <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold text-dark mb-0">
            <i className="fas fa-book-open text-primary me-2"></i>
            Danh sách sách
          </h5>
          <button className="btn btn-primary btn-sm">
            <i className="fas fa-plus me-1"></i> Thêm sách mới
          </button>
        </div>
      
        <div className="card-body p-0">
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
                {books.length > 0 ? (
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
                        {new Intl.NumberFormat("vi-VN").format(book.price)} ₫
                      </td>
                      <td>
                        <span
                          className={`${
                            book.stock > 100
                              ? "text-dark "
                              : book.stock > 50
                              ? " text-dark "
                              : " text-dark "
                          }`}
                        >
                          {book.stock}
                        </span>
                      </td>
                      <td>{book.category_id}</td>
                      <td>{book.author_id}</td>
                      <td>{book.publisher_id}</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-outline-primary btn-sm">
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-outline-danger btn-sm">
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
      </div>
      
    );
};

export default BookManagement;
