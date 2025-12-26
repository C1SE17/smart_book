import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const MenuClient = ({ onNavigateTo, onBackToHome, user, onLogout }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user); // Local state để đảm bảo cập nhật
  const dropdownRef = useRef(null);
  const { t, language, toggleLanguage } = useLanguage();
  const nav = t('nav', { returnObjects: true });
  const languageToggle = t('languageToggle', { returnObjects: true });
  const isAdmin = currentUser?.role === 'admin';


  const updateCartCount = useCallback(async () => {
    if (!currentUser || currentUser.role === 'admin') {
      setCartItemCount(0);
      return;
    }

    try {
      const cartKey = `cart_${currentUser.user_id}`;
      const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const totalQuantity = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
      setCartItemCount(totalQuantity);
    } catch (error) {
      setCartItemCount(0);
    }
  }, [currentUser]);

  useEffect(() => {
    updateCartCount();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, [updateCartCount]);

  useEffect(() => {
    updateCartCount();
  }, [currentUser, updateCartCount]);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    const handleUserLoggedIn = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setCurrentUser(parsedUser);
        } catch (error) {
          // Silent fail
        }
      }
    };

    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        // Close Bootstrap dropdown if it's open
        const dropdownElement = dropdownRef.current?.querySelector('[data-bs-toggle="dropdown"]');
        if (dropdownElement) {
          const bsDropdown = window.bootstrap?.Dropdown?.getInstance(dropdownElement);
          if (bsDropdown) {
            bsDropdown.hide();
          }
        }
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

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
                {nav.home}
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
                {nav.shop}
              </a>
            </li>


            <li className="nav-item">
              <a
                className="nav-link text-white fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('blog'); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                {nav.blog}
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-white fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('author'); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                {nav.author}
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link text-white fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('about'); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                {nav.about}
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link text-white fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('contact'); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                {nav.contact}
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-white fw-normal"
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigateTo('ai-ask'); }}
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                {nav.aiAsk}
              </a>
            </li>
          </ul>

          {/* Right Side Icons */}
        <ul className="navbar-nav align-items-center">
          <li className="nav-item me-3">
            <button
              type="button"
              className="btn btn-outline-light btn-sm fw-semibold"
              onClick={toggleLanguage}
              title={languageToggle.tooltip}
              style={{ minWidth: '80px' }}
            >
              <span className={language === 'vi' ? 'fw-bold text-light' : 'text-white-50'}>
                {languageToggle.vi}
              </span>
              <span className="mx-1">/</span>
              <span className={language === 'en' ? 'fw-bold text-light' : 'text-white-50'}>
                {languageToggle.en}
              </span>
            </button>
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
            {!isAdmin && (
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
            )}

            {/* User Profile */}
            <li className="nav-item">
              {currentUser ? (
                <div className="dropdown" ref={dropdownRef}>
                  <a
                    className="nav-link dropdown-toggle d-flex align-items-center"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded={dropdownOpen}
                    style={{ color: '#fff' }}
                    onClick={(e) => {
                      e.preventDefault();
                      setDropdownOpen(!dropdownOpen);
                    }}
                  >
                    <i className="fas fa-user me-2" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                    <span className="fw-medium">{currentUser.name || currentUser.email || currentUser.role || 'User'}</span>
                  </a>
                  <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`}>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          // Close Bootstrap dropdown
                          const dropdownElement = dropdownRef.current?.querySelector('[data-bs-toggle="dropdown"]');
                          if (dropdownElement) {
                            const bsDropdown = window.bootstrap?.Dropdown?.getInstance(dropdownElement);
                            if (bsDropdown) {
                              bsDropdown.hide();
                            }
                          }
                          onNavigateTo('profile');
                        }}
                      >
                        <i className="fas fa-user me-2"></i>
                        {nav.profile}
                      </a>
                    </li>
                    {currentUser.role !== 'admin' && (
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropdownOpen(false);
                            // Close Bootstrap dropdown
                            const dropdownElement = dropdownRef.current?.querySelector('[data-bs-toggle="dropdown"]');
                            if (dropdownElement) {
                              const bsDropdown = window.bootstrap?.Dropdown?.getInstance(dropdownElement);
                              if (bsDropdown) {
                                bsDropdown.hide();
                              }
                            }
                            onNavigateTo('orders');
                          }}
                        >
                          <i className="fas fa-shopping-bag me-2"></i>
                          {nav.orders}
                        </a>
                      </li>
                    )}
                    {currentUser.role === 'admin' && (
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setDropdownOpen(false);
                            // Close Bootstrap dropdown
                            const dropdownElement = dropdownRef.current?.querySelector('[data-bs-toggle="dropdown"]');
                            if (dropdownElement) {
                              const bsDropdown = window.bootstrap?.Dropdown?.getInstance(dropdownElement);
                              if (bsDropdown) {
                                bsDropdown.hide();
                              }
                            }
                            onNavigateTo('admin-dashboard');
                          }}
                        >
                          <i className="fas fa-cog me-2"></i>
                          {nav.adminDashboard}
                        </a>
                      </li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={(e) => {
                          e.preventDefault();
                          setDropdownOpen(false);
                          // Close Bootstrap dropdown
                          const dropdownElement = dropdownRef.current?.querySelector('[data-bs-toggle="dropdown"]');
                          if (dropdownElement) {
                            const bsDropdown = window.bootstrap?.Dropdown?.getInstance(dropdownElement);
                            if (bsDropdown) {
                              bsDropdown.hide();
                            }
                          }
                          onLogout();
                        }}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        {nav.logout}
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="dropdown">
                  <a
                    className="nav-link"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ color: '#fff' }}
                  >
                    <i className="fas fa-user" style={{ fontSize: '1.2rem', width: '20px', height: '20px' }}></i>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigateTo('auth');
                        }}
                      >
                        <i className="fas fa-sign-in-alt me-2"></i>
                        {nav.login}
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigateTo('register');
                        }}
                      >
                        <i className="fas fa-user-plus me-2"></i>
                        {nav.register}
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>

    </nav>
  );
};

export default MenuClient;