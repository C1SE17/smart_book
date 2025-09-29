import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Dữ liệu sách giả để hiển thị chi tiết sách
const mockBooks = {
  1: { title: "WHERE THE CRAWDADS SING", author: "Delia Owens", price: 180000, image: "./public/images/book1.jpg" },
  2: { title: "Doraemon: Nobita's Little Star Wars", author: "Fujiko F. Fujio", price: 120000, image: "./public/images/book2.jpg" },
  3: { title: "Demon Slayer - Vô hạn thành", author: "Koyoharu Gotouge", price: 150000, image: "./public/images/book3.jpg" },
  4: { title: "Conan - Vụ Án Nữ Hoàng 450", author: "Gosho Aoyama", price: 130000, image: "./public/images/book4.jpg" }
};

const Cart = ({ onBackToHome, onNavigateTo }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = useCallback(() => {
    setLoading(true);
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const itemsWithDetails = cart.map(item => ({
      ...item,
      book_title: mockBooks[item.book_id]?.title || `Book ${item.book_id}`,
      author: mockBooks[item.book_id]?.author || 'Unknown Author',
      price: mockBooks[item.book_id]?.price || 0,
      total_price: (mockBooks[item.book_id]?.price || 0) * item.quantity,
      image_url: mockBooks[item.book_id]?.image || './public/images/book1.jpg'
    }));
    
    setCartItems(itemsWithDetails);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCartItems();
    
    // Lắng nghe cập nhật giỏ hàng từ các component khác
    const handleCartUpdate = () => {
      fetchCartItems();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []); // Remove fetchCartItems dependency to avoid infinite loop

  const removeFromCart = useCallback((bookId) => {
    try {
      // Lấy giỏ hàng hiện tại từ localStorage
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Xóa mục có book_id khớp
      cart = cart.filter(item => item.book_id !== bookId);
      
      // Lưu giỏ hàng đã cập nhật vào localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Ánh xạ các mục giỏ hàng với chi tiết sách
      const itemsWithDetails = cart.map(item => ({
        ...item,
        book_title: mockBooks[item.book_id]?.title || `Book ${item.book_id}`,
        author: mockBooks[item.book_id]?.author || 'Unknown Author',
        price: mockBooks[item.book_id]?.price || 0,
        total_price: (mockBooks[item.book_id]?.price || 0) * item.quantity,
        image_url: mockBooks[item.book_id]?.image || './public/images/book1.jpg'
      }));
      
      setCartItems(itemsWithDetails);
      
      // Kích hoạt sự kiện cập nhật giỏ hàng
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { cart, action: 'remove', bookId } 
      }));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  }, []);

  const updateQuantity = useCallback((bookId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(bookId);
      return;
    }

    try {
      // Lấy giỏ hàng hiện tại từ localStorage
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Tìm và cập nhật số lượng mục
      const item = cart.find(item => item.book_id === bookId);
      if (item) {
        item.quantity = newQuantity;
      }
      
      // Lưu giỏ hàng đã cập nhật vào localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Ánh xạ các mục giỏ hàng với chi tiết sách
      const itemsWithDetails = cart.map(item => ({
        ...item,
        book_title: mockBooks[item.book_id]?.title || `Book ${item.book_id}`,
        author: mockBooks[item.book_id]?.author || 'Unknown Author',
        price: mockBooks[item.book_id]?.price || 0,
        total_price: (mockBooks[item.book_id]?.price || 0) * item.quantity,
        image_url: mockBooks[item.book_id]?.image || './public/images/book1.jpg'
      }));
      
      setCartItems(itemsWithDetails);
      
      // Kích hoạt sự kiện cập nhật giỏ hàng
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: { cart, action: 'update', bookId } 
      }));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }, [removeFromCart, mockBooks]);

  const calculateTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.total_price);
    }, 0);
  }, [cartItems]);

  const handleCheckout = useCallback(() => {
    // TODO: Triển khai chức năng thanh toán
  }, []);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa', transition: 'all 0.3s ease' }}>
      <div className="container py-5">
        <div style={{ minHeight: '600px', transition: 'all 0.3s ease' }}>
          {/* Điều hướng về Trang Chủ */}
          <div className="mb-4">
            <button
              className="btn btn-link text-dark p-0 no-hover"
              onClick={onBackToHome}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '16px',
                textDecoration: 'none',
                boxShadow: 'none',
                fontWeight: '500'
              }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Trang Chủ/
              <span className="fw-bold ms-1" style={{ fontSize: '16px' }}> Giỏ Hàng</span>
            </button>
          </div>

          {/* Nội dung Giỏ Hàng */}
          <div className="row">
            <div className="col-12">
              {cartItems.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-cart display-1 text-muted" style={{ fontSize: '4rem', opacity: '0.6' }}></i>
                  </div>
                  <h4 className="text-muted mb-3 fw-normal">Giỏ hàng của bạn trống</h4>
                  <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>Thêm một số cuốn sách để bắt đầu!</p>
                </div>
              ) : (
                <div className="row g-4">
                  {/* Các Mục Giỏ Hàng */}
                  <div className="col-lg-8">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                      <div className="card-header bg-white border-0 py-3">
                        <h5 className="mb-0 fw-bold">Các Mục Giỏ Hàng</h5>
                      </div>
                      <div className="card-body p-0">
                        {cartItems.map((item, index) => (
                          <div key={item.book_id} className={`row align-items-center py-4 px-4 ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`} 
                               style={{ borderColor: '#e9ecef' }}>
                            <div className="col-md-2">
                              <img
                                src={item.image_url || './public/images/book1.jpg'}
                                alt={item.book_title}
                                className="img-fluid rounded"
                                style={{ 
                                  maxHeight: '120px', 
                                  objectFit: 'contain', 
                                  backgroundColor: '#f8f9fa', 
                                  padding: '8px',
                                  borderRadius: '8px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                              />
                            </div>
                            <div className="col-md-4">
                              <h6 className="mb-2 fw-bold text-dark" style={{ fontSize: '1.1rem', lineHeight: '1.3' }}>
                                {item.book_title}
                              </h6>
                              <p className="text-muted small mb-2" style={{ fontSize: '0.9rem' }}>
                                by {item.author}
                              </p>
                              <p className="text-muted small mb-1" style={{ fontSize: '0.85rem' }}>
                                Giá: <span className="fw-semibold">{item.price.toLocaleString('vi-VN')} VNĐ</span>
                              </p>
                              <p className="text-muted small mb-0" style={{ fontSize: '0.85rem' }}>
                                Tổng: <span className="fw-semibold text-primary">{item.total_price.toLocaleString('vi-VN')} VNĐ</span>
                              </p>
                            </div>
                            <div className="col-md-2">
                              <div className="quantity-selector" style={{ 
                                display: 'flex', 
                                border: '1px solid #dee2e6', 
                                borderRadius: '8px',
                                overflow: 'hidden',
                                maxWidth: '120px',
                                backgroundColor: 'white'
                              }}>
                                <button
                                  className="quantity-btn"
                                  onClick={() => updateQuantity(item.book_id, item.quantity - 1)}
                                  style={{ 
                                    border: 'none',
                                    backgroundColor: 'white',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: '#495057',
                                    borderRight: '1px solid #dee2e6',
                                    transition: 'background-color 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                  }}
                                >
                                  -
                                </button>
                                <input
                                  className="quantity-input"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.book_id, parseInt(e.target.value))}
                                  min="1"
                                  style={{ 
                                    border: 'none',
                                    outline: 'none',
                                    textAlign: 'center',
                                    padding: '8px 4px',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: '#495057',
                                    backgroundColor: 'white',
                                    width: '50px',
                                    borderLeft: '1px solid #dee2e6',
                                    borderRight: '1px solid #dee2e6'
                                  }}
                                />
                                <button
                                  className="quantity-btn"
                                  onClick={() => updateQuantity(item.book_id, item.quantity + 1)}
                                  style={{ 
                                    border: 'none',
                                    backgroundColor: 'white',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: '#495057',
                                    transition: 'background-color 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'white';
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <div className="col-md-2 text-center">
                              <span className="fw-bold text-dark" style={{ 
                                fontSize: '1.1rem',
                                whiteSpace: 'nowrap',
                                display: 'inline-block'
                              }}>
                                {item.total_price.toLocaleString('vi-VN')} VNĐ
                              </span>
                            </div>
                            <div className="col-md-2 text-center">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeFromCart(item.book_id)}
                                style={{ 
                                  borderRadius: '8px',
                                  padding: '8px 12px'
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tóm Tắt Đơn Hàng */}
                  <div className="col-lg-4">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                      <div className="card-header bg-white border-0 py-3">
                        <h5 className="mb-0 fw-bold">Tóm Tắt Đơn Hàng</h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between mb-3">
                          <span className="text-muted">Tạm tính ({cartItems.length} mục):</span>
                          <span className="fw-semibold" style={{ whiteSpace: 'nowrap' }}>
                            {calculateTotal.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                          <span className="text-muted">Vận chuyển:</span>
                          <span className="text-success fw-semibold">Miễn phí</span>
                        </div>
                        <hr className="my-3" style={{ borderColor: '#e9ecef' }} />
                        <div className="d-flex justify-content-between mb-4">
                          <strong className="fs-5">Tổng cộng:</strong>
                          <strong className="fs-5 text-primary" style={{ whiteSpace: 'nowrap' }}>
                            {calculateTotal.toLocaleString('vi-VN')} VNĐ
                          </strong>
                        </div>
                        <button
                          className="btn btn-primary w-100 py-3 fw-semibold"
                          onClick={handleCheckout}
                          style={{ 
                            borderRadius: '8px',
                            fontSize: '1rem',
                            boxShadow: '0 4px 12px rgba(13, 110, 253, 0.3)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(13, 110, 253, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.3)';
                          }}
                        >
                          Tiến Hành Thanh Toán
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
