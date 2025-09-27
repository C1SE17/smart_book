import React, { useState } from 'react'
import Home from './pages/home/Home'
import Auth from './pages/auth/Auth'
import Search from './pages/search/Search'
import Hero from './layouts/Hero'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'auth', or 'search'

  // Simple routing
  if (currentPage === 'auth') {
    return <Auth 
      onBackToHome={() => setCurrentPage('home')} 
      onLoginSuccess={(userData) => {
        console.log('User logged in:', userData);
        setCurrentPage('home'); // Redirect to home after login
      }}
    />;
  }

  if (currentPage === 'search') {
    return <Search onBackToHome={() => setCurrentPage('home')} />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Bar */}
      <div className="bg-light py-2">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <span className="text-muted">Home</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Menu */}
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
                <button 
                  className="btn btn-link p-0 d-flex align-items-center"
                  onClick={() => setCurrentPage('search')}
                  style={{border: 'none', background: 'none'}}
                >
                  <i className="bi bi-search me-1 text-dark"></i>
                  <span className="text-dark small d-none d-md-inline">Search</span>
                </button>
              </div>

              {/* Cart */}
              <div className="me-3">
                <span className="text-dark small d-none d-md-inline">Cart</span>
              </div>

              {/* User Profile */}
              <div>
                <button 
                  className="btn btn-link p-0"
                  onClick={() => setCurrentPage('auth')}
                  style={{border: 'none', background: 'none'}}
                >
                  <i className="bi bi-person fs-5 text-dark"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Pink Border */}
      <div className="w-100" style={{height: '2px', backgroundColor: '#ffc0cb'}}></div>

      {/* Hero Section */}
      <Hero />

      {/* Home Page Content */}
      <Home />

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

