import React, { useState, useCallback, useEffect } from 'react';
import { NotificationDropdown } from '../common';

const TopBar = ({ onViewAllNotifications, user }) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  // Cập nhật số lượng mục trong giỏ hàng
  const updateCartCount = useCallback(async () => {
    try {
      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user) {
        setCartItemCount(0);
        return;
      }

      // Get cart items from localStorage
      const cartKey = `cart_${user.user_id}`;
      const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
      
      // Calculate total quantity of all items
      const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
      setCartItemCount(totalQuantity);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartItemCount(0);
    }
  }, []);

  // Lắng nghe cập nhật giỏ hàng
  useEffect(() => {
    updateCartCount();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [updateCartCount]);

  return (
    <div className="bg-light py-2">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-6">
            <span className="text-muted">Home</span>
          </div>
          <div className="col-6 text-end">
            <div className="d-flex align-items-center justify-content-end gap-3">
              {/* Search Icon */}
              <i className="bi bi-search fs-5 text-dark" style={{ cursor: 'pointer' }}></i>
              
              {/* Notification Dropdown */}
              <NotificationDropdown onViewAllNotifications={onViewAllNotifications} />
              
              {/* Cart Icon */}
              <div className="position-relative">
                <i className="bi bi-cart fs-5 text-dark" style={{ cursor: 'pointer' }}></i>
                {cartItemCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{
                      fontSize: '0.7rem',
                      minWidth: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
