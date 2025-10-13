import React, { useState, useEffect } from 'react';
import authorApi from '../../../services/authorApi.js';
import cartApi from '../../../services/cartApi.js';

const AuthorDetail = ({ onNavigateTo, authorId }) => {
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authorId) {
            loadAuthorDetail();
        }
    }, [authorId]);

    const loadAuthorDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await authorApi.getAuthorById(authorId);

            if (response.success) {
                console.log('📊 [AuthorDetail] Author data:', response.data);
                if (response.data.books) {
                    console.log('📚 [AuthorDetail] Books data:', response.data.books);
                    response.data.books.forEach((book, index) => {
                        console.log(`📖 [AuthorDetail] Book ${index + 1}:`, {
                            title: book.title,
                            price: book.price,
                            average_rating: book.average_rating,
                            review_count: book.review_count,
                            rating_type: typeof book.average_rating
                        });
                    });
                }
                setAuthor(response.data);
            } else {
                setError('Không thể tải thông tin tác giả');
            }
        } catch (err) {
            console.error('Error loading author detail:', err);
            setError('Lỗi khi tải thông tin tác giả');
        } finally {
            setLoading(false);
        }
    };

    const handleBookClick = (bookId) => {
        console.log('📖 [AuthorDetail] Clicking on book ID:', bookId);
        onNavigateTo('product', { id: bookId });
        window.scrollTo(0, 0); // Scroll to top when navigating
    };

    // Function to add book to cart
    const handleAddToCart = async (book, e) => {
        e.stopPropagation(); // Prevent card click

        try {
            console.log('🛒 [AuthorDetail] Adding book to cart:', book.title);

            // Check if user is logged in
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');

            if (!user || !token) {
                window.showToast('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', 'error');
                onNavigateTo('auth');
                return;
            }

            const cartData = {
                book_id: book.book_id,
                quantity: 1
            };

            const response = await cartApi.addToCart(cartData);

            // Backend trả về { message: 'Sản phẩm đã được thêm vào giỏ hàng' }
            if (response && (response.message || response.success)) {
                window.showToast(`Đã thêm "${book.title}" vào giỏ hàng!`, 'success');
                console.log('✅ [AuthorDetail] Book added to cart successfully:', response);
            } else {
                window.showToast('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!', 'error');
                console.error('❌ [AuthorDetail] Failed to add book to cart:', response);
            }
        } catch (error) {
            console.error('💥 [AuthorDetail] Error adding book to cart:', error);
            window.showToast('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng!', 'error');
        }
    };

    // Function to add book to wishlist
    const handleAddToWishlist = async (book, e) => {
        e.stopPropagation(); // Prevent card click

        try {
            console.log('❤️ [AuthorDetail] Adding book to wishlist:', book.title);

            // Check if user is logged in
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                window.showToast('Vui lòng đăng nhập để thêm sản phẩm vào yêu thích!', 'error');
                onNavigateTo('auth');
                return;
            }

            // TODO: Implement wishlist API
            window.showToast(`Đã thêm "${book.title}" vào yêu thích!`, 'success');
            console.log('✅ [AuthorDetail] Book added to wishlist successfully');
        } catch (error) {
            console.error('💥 [AuthorDetail] Error adding book to wishlist:', error);
            window.showToast('Có lỗi xảy ra khi thêm sản phẩm vào yêu thích!', 'error');
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                {/* Back Button */}
                <div className="row mb-3">
                    <div className="col-12">
                        <button
                            className="btn btn-link text-dark p-0 no-hover"
                            onClick={() => onNavigateTo('author')}
                            style={{
                                border: 'none',
                                background: 'none',
                                fontSize: '16px',
                                textDecoration: 'none',
                                boxShadow: 'none',
                                fontWeight: '500'
                            }}
                        >
                            <i className="fas fa-arrow-left me-2"></i>Tác giả
                        </button>
                    </div>
                </div>
                
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                {/* Back Button */}
                <div className="row mb-3">
                    <div className="col-12">
                        <button
                            className="btn btn-link text-dark p-0 no-hover"
                            onClick={() => onNavigateTo('author')}
                            style={{
                                border: 'none',
                                background: 'none',
                                fontSize: '16px',
                                textDecoration: 'none',
                                boxShadow: 'none',
                                fontWeight: '500'
                            }}
                        >
                            <i className="fas fa-arrow-left me-2"></i>Tác giả
                        </button>
                    </div>
                </div>
                
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    if (!author) {
        return (
            <div className="container mt-4">
                {/* Back Button */}
                <div className="row mb-3">
                    <div className="col-12">
                        <button
                            className="btn btn-link text-dark p-0 no-hover"
                            onClick={() => onNavigateTo('author')}
                            style={{
                                border: 'none',
                                background: 'none',
                                fontSize: '16px',
                                textDecoration: 'none',
                                boxShadow: 'none',
                                fontWeight: '500'
                            }}
                        >
                            <i className="fas fa-arrow-left me-2"></i>Tác giả
                        </button>
                    </div>
                </div>

                <div className="alert alert-warning" role="alert">
                    Không tìm thấy thông tin tác giả
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {/* Back Button */}
            <div className="row mb-3">
                <div className="col-12">
                    <button
                        className="btn btn-link text-dark p-0 no-hover"
                        onClick={() => onNavigateTo('author')}
                        style={{
                            border: 'none',
                            background: 'none',
                            fontSize: '16px',
                            textDecoration: 'none',
                            boxShadow: 'none',
                            fontWeight: '500'
                        }}
                    >
                        <i className="fas fa-arrow-left me-2"></i>Tác giả
                    </button>
                </div>
            </div>

            {/* Author Header */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="card author-header-card">
                        <div className="card-body">
                            <div className="row align-items-center">
                                <div className="col-md-3 text-center">
                                    <div className="author-avatar-large mb-3">
                                        <i className="fas fa-user-circle fa-5x text-primary"></i>
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    <h1 className="author-name mb-3">{author.name}</h1>
                                    {author.bio && (
                                        <div className="author-bio-full">
                                            <h5 className="text-muted mb-2">Tiểu sử</h5>
                                            <p className="lead">{author.bio}</p>
                                        </div>
                                    )}
                                    {author.books && author.books.length > 0 && (
                                        <div className="author-stats mt-3">
                                            <span className="badge bg-primary me-2">
                                                <i className="fas fa-book me-1"></i>
                                                {author.books.length} cuốn sách
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Author's Books */}
            {author.books && author.books.length > 0 ? (
                <div className="row">
                    <div className="col-12">
                        <h3 className="mb-4">
                            Tác phẩm của {author.name}
                        </h3>
                        <div className="row">
                            {author.books.map((book) => {
                                console.log('📚 [AuthorDetail] Rendering book:', {
                                    book_id: book.book_id,
                                    title: book.title,
                                    cover_image: book.cover_image,
                                    price: book.price
                                });
                                return (
                                    <div key={book.book_id} className="col-lg-3 col-md-6 mb-4">
                                        <div
                                            className="card h-100 border-0 shadow-sm"
                                            style={{
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                height: '450px',
                                                backgroundColor: 'white'
                                            }}
                                            onClick={() => handleBookClick(book.book_id)}
                                            title="Click để xem chi tiết sách"
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-8px)';
                                                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                            }}
                                        >
                                            <div className="position-relative">
                                                {book.cover_image && book.cover_image.trim() !== '' ? (
                                                    <img
                                                        src={book.cover_image}
                                                        className="card-img-top"
                                                        alt={book.title}
                                                        style={{
                                                            height: '280px',
                                                            objectFit: 'contain',
                                                            width: '100%',
                                                            backgroundColor: '#f8f9fa'
                                                        }}
                                                        onError={(e) => {
                                                            console.log('❌ [AuthorDetail] Book image failed to load:', book.cover_image);
                                                        }}
                                                        onLoad={() => {
                                                            console.log('✅ [AuthorDetail] Book image loaded successfully:', book.cover_image);
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="card-img-top d-flex align-items-center justify-content-center"
                                                        style={{
                                                            height: '280px',
                                                            backgroundColor: '#f8f9fa'
                                                        }}
                                                    >
                                                        <i className="fas fa-book fa-3x text-muted"></i>
                                                    </div>
                                                )}

                                                {/* Heart Icon - góc trên trái */}
                                                <div className="position-absolute top-0 start-0 m-2">
                                                    <button
                                                        className="btn btn-sm"
                                                        style={{
                                                            width: '35px',
                                                            height: '35px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: 'rgba(255,255,255,0.95)',
                                                            border: '1px solid rgba(0,0,0,0.1)',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                            transition: 'all 0.3s ease',
                                                            backdropFilter: 'blur(10px)'
                                                        }}
                                                        onClick={(e) => handleAddToWishlist(book, e)}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.backgroundColor = 'rgba(255,255,255,1)';
                                                            e.target.style.transform = 'scale(1.05)';
                                                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = 'rgba(255,255,255,0.95)';
                                                            e.target.style.transform = 'scale(1)';
                                                            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                                        }}
                                                        title="Thêm vào yêu thích"
                                                    >
                                                        <i className="bi bi-heart text-dark" style={{ fontSize: '14px' }}></i>
                                                    </button>
                                                </div>

                                                {/* Shopping Cart Icon - góc trên phải */}
                                                <div className="position-absolute top-0 end-0 m-2">
                                                    <button
                                                        className="btn btn-sm"
                                                        style={{
                                                            width: '35px',
                                                            height: '35px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: 'rgba(0,123,255,0.95)',
                                                            border: '1px solid rgba(0,123,255,0.3)',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 2px 8px rgba(0,123,255,0.2)',
                                                            transition: 'all 0.3s ease',
                                                            backdropFilter: 'blur(10px)'
                                                        }}
                                                        onClick={(e) => handleAddToCart(book, e)}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.backgroundColor = 'rgba(0,123,255,1)';
                                                            e.target.style.transform = 'scale(1.05)';
                                                            e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = 'rgba(0,123,255,0.95)';
                                                            e.target.style.transform = 'scale(1)';
                                                            e.target.style.boxShadow = '0 2px 8px rgba(0,123,255,0.2)';
                                                        }}
                                                        title="Thêm vào giỏ hàng"
                                                    >
                                                        <i className="bi bi-cart-plus text-white" style={{ fontSize: '14px' }}></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="card-body d-flex flex-column p-3">
                                                <h6 className="card-title mb-2" style={{
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    lineHeight: '1.3',
                                                    height: '2.6em',
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical'
                                                }}>
                                                    {book.title}
                                                </h6>

                                                <p className="text-muted small mb-2" style={{
                                                    fontSize: '12px',
                                                    height: '1.5em',
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical'
                                                }}>
                                                    {book.category_name || 'Không có danh mục'}
                                                </p>

                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="d-flex align-items-center me-2">
                                                        <i className="bi bi-star-fill text-warning me-1" style={{ fontSize: '12px' }}></i>
                                                        <span className="text-muted small">
                                                            {book.average_rating && parseFloat(book.average_rating) > 0
                                                                ? parseFloat(book.average_rating).toFixed(1)
                                                                : '0.0'
                                                            } ({book.review_count || 0})
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="text-primary fw-bold" style={{ fontSize: '18px' }}>
                                                            {new Intl.NumberFormat('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND'
                                                            }).format(book.price || 0)}
                                                        </span>
                                                        <small className="text-success">
                                                            <i className="bi bi-check-circle me-1"></i>
                                                            Còn hàng
                                                        </small>
                                                    </div>

                                                    <button
                                                        className="btn btn-outline-primary w-100"
                                                        style={{
                                                            fontSize: '14px',
                                                            padding: '8px 16px',
                                                            borderRadius: '6px',
                                                            border: '1px solid #007bff',
                                                            backgroundColor: 'transparent',
                                                            color: '#007bff',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleBookClick(book.book_id);
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.backgroundColor = '#007bff';
                                                            e.target.style.color = 'white';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = 'transparent';
                                                            e.target.style.color = '#007bff';
                                                        }}
                                                    >
                                                        Xem chi tiết
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row">
                    <div className="col-12">
                        <div className="text-center py-5">
                            <i className="fas fa-book-open fa-3x text-muted mb-3"></i>
                            <h4 className="text-muted">Chưa có tác phẩm nào</h4>
                            <p className="text-muted">Tác giả này chưa có sách nào trong hệ thống</p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .author-header-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                }
                
                .author-avatar-large {
                    width: 120px;
                    height: 120px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .author-name {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }
                
                .author-bio-full p {
                    font-size: 1.1rem;
                    line-height: 1.6;
                }
                
            `}</style>
        </div>
    );
};

export default AuthorDetail;
