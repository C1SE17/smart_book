import React, { useState, useCallback, useMemo, useEffect } from 'react'
import ToastContainer from './components/common/Toast/ToastContainer'
import Search from './components/client/search/Search'
import Cart from './components/client/carts/Cart'
import Notification from './components/client/notification/Notification'
import Slide from './components/layouts/Slide'
import MenuClient from './components/layouts/Menu'
import OrderDetail from './components/client/orders/OrderDetail'
import ProductDetail from './components/client/shop/ProductDetail'
import CategoriesPage from './components/client/shop/CategoriesPage'
import Checkout from './components/client/orders/Checkout'
import ListOrders from './components/client/orders/ListOrders'
import Home from './components/Home'
import BlogPage from './components/client/blog/BlogPage'
import BlogDetail from './components/client/blog/BlogDetail'
import UserProfile from './components/user/UserProfile'
import Auth from './features/auth/Auth'
import { handleRoute, navigateTo } from './routes'
import { getToken, removeToken, getUserFromToken } from './utils'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'auth', 'search', 'cart', 'notification', 'product', 'profile', 'blog', 'blog-detail', 'books', or 'categories'

  const [searchQuery, setSearchQuery] = useState(''); // State tìm kiếm toàn cục
  const [productId, setProductId] = useState(null); // ID sản phẩm cho trang chi tiết
  const [user, setUser] = useState(null); // State xác thực người dùng
  const [profileTab, setProfileTab] = useState('profile'); // State tab profile

  // Khởi tạo state người dùng từ token
  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser(getUserFromToken(token));
    }
  }, []);

  // Xử lý định tuyến URL
  useEffect(() => {
    const handlePopState = () => {
      handleRoute(window.location.pathname, setCurrentPage, setProductId, setSearchQuery, setProfileTab);
    };

    // Xử lý route ban đầu
    handlePopState();

    // Lắng nghe sự kiện back/forward của trình duyệt
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Các handler điều hướng được memoize
  const handleBackToHome = useCallback(() => {
    navigateTo('/');
    setSearchQuery(''); // Xóa tìm kiếm khi về trang chủ
    setProductId(null); // Xóa ID sản phẩm
    // Đặt lại vị trí cuộn lên đầu khi về trang chủ
    window.scrollTo(0, 0);
  }, []);

  const handleLoginSuccess = useCallback((userData) => {
    console.log('User logged in:', userData);
    setUser(userData); // Lưu dữ liệu người dùng
    navigateTo('/'); // Chuyển hướng về trang chủ sau khi đăng nhập
    setSearchQuery(''); // Xóa tìm kiếm
    setProductId(null); // Xóa ID sản phẩm
    // Đặt lại vị trí cuộn lên đầu sau khi đăng nhập
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = useCallback(() => {
    removeToken(); // Xóa token khỏi localStorage
    setUser(null); // Xóa dữ liệu người dùng
    navigateTo('/'); // Chuyển hướng về trang chủ sau khi đăng xuất
    setSearchQuery(''); // Xóa tìm kiếm
    setProductId(null); // Xóa ID sản phẩm
    // Đặt lại vị trí cuộn lên đầu sau khi đăng xuất
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

  // Các handler điều hướng
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
      'notification': '/notification',
      'blog': '/blog',
      'blog-detail': '/blog-detail',
      'checkout': '/checkout',
      'orders': '/orders'
    };

    const path = routeMap[page] || '/';
    navigateTo(path);
    window.scrollTo(0, 0);
  }, []);

  // Handler tìm kiếm chuyển đến trang tìm kiếm với query
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    navigateTo('/search', { q: query });
    // Đặt lại vị trí cuộn lên đầu khi tìm kiếm
    window.scrollTo(0, 0);
  }, []);



  // Các component trang được memoize để tránh tạo lại
  const pageComponents = useMemo(() => ({
    auth: <Auth onBackToHome={handleBackToHome} onLoginSuccess={handleLoginSuccess} />,
    search: <Search onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} initialSearchQuery={searchQuery} onSearch={handleSearch} />,
    cart: <Cart onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} />,
    notification: <Notification onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} />,
    profile: <UserProfile user={user} onBackToHome={handleBackToHome} onUpdateProfile={handleUpdateProfile} />
  }), [handleBackToHome, handleLoginSuccess, handleNavigateTo, searchQuery, handleSearch, user, handleUpdateProfile]);


  return (
    <div className="d-flex flex-column min-vh-100" style={{ paddingTop: '80px', transition: 'all 0.3s ease' }}>
      {/* Main Menu - Always rendered at top level */}
      <MenuClient
        onNavigateTo={handleNavigateTo}
        onBackToHome={handleBackToHome}
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
      {currentPage === 'checkout' && (
        <Checkout
          onBackToHome={handleBackToHome}
          onNavigateTo={handleNavigateTo}
        />
      )}
      {currentPage === 'orders' && (
        <ListOrders
          onNavigateTo={handleNavigateTo}
        />
      )}
      {currentPage === 'blog' && (
        <BlogPage onNavigateTo={handleNavigateTo} />
      )}
      {currentPage === 'blog-detail' && (
        <BlogDetail onNavigateTo={handleNavigateTo} blogId={productId} />
      )}
      {currentPage === 'books' && (
        <CategoriesPage onNavigateTo={handleNavigateTo} />
      )}
      {currentPage === 'categories' && (
        <CategoriesPage onNavigateTo={handleNavigateTo} />
      )}
      {currentPage === 'product' && (
        <ProductDetail productId={productId} onNavigateTo={handleNavigateTo} />
      )}
      {currentPage === 'home' && (
        <>
          {/* Slide Section */}
          <Slide />
          {/* Home Page Content */}
          <Home onNavigateTo={handleNavigateTo} />

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
      <ToastContainer />
    </div>
  )
}

export default App


