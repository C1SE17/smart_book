import React from 'react';

const FooterClient = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <div className="container">
        <div className="row">
          {/* Brand Column */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-3">
              <img 
                src="/images/Logo.png" 
                alt="Smart Book" 
                style={{ width: '40px', height: '40px' }}
                className="me-2"
              />
              <h4 className="fw-bold text-white mb-0">Smart Book</h4>
            </div>
            <p className="text-light mb-3">
              Vietnam's leading online book shopping platform. 
              Discover a world of knowledge with thousands of quality titles.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-4">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-light fs-4">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-light fs-4">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-light fs-4">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold text-white mb-3">Quick Links</h5>
            <div className="d-flex flex-column">
              <a href="/" className="text-light text-decoration-none mb-2">
                <i className="fas fa-home me-2"></i>Home
              </a>
              <a href="/shop" className="text-light text-decoration-none mb-2">
                <i className="fas fa-shopping-bag me-2"></i>Shop
              </a>
              <a href="/about" className="text-light text-decoration-none mb-2">
                <i className="fas fa-info-circle me-2"></i>About Us
              </a>
              <a href="/contact" className="text-light text-decoration-none mb-2">
                <i className="fas fa-envelope me-2"></i>Contact
              </a>
              <a href="/blog" className="text-light text-decoration-none mb-0">
                <i className="fas fa-blog me-2"></i>Blog
              </a>
            </div>
          </div>

          {/* Categories Column */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold text-white mb-3">Book Categories</h5>
            <div className="d-flex flex-column">
              <a href="/shop?category=fiction" className="text-light text-decoration-none mb-2">
                <i className="fas fa-book-open me-2"></i>Fiction
              </a>
              <a href="/shop?category=non-fiction" className="text-light text-decoration-none mb-2">
                <i className="fas fa-book me-2"></i>Non-fiction
              </a>
              <a href="/shop?category=science" className="text-light text-decoration-none mb-2">
                <i className="fas fa-flask me-2"></i>Science
              </a>
              <a href="/shop?category=history" className="text-light text-decoration-none mb-2">
                <i className="fas fa-landmark me-2"></i>History
              </a>
              <a href="/shop?category=biography" className="text-light text-decoration-none mb-0">
                <i className="fas fa-user me-2"></i>Biography
              </a>
            </div>
          </div>

          {/* Customer Service Column */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold text-white mb-3">Customer Support</h5>
            <div className="d-flex flex-column">
              <a href="/help" className="text-light text-decoration-none mb-2">
                <i className="fas fa-question-circle me-2"></i>Help Center
              </a>
              <a href="/shipping" className="text-light text-decoration-none mb-2">
                <i className="fas fa-truck me-2"></i>Shipping
              </a>
              <a href="/returns" className="text-light text-decoration-none mb-2">
                <i className="fas fa-undo me-2"></i>Returns
              </a>
              <a href="/privacy" className="text-light text-decoration-none mb-2">
                <i className="fas fa-shield-alt me-2"></i>Privacy Policy
              </a>
              <a href="/terms" className="text-light text-decoration-none mb-0">
                <i className="fas fa-file-contract me-2"></i>Terms of Use
              </a>
            </div>
          </div>

          {/* Contact Info Column */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="fw-bold text-white mb-3">Contact Information</h5>
            <div className="d-flex flex-column">
              <div className="d-flex align-items-start mb-3">
                <i className="fas fa-map-marker-alt text-primary me-3 mt-1"></i>
                <div>
                  <p className="text-light mb-1 fw-medium">Address:</p>
                  <p className="text-light mb-0 small">
                    1000 Nguyen Van A, Thanh Khe, Da Nang, Vietnam
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-start mb-3">
                <i className="fas fa-envelope text-primary me-3 mt-1"></i>
                <div>
                  <p className="text-light mb-1 fw-medium">Email:</p>
                  <p className="text-light mb-0 small">smartbook@gmail.com</p>
                </div>
              </div>
              <div className="d-flex align-items-start mb-3">
                <i className="fas fa-phone text-primary me-3 mt-1"></i>
                <div>
                  <p className="text-light mb-1 fw-medium">Phone:</p>
                  <p className="text-light mb-0 small">+84 123 456 789</p>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <i className="fas fa-clock text-primary me-3 mt-1"></i>
                <div>
                  <p className="text-light mb-1 fw-medium">Working Hours:</p>
                  <p className="text-light mb-0 small">8:00 AM - 10:00 PM (Daily)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <hr className="my-4 border-secondary" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="text-light mb-0 small">
              © 2024 Smart Book. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <div className="d-flex justify-content-md-end gap-3">
              <div className="d-flex align-items-center justify-content-center bg-white text-black rounded" 
                   style={{ width: '40px', height: '25px', fontSize: '10px', fontWeight: 'bold'}}>
                  COD
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterClient;
