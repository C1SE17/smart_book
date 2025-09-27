import React, { useState, useCallback, useMemo } from 'react'
import Home from './pages/home/Home'
import Auth from './pages/auth/Auth'
import Search from './pages/search/Search'
import Cart from './pages/cart/Cart'
import Notification from './pages/notification/Notification'
import ProductDetail from './pages/product/ProductDetail'
import Hero from './layouts/Hero'
import MenuClient from './layouts/MenuClient'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'auth', 'search', 'cart', 'notification', or 'product'
  const [searchQuery, setSearchQuery] = useState(''); // Global search state
  const [productId, setProductId] = useState(null); // Product ID for product detail page

  // Memoized navigation handlers
  const handleBackToHome = useCallback(() => {
    setCurrentPage('home');
    setSearchQuery(''); // Clear search when going home
    setProductId(null); // Clear product ID
  }, []);
  
  const handleLoginSuccess = useCallback((userData) => {
    console.log('User logged in:', userData);
    setCurrentPage('home'); // Redirect to home after login
    setSearchQuery(''); // Clear search
    setProductId(null); // Clear product ID
  }, []);

  // Navigation handlers
  const handleNavigateTo = useCallback((page) => () => setCurrentPage(page), []);
  
  // Search handler that navigates to search page with query
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage('search');
  }, []);

  // Product detail handler
  const handleViewProduct = useCallback((id) => {
    setProductId(id);
    setCurrentPage('product');
  }, []);

  // Memoized page components to avoid recreation
  const pageComponents = useMemo(() => ({
    auth: <Auth onBackToHome={handleBackToHome} onLoginSuccess={handleLoginSuccess} />,
    search: <Search onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} initialSearchQuery={searchQuery} onSearch={handleSearch} onViewProduct={handleViewProduct} />,
    cart: <Cart onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} onSearch={handleSearch} />,
    notification: <Notification onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} onSearch={handleSearch} />,
    product: <ProductDetail onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} onSearch={handleSearch} productId={productId} onViewProduct={handleViewProduct} />
  }), [handleBackToHome, handleLoginSuccess, handleNavigateTo, searchQuery, handleSearch, handleViewProduct, productId]);

  // Simple routing
  if (currentPage === 'auth') return pageComponents.auth;
  if (currentPage === 'search') return pageComponents.search;
  if (currentPage === 'cart') return pageComponents.cart;
  if (currentPage === 'notification') return pageComponents.notification;
  if (currentPage === 'product') return pageComponents.product;

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Main Menu */}
      <MenuClient onNavigateTo={handleNavigateTo} onBackToHome={handleBackToHome} onSearch={handleSearch} />

      {/* Hero Section */}
      <Hero />

      {/* Home Page Content */}
      <Home onViewProduct={handleViewProduct} />

      {/* Footer */}
      <footer className="bg-light py-5 mt-5">
        <div className="container">
          <div className="row">
            {/* Connect Column */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
              <h5 className="fw-bold text-dark mb-3">Connect</h5>
              <div className="text-dark">
                <p className="mb-2">1000 Nguyen Van A, Thanh Khe, Da Nang, Viet Nam</p>
                <p className="mb-2">smartbook@gmail.com</p>
                <p className="mb-0">12334566676</p>
              </div>
            </div>

            {/* Categories Column */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
              <h5 className="fw-bold text-dark mb-3">Categories</h5>
              <div className="text-dark">
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Fiction</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Non-Fiction</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Science</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-2">History</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-0">Biography</a>
              </div>
            </div>

            {/* Explore Column */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
              <h5 className="fw-bold text-dark mb-3">Explore</h5>
              <div className="text-dark">
                <a href="#" className="text-decoration-none text-dark d-block mb-2">About Us</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Our Team</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Careers</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Press</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-0">Blog</a>
              </div>
            </div>

            {/* Account Column */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
              <h5 className="fw-bold text-dark mb-3">Account</h5>
              <div className="text-dark">
                <a href="#" className="text-decoration-none text-dark d-block mb-2">My Account</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Order History</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Wishlist</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Newsletter</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-0">Support</a>
              </div>
            </div>

            {/* Get in touch Column */}
            <div className="col-lg-2 col-md-4 col-sm-6 mb-4">
              <h5 className="fw-bold text-dark mb-3">Get in touch</h5>
              <div className="text-dark">
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Contact Us</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Help Center</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Feedback</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-2">Partnership</a>
                <a href="#" className="text-decoration-none text-dark d-block mb-0">Advertise</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="bg-dark text-white py-3">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p className="mb-0 small">
                © 2025 Smart Bookstore. All rights reserved. |
                <a href="#" className="text-white text-decoration-none ms-2">Privacy Policy</a> |
                <a href="#" className="text-white text-decoration-none ms-2">Terms of Service</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

