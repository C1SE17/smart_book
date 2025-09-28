import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Search, Cart, Notification, ProductDetail, Slide, MenuClient, OrderDetail, FeaturedCategories, BooksPage } from './components'
import Home from './components/Home'
import { UserProfile } from './components/user'
import Auth from './features/auth/Auth'
import { handleRoute, navigateTo } from './routes'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'auth', 'search', 'cart', 'notification', 'product', or 'profile'
  const [searchQuery, setSearchQuery] = useState(''); // Global search state
  const [productId, setProductId] = useState(null); // Product ID for product detail page
  const [user, setUser] = useState(null); // User authentication state
  const [profileTab, setProfileTab] = useState('profile'); // Profile tab state

  // Handle URL routing
  useEffect(() => {
    const handlePopState = () => {
      handleRoute(window.location.pathname, setCurrentPage, setProductId, setSearchQuery, setProfileTab);
    };

    // Initial route handling
    handlePopState();

    // Listen for browser back/forward
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Memoized navigation handlers
  const handleBackToHome = useCallback(() => {
    navigateTo('/');
    setSearchQuery(''); // Clear search when going home
    setProductId(null); // Clear product ID
    // Reset scroll position to top when going home
    window.scrollTo(0, 0);
  }, []);
  
  const handleLoginSuccess = useCallback((userData) => {
    console.log('User logged in:', userData);
    setUser(userData); // Store user data
    navigateTo('/'); // Redirect to home after login
    setSearchQuery(''); // Clear search
    setProductId(null); // Clear product ID
    // Reset scroll position to top after login
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null); // Clear user data
    navigateTo('/'); // Redirect to home after logout
    setSearchQuery(''); // Clear search
    setProductId(null); // Clear product ID
    // Reset scroll position to top after logout
    window.scrollTo(0, 0);
  }, []);

  const handleViewAllNotifications = useCallback(() => {
    console.log('Navigate to all notifications');
    navigateTo('/notification');
  }, []);

  const handleUpdateProfile = useCallback((updatedUserData) => {
    setUser(prev => ({
      ...prev,
      ...updatedUserData
    }));
  }, []);

  // Navigation handlers
  const handleNavigateTo = useCallback((page) => () => {
    const routeMap = {
      'home': '/',
      'books': '/books',
      'profile': '/profile',
      'cart': '/cart',
      'auth': '/login',
      'register': '/register',
      'search': '/search',
      'product': '/product',
      'notification': '/notification'
    };
    
    const path = routeMap[page] || '/';
    navigateTo(path);
    // Reset scroll position to top when navigating
    window.scrollTo(0, 0);
  }, []);
  
  // Search handler that navigates to search page with query
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    navigateTo('/search', { q: query });
    // Reset scroll position to top when searching
    window.scrollTo(0, 0);
  }, []);

  // Product detail handler
  const handleViewProduct = useCallback((id) => {
    console.log('handleViewProduct called with id:', id);
    setProductId(id);
    navigateTo('/product', { id: id });
    // Reset scroll position to top when viewing product
    window.scrollTo(0, 0);
  }, []);

  // Category filter handler
  const handleFilterByCategory = useCallback((categoryId, categoryName) => {
    setSearchQuery(`category:${categoryName}`);
    navigateTo('/search', { q: `category:${categoryName}` });
    // Reset scroll position to top when filtering by category
    window.scrollTo(0, 0);
  }, []);

  // Memoized page components to avoid recreation
  const pageComponents = useMemo(() => ({
    auth: <Auth onBackToHome={handleBackToHome} onLoginSuccess={handleLoginSuccess} />,
    search: <Search onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} initialSearchQuery={searchQuery} onSearch={handleSearch} onViewProduct={handleViewProduct} />,
    cart: <Cart onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} />,
    notification: <Notification onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} />,
    product: <ProductDetail onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} productId={productId} onViewProduct={handleViewProduct} />,
    profile: <UserProfile user={user} onBackToHome={handleBackToHome} onUpdateProfile={handleUpdateProfile} />
  }), [handleBackToHome, handleLoginSuccess, handleNavigateTo, searchQuery, handleSearch, handleViewProduct, productId, user, handleUpdateProfile]);

  // Remove console.log in production
  if (process.env.NODE_ENV === 'development') {
    console.log('App render - currentPage:', currentPage, 'productId:', productId);
  }

  return (
    <div className="d-flex flex-column min-vh-100" style={{ paddingTop: '80px', transition: 'all 0.3s ease' }}>
      {/* Main Menu - Always rendered at top level */}
      <MenuClient 
        onNavigateTo={handleNavigateTo} 
        onBackToHome={handleBackToHome} 
        onFilterByCategory={handleFilterByCategory}
        user={user}
        onLogout={handleLogout}
        onViewAllNotifications={handleViewAllNotifications}
      />

      {/* Page Content */}
      {currentPage === 'auth' && pageComponents.auth}
      {currentPage === 'register' && pageComponents.auth}
      {currentPage === 'search' && pageComponents.search}
      {currentPage === 'cart' && pageComponents.cart}
      {currentPage === 'notification' && pageComponents.notification}
      {currentPage === 'product' && pageComponents.product}
      {currentPage === 'profile' && (
        <UserProfile 
          user={user} 
          onBackToHome={handleBackToHome} 
          onUpdateProfile={handleUpdateProfile}
          activeTab={profileTab}
          onTabChange={setProfileTab}
        />
      )}
      {currentPage === 'order-detail' && (
        <OrderDetail 
          orderId={productId} 
          onBackToProfile={() => {
            navigateTo('/profile/orders');
          }}
        />
      )}
          {currentPage === 'books' && (
            <BooksPage 
              onBackToHome={handleBackToHome}
              onViewProduct={handleViewProduct}
              onFilterByCategory={handleFilterByCategory}
            />
          )}
      {currentPage === 'categories' && (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f5f5f5' }}>
          <div className="text-center">
            <h3>Categories page coming soon...</h3>
            <button className="btn btn-primary mt-3" onClick={handleBackToHome}>
              Back to Home
            </button>
          </div>
        </div>
      )}
          {currentPage === 'home' && (
            <>
              {/* Slide Section */}
              <Slide />
              {/* Home Page Content */}
              <Home onViewProduct={handleViewProduct} />
              {/* Featured Categories */}
              <FeaturedCategories 
                onFilterByCategory={handleFilterByCategory}
                onViewAllCategories={() => navigateTo('/categories')}
              />
            </>
          )}

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


