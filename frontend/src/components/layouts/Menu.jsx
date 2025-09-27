import React, { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../../services';

const MenuClient = ({ onNavigateTo, onBackToHome, onFilterByCategory }) => {
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        console.log('Fetching categories...');
        const data = await categoryService.getAll();
        console.log('Categories fetched:', data);
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

  const handleShopMouseEnter = useCallback(() => {
    setShowShopDropdown(true);
  }, []);

  const handleShopMouseLeave = useCallback(() => {
    setShowShopDropdown(false);
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
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top" style={{ borderTop: '3px solid #8B5CF6', zIndex: 1000 }}>
      <div className="container">
        {/* Brand Name */}
        <a 
          className="navbar-brand fw-bold text-dark" 
          href="#" 
          onClick={(e) => { e.preventDefault(); onBackToHome(); }}
          style={{ 
            fontSize: '1.5rem',
            fontFamily: 'sans-serif',
            letterSpacing: '0.5px'
          }}
        >
          SMART BOOK
        </a>

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
                    minWidth: '800px',
                    padding: '40px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    border: 'none',
                    animation: 'fadeIn 0.3s ease-in-out'
                  }}
                >
                  <div className="row">
                    {/* Product Types Column */}
                    <div className="col-md-3">
                      <h6 className="fw-bold mb-3" style={{ fontSize: '1.2rem', color: '#333' }}>Sách</h6>
                      <div className="d-flex flex-column">
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Fiction</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Non-Fiction</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Science</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>History</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Biography</a>
                      </div>
                    </div>

                    {/* Chính trị & Cuộc sống Column */}
                    <div className="col-md-3">
                      <h6 className="fw-bold mb-3" style={{ fontSize: '1.2rem', color: '#333' }}>Chính trị & Cuộc sống</h6>
                      <div className="d-flex flex-column">
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Politics</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Economics</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Philosophy</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Self-Help</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Psychology</a>
                      </div>
                    </div>

                    {/* Đồ chơi & Khác Column */}
                    <div className="col-md-3">
                      <h6 className="fw-bold mb-3" style={{ fontSize: '1.2rem', color: '#333' }}>Đồ chơi & Khác</h6>
                      <div className="d-flex flex-column">
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Toys</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Games</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Stationery</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Gifts</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4', whiteSpace: 'nowrap' }}>Phong Cách Sống - Làm đẹp</a>
                      </div>
                    </div>

                    {/* Shop Pages Column */}
                    <div className="col-md-3">
                      <h6 className="fw-bold mb-3" style={{ fontSize: '1.2rem', color: '#333' }}>Shop Pages</h6>
                      <div className="d-flex flex-column">
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Best Sellers</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>New Arrivals</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Sale</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Featured</a>
                        <a href="#" className="dropdown-item mb-2" style={{ fontSize: '1rem', lineHeight: '1.4' }}>Reviews</a>
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
            {/* Notification Bell */}
            <li className="nav-item me-3">
              <a 
                className="nav-link position-relative" 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigateTo('notification')(); }}
                style={{ color: '#333' }}
              >
                <i className="bi bi-bell" style={{ fontSize: '1.2rem' }}></i>
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.6rem', width: '8px', height: '8px' }}
                >
                </span>
              </a>
            </li>

            {/* Search Icon */}
            <li className="nav-item me-3">
              <a 
                className="nav-link" 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigateTo('search')(); }}
                style={{ color: '#333' }}
              >
                <i className="bi bi-search" style={{ fontSize: '1.2rem' }}></i>
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
                <i className="bi bi-cart" style={{ fontSize: '1.2rem' }}></i>
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.6rem', width: '8px', height: '8px' }}
                >
                </span>
              </a>
            </li>

            {/* User Profile */}
            <li className="nav-item">
              <a 
                className="nav-link" 
                href="#" 
                onClick={(e) => { e.preventDefault(); onNavigateTo('auth')(); }}
                style={{ color: '#333' }}
              >
                <i className="bi bi-person" style={{ fontSize: '1.2rem' }}></i>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
          transform: translateX(5px);
          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: #8B5CF6 !important;
          transition: color 0.3s ease;
        }

        .navbar-brand:hover {
          color: #8B5CF6 !important;
          transition: color 0.3s ease;
        }

        .nav-link:hover i {
          color: #8B5CF6 !important;
          transition: color 0.3s ease;
        }
      `}</style>
    </nav>
  );
};

export default MenuClient;