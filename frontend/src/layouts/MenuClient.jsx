import React from 'react';

const MenuClient = () => {
  return (
    <>
      {/* Main Navigation Bar - White */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white py-3">
        <div className="container">
          {/* Logo */}
          <a className="navbar-brand fw-bold text-dark fs-3" href="#">
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
              <a className="nav-link text-dark me-4" href="#">Home</a>
              <a className="nav-link text-dark me-4" href="#">Shop</a>
              <a className="nav-link text-dark me-4" href="#">Blog</a>
              <a className="nav-link text-dark me-4" href="#">Pages</a>
              <a className="nav-link text-dark" href="#">Contact</a>
            </div>

            {/* Right Side Icons and Actions */}
            <div className="d-flex align-items-center">
              {/* Notification Bell */}
              <div className="position-relative me-3">
                <i className="bi bi-bell fs-5 text-dark"></i>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark" style={{fontSize: '6px', width: '8px', height: '8px'}}>
                </span>
              </div>

              {/* Search */}
              <div className="d-flex align-items-center me-3">
                <i className="bi bi-search me-1 text-dark"></i>
                <span className="text-dark small d-none d-md-inline">Search</span>
              </div>

              {/* Cart */}
              <div className="me-3">
                <span className="text-dark small d-none d-md-inline">Cart</span>
              </div>

              {/* User Profile */}
              <div>
                <i className="bi bi-person fs-5 text-dark"></i>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Pink Border */}
      <div className="w-100" style={{height: '2px', backgroundColor: '#ffc0cb'}}></div>
    </>
  );
};

export default MenuClient;
