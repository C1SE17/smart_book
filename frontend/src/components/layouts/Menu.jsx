import React, { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../../services';
import { NotificationDropdown } from '../common';

const MenuClient = ({ onNavigateTo, onBackToHome, onFilterByCategory, user, onLogout, onViewAllNotifications }) => {
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [shopDropdownTimeout, setShopDropdownTimeout] = useState(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to mock data if API fails
        setCategories([
          { category_id: 1, name: 'Fiction', book_count: 15 },
          { category_id: 2, name: 'Manga', book_count: 25 },
          { category_id: 3, name: 'Mystery', book_count: 10 },
          { category_id: 4, name: 'Fantasy', book_count: 20 },
          { category_id: 5, name: 'Classic Literature', book_count: 12 }
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (shopDropdownTimeout) {
        clearTimeout(shopDropdownTimeout);
      }
    };
  }, [shopDropdownTimeout]);

  const handleShopMouseEnter = useCallback(() => {
    if (shopDropdownTimeout) {
      clearTimeout(shopDropdownTimeout);
      setShopDropdownTimeout(null);
    }
    setShowShopDropdown(true);
  }, [shopDropdownTimeout]);

  const handleShopMouseLeave = useCallback(() => {
    const timeout = setTimeout(() => {
      setShowShopDropdown(false);
    }, 300);
    setShopDropdownTimeout(timeout);
  }, []);

  const handleCategoriesMouseEnter = useCallback(() => {
    setShowCategoriesDropdown(true);
  }, []);

  const handleCategoriesMouseLeave = useCallback(() => {
    setShowCategoriesDropdown(false);
  }, []);

  const handleCategoryClick = useCallback((categoryId, categoryName) => {
    if (onFilterByCategory) {
      onFilterByCategory(categoryId, categoryName);
    }
    setShowCategoriesDropdown(false);
  }, [onFilterByCategory]);


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

            {/* Shop Dropdown */}
                <li
                  className="nav-item dropdown"
                  onMouseEnter={handleShopMouseEnter}
                  onMouseLeave={handleShopMouseLeave}
                  style={{ position: 'relative' }}
                >
              <a
                className="nav-link dropdown-toggle text-dark fw-normal"
                href="#"
                role="button"
                style={{ fontSize: '1rem', fontFamily: 'sans-serif' }}
              >
                Shop
              </a>
                  {showShopDropdown && (
                    <div
                      className="dropdown-menu show"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        minWidth: '600px',
                        padding: '40px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        border: 'none',
                        animation: 'fadeIn 0.3s ease-in-out',
                        zIndex: 1050,
                        marginTop: '10px',
                        transform: 'translateY(0)',
                        transition: 'none'
                      }}
                      onMouseEnter={handleShopMouseEnter}
                      onMouseLeave={handleShopMouseLeave}
                    >
                      <div className="row">
                        {/* Categories Column */}
                        <div className="col-md-6">
                          <h6 className="fw-bold mb-3" style={{ fontSize: '1.2rem', color: '#333' }}>Categories</h6>
                          <div className="d-flex flex-column">
                            {categoriesLoading ? (
                              <div className="text-muted">Loading categories...</div>
                            ) : (
                              categories.slice(0, 6).map((category) => (
                                <a 
                                  key={category.category_id} 
                                  href="#" 
                                  className="dropdown-item mb-2" 
                                  style={{ fontSize: '1rem', lineHeight: '1.4' }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleCategoryClick(category.category_id, category.name);
                                    setShowShopDropdown(false);
                                  }}
                                >
                                  {category.name}
                                  {category.book_count && (
                                    <span className="text-muted ms-2">({category.book_count})</span>
                                  )}
                                </a>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Shop Pages Column */}
                        <div className="col-md-6">
                          <h6 className="fw-bold mb-3" style={{ fontSize: '1.2rem', color: '#333' }}>Shop Pages</h6>
                          <div className="d-flex flex-column">
                            <a 
                              href="#" 
                              className="dropdown-item mb-2" 
                              style={{ fontSize: '1rem', lineHeight: '1.4' }}
                              onClick={(e) => {
                                e.preventDefault();
                                onNavigateTo('books')();
                                setShowShopDropdown(false);
                              }}
                            >
                              Shop
                            </a>
                            <a 
                              href="#" 
                              className="dropdown-item mb-2" 
                              style={{ fontSize: '1rem', lineHeight: '1.4' }}
                              onClick={(e) => {
                                e.preventDefault();
                                onNavigateTo('cart')();
                                setShowShopDropdown(false);
                              }}
                            >
                              Cart
                            </a>
                            <a 
                              href="#" 
                              className="dropdown-item mb-2" 
                              style={{ fontSize: '1rem', lineHeight: '1.4' }}
                              onClick={(e) => {
                                e.preventDefault();
                                onNavigateTo('books')();
                                setShowShopDropdown(false);
                              }}
                            >
                              Checkout
                            </a>
                            <a 
                              href="#" 
                              className="dropdown-item mb-2" 
                              style={{ fontSize: '1rem', lineHeight: '1.4' }}
                              onClick={(e) => {
                                e.preventDefault();
                                onNavigateTo('profile')();
                                setShowShopDropdown(false);
                              }}
                            >
                              My account
                            </a>
                          </div>
                        </div>
                      </div>
                </div>
              )}
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
                    <i className="fas fa-search" style={{ fontSize: '1.2rem' }}></i>
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
                    <i className="fas fa-shopping-cart" style={{ fontSize: '1.2rem' }}></i>
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
                        <i className="fas fa-user me-2" style={{ fontSize: '1.2rem' }}></i>
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
                              // Navigate to settings tab
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
                              // Navigate to orders tab
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
                              // Navigate to security tab
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
                  <i className="fas fa-user" style={{ fontSize: '1.2rem' }}></i>
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>

          {/* CSS for animations */}
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            .dropdown-item:hover {
              background-color: #f8f9fa;
              transform: translateX(5px);
              transition: all 0.3s ease;
            }

            .dropdown-menu {
              transform: translateY(0) !important;
              transition: none !important;
            }

          `}</style>
    </nav>
  );
};

export default MenuClient;