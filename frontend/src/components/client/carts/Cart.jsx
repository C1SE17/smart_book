import React, { useState, useEffect, useCallback, useMemo } from 'react';
import apiService from '../../../services';
import { useLanguage } from '../../../contexts/LanguageContext';

const Cart = ({ onBackToHome, onNavigateTo }) => {
  const { t } = useLanguage();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchCartItems = useCallback(async () => {
    setLoading(true);

    try {
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user) {
        console.log(' No user found, cart is empty');
        setCartItems([]);
        setLoading(false);
        return;
      }

      // Get cart data from localStorage (consistent with other components)
      const cartKey = `cart_${user.user_id}`;
      const cartData = JSON.parse(localStorage.getItem(cartKey) || '[]');

      console.log('  Fetching cart items from localStorage for user:', user.user_id);
      console.log('  Cart data from localStorage:', cartData);

      if (!Array.isArray(cartData) || cartData.length === 0) {
        console.log('  No cart items found in localStorage');
        setCartItems([]);
        setLoading(false);
        return;
      }

      console.log('  Found', cartData.length, 'items in localStorage cart');

      // Transform localStorage data to match expected format
      const itemsWithDetails = cartData.map((item) => {
        return {
          cart_item_id: item.book_id, // Use book_id as cart_item_id for now
          book_id: item.book_id,
          book_title: item.title || `Book ${item.book_id}`,
          author: item.author_name || 'Unknown Author',
          price: item.price || 0,
          quantity: item.quantity || 1,
          total_price: (item.price || 0) * (item.quantity || 1),
          image_url: item.cover_image || '/images/book1.jpg',
          category_name: item.category_name || 'Unknown Category',
          publisher_name: item.publisher_name || 'Unknown Publisher'
        };
      });

      setCartItems(itemsWithDetails);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
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

  const removeFromCart = useCallback(async (bookId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user) return;

      // TODO: Implement real cart API
      // const { cartApi } = await import('../../../services/cartApi');
      // await cartApi.removeFromCart(user.user_id, bookId);

      // Remove from localStorage
      const cartKey = `cart_${user.user_id}`;
      const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const updatedCart = cartItems.filter(item => item.book_id !== bookId);
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));

      // Refresh cart items
      fetchCartItems();

      // Kích hoạt sự kiện cập nhật giỏ hàng
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { action: 'remove', bookId }
      }));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  }, [fetchCartItems]);

  const updateQuantity = useCallback(async (bookId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(bookId);
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user) return;

      // TODO: Implement real cart API
      // const { cartApi } = await import('../../../services/cartApi');
      // await cartApi.updateCartItemQuantity(user.user_id, bookId, newQuantity);

      // Update localStorage
      const cartKey = `cart_${user.user_id}`;
      const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const updatedCart = cartItems.map(item =>
        item.book_id === bookId ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));

      // Refresh cart items
      fetchCartItems();

      // Kích hoạt sự kiện cập nhật giỏ hàng
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { action: 'update', bookId, newQuantity }
      }));
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }, [removeFromCart, fetchCartItems]);

  // Xử lý chọn/bỏ chọn sản phẩm
  const handleItemSelect = useCallback((bookId) => {
    setSelectedItems(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
  }, []);

  // Xử lý chọn tất cả
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      const allBookIds = cartItems.map(item => item.book_id);
      setSelectedItems(allBookIds);
      setSelectAll(true);
    }
  }, [selectAll, cartItems]);

  // Cập nhật selectAll khi selectedItems thay đổi
  useEffect(() => {
    if (cartItems.length > 0) {
      setSelectAll(selectedItems.length === cartItems.length);
    }
  }, [selectedItems, cartItems]);

  // Tính tổng tiền các sản phẩm đã chọn
  const calculateSelectedTotal = useMemo(() => {
    return selectedItems.reduce((total, bookId) => {
      const item = cartItems.find(item => item.book_id === bookId);
      return total + (item ? parseFloat(item.total_price) : 0);
    }, 0);
  }, [selectedItems, cartItems]);

  // Tính tổng tiền tất cả sản phẩm
  const calculateTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + parseFloat(item.total_price);
    }, 0);
  }, [cartItems]);

  // Xóa các sản phẩm đã chọn
  const removeSelectedItems = useCallback(() => {
    if (selectedItems.length === 0) {
      alert(t('cart.messages.selectToRemove'));
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user) return;

      const cartKey = `cart_${user.user_id}`;
      let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      cart = cart.filter(item => !selectedItems.includes(item.book_id));
      localStorage.setItem(cartKey, JSON.stringify(cart));

      setSelectedItems([]);
      setSelectAll(false);
      fetchCartItems();

      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { cart, action: 'remove_selected', count: selectedItems.length }
      }));
    } catch (error) {
      console.error('Error removing selected items:', error);
    }
  }, [selectedItems, fetchCartItems]);

  // Xóa tất cả sản phẩm trong giỏ hàng
  const removeAllItems = useCallback(async () => {
    if (cartItems.length === 0) {
      alert(t('cart.messages.cartEmpty'));
      return;
    }

    if (window.confirm(t('cart.messages.removeAllConfirm', { count: cartItems.length }))) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) {
          alert(t('cart.messages.loginRequired'));
          return;
        }

        // TODO: Implement real cart API
        // const { cartApi } = await import('../../../services/cartApi');
        // for (const item of cartItems) {
        //   await cartApi.removeFromCart(user.user_id, item.book_id);
        // }

        // Clear localStorage
        const cartKey = `cart_${user.user_id}`;
        localStorage.setItem(cartKey, JSON.stringify([]));

        setSelectedItems([]);
        setSelectAll(false);
        fetchCartItems();

        // Hiển thị thông báo thành công
        if (window.showToast) {
          window.showToast(t('cart.messages.removeAllSuccess', { count: cartItems.length }), 'success');
        }

        window.dispatchEvent(new CustomEvent('cartUpdated', {
          detail: { action: 'remove_all', count: cartItems.length }
        }));
      } catch (error) {
        console.error('Error removing all items:', error);
        if (window.showToast) {
          window.showToast(t('cart.messages.removeAllError'), 'error');
        }
      }
    }
  }, [cartItems, fetchCartItems]);

  const handleCheckout = useCallback(() => {
    if (selectedItems.length === 0) {
      alert(t('cart.messages.checkoutRequired'));
      return;
    }

    // Lưu các sản phẩm đã chọn vào sessionStorage để checkout
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.book_id)).map(item => ({
      ...item,
      book_id: item.book_id,
      title: item.book_title || item.title,
      price: item.price,
      quantity: item.quantity,
      cover_image: item.cover_image || item.image_url || '/images/book1.jpg', // Đảm bảo có cover_image
      author: item.author,
      publisher: item.publisher_name || item.publisher,
      cart_item_id: item.book_id, // Add cart_item_id to identify items from cart
      source: 'cart' // Mark as coming from cart
    }));
    sessionStorage.setItem('checkoutItems', JSON.stringify(selectedCartItems));

    // Hiển thị thông báo thành công
    if (window.showToast) {
      window.showToast(t('cart.messages.checkoutSelected', { count: selectedItems.length }), 'success');
    }

    // Chuyển đến trang thanh toán
    console.log('Proceeding to checkout with selected items:', selectedCartItems);
    onNavigateTo('checkout');
  }, [selectedItems, cartItems, onNavigateTo]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">{t('cart.states.loading')}</span>
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
            {t('cart.breadcrumb.home')}/
            <span className="fw-bold ms-1" style={{ fontSize: '16px' }}> {t('cart.breadcrumb.cart')}</span>
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
                  <h4 className="text-muted mb-3 fw-normal">{t('cart.states.emptyTitle')}</h4>
                  <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>{t('cart.states.emptySubtitle')}</p>
                </div>
              ) : (
                <div className="row g-4">
                  {/* Các Mục Giỏ Hàng */}
                  <div className="col-lg-8">
                    <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
                      <div className="card-header bg-white border-0 py-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="mb-0 fw-bold">{t('cart.sections.items')}</h5>
                          {cartItems.length > 0 && (
                            <div className="d-flex align-items-center gap-2">
                              <button
                                className={`btn btn-sm ${selectAll ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={handleSelectAll}
                                style={{ borderRadius: '6px' }}
                              >
                                <i className={`bi ${selectAll ? 'bi-check-square' : 'bi-square'} me-1`}></i>
                                {selectAll ? t('cart.actions.deselectAll') : t('cart.actions.selectAll')}
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={removeAllItems}
                                style={{ borderRadius: '6px' }}
                              >
                                <i className="bi bi-trash me-1"></i>
                                {t('cart.actions.removeAll')}
                              </button>
                              {selectedItems.length > 0 && (
                                <button
                                  className="btn btn-outline-warning btn-sm"
                                  onClick={removeSelectedItems}
                                  style={{ borderRadius: '6px' }}
                                >
                                  <i className="bi bi-trash me-1"></i>
                                  {t('cart.actions.removeSelected', { count: selectedItems.length })}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="card-body p-0">
                        {cartItems.map((item, index) => (
                          <div key={item.book_id} className={`row align-items-center py-4 px-4 ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`}
                            style={{ borderColor: '#e9ecef' }}>
                            <div className="col-md-1">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={selectedItems.includes(item.book_id)}
                                  onChange={() => handleItemSelect(item.book_id)}
                                  id={`item-${item.book_id}`}
                                  style={{ transform: 'scale(1.2)' }}
                                />
                              </div>
                            </div>
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
                              <div className="d-flex align-items-center mb-1">
                                <p className="text-muted small mb-0 me-3" style={{ fontSize: '0.85rem' }}>
                                  {t('cart.labels.price')} <span className="fw-semibold">{item.price.toLocaleString('vi-VN')} VNĐ</span>
                                </p>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => removeFromCart(item.book_id)}
                                  style={{
                                    borderRadius: '8px',
                                    padding: '4px 8px',
                                    fontSize: '0.75rem'
                                  }}
                                >
                                  <i className="bi bi-trash me-1"></i>
                                  {t('cart.actions.remove')}
                                </button>
                              </div>
                              <p className="text-muted small mb-0" style={{ fontSize: '0.85rem' }}>
                                {t('cart.labels.itemTotal')} <span className="fw-semibold text-dark">{item.total_price.toLocaleString('vi-VN')} VNĐ</span>
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
                            <div className="col-md-3 text-center">
                              <span className="fw-bold text-dark" style={{
                                fontSize: '1.1rem',
                                whiteSpace: 'nowrap',
                                display: 'inline-block'
                              }}>
                                {item.total_price.toLocaleString('vi-VN')} VNĐ
                              </span>
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
                        <h5 className="mb-0 fw-bold">{t('cart.sections.summary')}</h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between mb-3">
                          <span className="text-muted">
                            {t('cart.labels.subtotal', { count: selectedItems.length })}
                          </span>
                          <span className="fw-semibold" style={{ whiteSpace: 'nowrap' }}>
                            {calculateSelectedTotal.toLocaleString('vi-VN')} VNĐ
                          </span>
                        </div>
                        <hr className="my-3" style={{ borderColor: '#e9ecef' }} />
                        <div className="d-flex justify-content-between mb-4">
                          <strong className="fs-5">{t('cart.labels.total')}</strong>
                          <strong className="fs-5 text-primary" style={{ whiteSpace: 'nowrap' }}>
                            {calculateSelectedTotal.toLocaleString('vi-VN')} VNĐ
                          </strong>
                        </div>

                        {selectedItems.length > 0 ? (
                          <>
                            <button
                              className="btn btn-success w-100 py-3 fw-semibold mb-2"
                              onClick={handleCheckout}
                              style={{
                                borderRadius: '8px',
                                fontSize: '1rem',
                                boxShadow: '0 4px 12px rgba(25, 135, 84, 0.3)',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(25, 135, 84, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(25, 135, 84, 0.3)';
                              }}
                            >
                              <i className="bi bi-credit-card me-2"></i>
                              {t('cart.actions.checkout')}
                            </button>
                            <button
                              className="btn btn-outline-secondary w-100 py-2"
                              onClick={() => {
                                setSelectedItems([]);
                                setSelectAll(false);
                              }}
                              style={{ borderRadius: '8px' }}
                            >
                              <i className="bi bi-x-circle me-2"></i>
                              {t('cart.actions.clearSelection')}
                            </button>
                          </>
                        ) : (
                          <div className="alert alert-warning">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {t('cart.messages.checkoutRequired')}
                          </div>
                        )}
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
