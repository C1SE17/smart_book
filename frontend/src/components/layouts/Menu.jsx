import React, { useState, useCallback, useEffect } from 'react';
import { NotificationDropdown } from '../common';

const MenuClient = ({ onNavigateTo, onBackToHome, user, onLogout, onViewAllNotifications }) => {
  const [cartItemCount, setCartItemCount] = useState(0);


  // Cập nhật số lượng mục trong giỏ hàng
  const updateCartCount = useCallback(async () => {
    if (!user) {
      setCartItemCount(0);
      return;
    }

    try {
      // Get cart items from localStorage
      const cartKey = `cart_${user.user_id}`;
      const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
      
      // Calculate total quantity of all items
      const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
      setCartItemCount(totalQuantity);
      
      console.log('🛒 Cart count updated:', totalQuantity, 'items');
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartItemCount(0);
    }
  }, [user]);

  // Lắng nghe cập nhật giỏ hàng
  useEffect(() => {
    updateCartCount();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Listen for storage changes (when cart is updated from another component)
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, [updateCartCount]);

  // Reload cart count when user changes
  useEffect(() => {
    updateCartCount();
  }, [user, updateCartCount]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" style={{ borderTop: '3px solid #8B5CF6', zIndex: 1040 }}>
      <div className="container">
        {/* Brand Logo */}
        <img
          src="/images/Logo.png"
          alt="SMART BOOK"
          className="navbar-brand"
          onClick={onBackToHome}
          style={{
            height: '60px',
            width: 'auto',
            cursor: 'pointer',
            filter: 'brightness(0) invert(1)', // Chuyển thành màu trắng
            transition: 'opacity 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.opacity = '0.8'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        />


        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ borderColor: 'rgba(255,255,255,0.5)' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a
                className="nav-link text-white fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onBackToHome(); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                Trang Chủ
              </a>
            </li>

            {/* Shop Link */}
            <li className="nav-item">
              <a
                className="nav-link text-white fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('books'); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                Shop
              </a>
            </li>


            <li className="nav-item">
              <a
                className="nav-link text-white fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('blog'); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                Blog
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-white fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('author'); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                Tác Giả
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link text-white fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('about'); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                Về Chúng Tôi
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link text-white fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('contact'); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                Liên Hệ
              </a>
            </li>
          </ul>

          {/* Right Side Icons */}
          <ul className="navbar-nav">
            {/* Notification Dropdown */}
            <li className="nav-item me-3">
              <NotificationDropdown onViewAllNotifications={onViewAllNotifications} />
            </li>

            {/* Search Icon */}
            <li className="nav-item me-3">
              <a
                className="nav-link"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('search'); }}
                style={{ color: '#fff' }}
              >
                <i className="fas fa-search" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
              </a>
            </li>

            {/* Cart */}
            <li className="nav-item me-3">
              <a
                className="nav-link position-relative"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('cart'); }}
                style={{ color: '#fff' }}
              >
                <i className="fas fa-shopping-cart" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
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
              </a>
            </li>

            {/* User Profile */}
            <li className="nav-item">
              {user ? (
                <div className="dropdown">
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ color: '#fff' }}
                    onClick={() => {
                      console.log('Current user data:', user);
                      console.log('User role:', user.role);
                    }}
                  >
                    <i className="fas fa-user me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                    <span className="fw-medium">{user.name || user.email || 'User'}</span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigateTo('profile');
                        }}
                      >
                        <i className="fas fa-user me-2"></i>
                        Profile
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigateTo('orders');
                        }}
                      >
                        <i className="fas fa-shopping-bag me-2"></i>
                        Đơn Hàng
                      </a>
                    </li>
                    {user.role === 'admin' && (
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onNavigateTo('admin-dashboard');
                          }}
                        >
                          <i className="fas fa-cog me-2"></i>
                          Admin Dashboard
                        </a>
                      </li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={(e) => {
                          e.preventDefault();
                          onLogout();
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <a
                  className="nav-link"
                  href="#"
                  onClick={(e) => { e.preventDefault(); onNavigateTo('auth'); }}
                  style={{ color: '#fff' }}
                >
                  <i className="fas fa-user" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>

    </nav>
  );
};

export default MenuClient;