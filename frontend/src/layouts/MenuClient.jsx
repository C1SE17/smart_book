import React, { useState, useCallback } from 'react';

const MenuClient = ({ onNavigateTo, onBackToHome, onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [showShopDropdown, setShowShopDropdown] = useState(false);

  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setSearchInput('');
    }
  }, [searchInput, onSearch]);

  const handleSearchClick = useCallback(() => {
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setSearchInput('');
    } else {
      onNavigateTo('search')();
    }
  }, [searchInput, onSearch, onNavigateTo]);

  const handleShopMouseEnter = useCallback(() => {
    setShowShopDropdown(true);
  }, []);

  const handleShopMouseLeave = useCallback(() => {
    setShowShopDropdown(false);
  }, []);
  return (
    <>
      <style>
        {`
          .no-hover:hover {
            color: inherit !important;
            background-color: inherit !important;
            transform: none !important;
            transition: none !important;
          }
          .no-hover i:hover {
            color: inherit !important;
          }
          
          .dropdown-menu a:hover {
            color: #007bff !important;
            background-color: transparent !important;
          }
          
          .dropdown-menu {
            animation: fadeIn 0.2s ease-in-out;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      {/* Main Navigation Bar - White */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">
        <div className="container">
          {/* Logo */}
          <a className="navbar-brand fw-bold text-dark fs-3" href="#" onClick={onBackToHome}>
            SMART BOOK
          </a>

          {/* Mobile Toggle Button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Content */}
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Navigation Links */}
            <div className="navbar-nav mx-auto">
              <a className="nav-link text-dark me-4" href="#" onClick={onBackToHome}>Home</a>
              
              {/* Shop with Dropdown */}
              <div 
                className="nav-item dropdown me-4 position-relative"
                onMouseEnter={handleShopMouseEnter}
                onMouseLeave={handleShopMouseLeave}
              >
                <a className="nav-link text-dark d-flex align-items-center" href="#">
                  Shop
                  <i className="bi bi-chevron-down ms-1" style={{ fontSize: '0.8rem' }}></i>
                </a>
                
                {/* Dropdown Menu */}
                {showShopDropdown && (
                  <div 
                    className="dropdown-menu show position-absolute"
                    style={{
                      top: '100%',
                      left: '0',
                      minWidth: '400px',
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 6px 25px rgba(0,0,0,0.15)',
                      padding: '30px',
                      zIndex: 1000
                    }}
                  >
                    <div className="row">
                      {/* Left Column - Product Types */}
                      <div className="col-6">
                        <h6 className="fw-bold mb-4" style={{ fontSize: '1.1rem' }}>Sách</h6>
                        <ul className="list-unstyled mb-0">
                          <li className="mb-3">
                            <a href="#" className="text-dark text-decoration-none" style={{ fontSize: '1rem' }}>
                              Sách Truyện
                            </a>
                          </li>
                          <li className="mb-3">
                            <a href="#" className="text-dark text-decoration-none" style={{ fontSize: '1rem' }}>
                              Sách Ngoại Văn
                            </a>
                          </li>
                          <li className="mb-3">
                            <a href="#" className="text-dark text-decoration-none" style={{ fontSize: '1rem' }}>
                              Sách Sale theo chủ đề
                            </a>
                          </li>
                          <li className="mb-3">
                            <a href="#" className="text-dark text-decoration-none" style={{ fontSize: '1rem' }}>
                              Sách theo tác giả
                            </a>
                          </li>
                          <li className="mb-3">
                            <a href="#" className="text-dark text-decoration-none" style={{ fontSize: '1rem' }}>
                              Sách theo nhà cung cấp
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-dark text-decoration-none" style={{ fontSize: '1rem' }}>
                              Văn phòng phẩm
                            </a>
                          </li>
                        </ul>
                      </div>
                      
                      {/* Right Column - Shop Pages */}
                      <div className="col-6">
                        <h6 className="fw-bold mb-4" style={{ fontSize: '1.1rem' }}>Shop Pages</h6>
                        <ul className="list-unstyled mb-0">
                          <li className="mb-3">
                            <a href="#" className="text-dark text-decoration-none" style={{ fontSize: '1rem' }}>
                              Shop
                            </a>
                          </li>
                          <li className="mb-3">
                            <a href="#" className="text-dark text-decoration-none" onClick={onNavigateTo('cart')} style={{ fontSize: '1rem' }}>
                              Cart
                            </a>
                          </li>
                          <li className="mb-3">
                            <a href="#" className="text-dark text-decoration-none" style={{ fontSize: '1rem' }}>
                              Checkout
                            </a>
                          </li>
                          <li>
                            <a href="#" className="text-dark text-decoration-none" style={{ fontSize: '1rem' }}>
                              My account
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <a className="nav-link text-dark me-4" href="#">Blog</a>
              <a className="nav-link text-dark me-4" href="#">Pages</a>
              <a className="nav-link text-dark" href="#">Contact</a>
            </div>

            {/* Right Side Icons and Actions */}
            <div className="d-flex align-items-center">
              {/* Notification Bell */}
              <div className="position-relative no-hover" style={{ marginRight: '40px', cursor: 'pointer' }} onClick={onNavigateTo('notification')}>
                <i className="bi bi-bell fs-5 text-dark"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark" style={{ fontSize: '6px', width: '8px', height: '8px' }}>
                </span>
              </div>

              {/* Search */}
              <div style={{ marginRight: '40px' }} className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-link p-0 no-hover"
                  onClick={handleSearchClick}
                  style={{
                    // css không hiện hover
                    border: 'none',
                    background: 'none',
                    fontSize: '16px',
                    textDecoration: 'none',
                    boxShadow: 'none'
                  }}
                >
                  <i className="bi bi-search fs-5 text-dark "></i>
                  <span className="text-dark small d-none d-md-inline ms-2">Search</span>
                </button>
              </div>

              {/* Cart */}
              <div className="no-hover" style={{ marginRight: '40px', cursor: 'pointer' }} onClick={onNavigateTo('cart')}>
                <i className="bi bi-cart fs-5 text-dark"></i>
                <span className="text-dark small d-none d-md-inline ms-2">Cart</span>
              </div>

              {/* User Profile */}
              <div>
                <button
                  className="btn btn-link p-0 no-hover"
                  onClick={onNavigateTo('auth')}
                  style={{ 
                    border: 'none',
                    background: 'none',
                    fontSize: '16px',
                    textDecoration: 'none',
                    boxShadow: 'none'
                   }}
                >
                  <i className="bi bi-person fs-5 text-dark"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

    </>
  );
};

export default MenuClient;
