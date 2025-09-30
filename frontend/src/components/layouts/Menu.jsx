import React, { useState, useCallback, useEffect } from 'react';
import { NotificationDropdown } from '../common';

const MenuClient = ({ onNavigateTo, onBackToHome, user, onLogout, onViewAllNotifications }) => {
  const [cartItemCount, setCartItemCount] = useState(0);


  // Cập nhật số lượng mục trong giỏ hàng
  const updateCartCount = useCallback(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartItemCount(totalItems);
  }, []);

  // Lắng nghe cập nhật giỏ hàng
  useEffect(() => {
    updateCartCount();
    
    const handleCartUpdate = () => {
      updateCartCount();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [updateCartCount]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top" style={{ borderTop: '3px solid #8B5CF6', zIndex: 1040 }}>
      <div className="container">
        {/* Brand Name */}
        <span
          className="navbar-brand fw-bold text-dark"
          onClick={onBackToHome}
          style={{
            fontSize: '1.5rem',
            fontFamily: 'sans-serif',
            letterSpacing: '0.5px',
            cursor: 'pointer',

          }}
        >
          SMART BOOK
        </span>


        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a
                className="nav-link text-dark fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onBackToHome(); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                Home
              </a>
            </li>

            {/* Shop Link */}
            <li className="nav-item">
              <a
                className="nav-link text-dark fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('books')(); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                Shop
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link text-dark fw-normal"
                href="#"
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                Blog
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link text-dark fw-normal"
                href="#"
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                Pages
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link text-dark fw-normal"
                href="#"
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                Contact
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
                    onClick={(e) => { e.preventDefault(); onNavigateTo('search')(); }}
                    style={{ color: '#333' }}
                  >
                    <i className="fas fa-search" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                  </a>
                </li>

                {/* Cart */}
                <li className="nav-item me-3">
                  <a
                    className="nav-link position-relative"
                    href="#"
                    onClick={(e) => { e.preventDefault(); onNavigateTo('cart')(); }}
                    style={{ color: '#333' }}
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
                        style={{ color: '#333' }}
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
                              onNavigateTo('profile')();
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
                              onNavigateTo('profile')();
                              // Chuyển đến tab cài đặt
                              setTimeout(() => {
                                window.history.pushState({}, '', '/profile/settings');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                              }, 100);
                            }}
                          >
                            <i className="fas fa-cog me-2"></i>
                            Cài đặt
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onNavigateTo('profile')();
                              // Chuyển đến tab đơn hàng
                              setTimeout(() => {
                                window.history.pushState({}, '', '/profile/orders');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                              }, 100);
                            }}
                          >
                            <i className="fas fa-shopping-bag me-2"></i>
                            Đơn hàng
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onNavigateTo('profile')();
                              // Chuyển đến tab bảo mật
                              setTimeout(() => {
                                window.history.pushState({}, '', '/profile/security');
                                window.dispatchEvent(new PopStateEvent('popstate'));
                              }, 100);
                            }}
                          >
                            <i className="fas fa-shield-alt me-2"></i>
                            Bảo mật
                          </a>
                        </li>
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
                  onClick={(e) => { e.preventDefault(); onNavigateTo('auth')(); }}
                  style={{ color: '#333' }}
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