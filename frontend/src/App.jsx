import React, { useState, useCallback, useMemo, useEffect } from 'react'
import ToastContainer from './components/common/Toast/ToastContainer'
import Search from './components/client/search/Search'
import Cart from './components/client/carts/Cart'
import Notification from './components/client/notification/Notification'
import Slide from './components/layouts/Slide'
import MenuClient from './components/layouts/Menu'
import OrderDetail from './components/client/orders/OrderDetail'
import ProductDetail from './components/client/product/ProductDetail'
import CategoriesPage from './components/client/shop/CategoriesPage'
import Checkout from './components/client/orders/Checkout'
import ListOrders from './components/client/orders/ListOrders'
import Home from './components/Home'
import BlogPage from './components/client/blog/BlogPage'
import BlogDetail from './components/client/blog/BlogDetail'
import Contact from './components/client/contact/Contact'
import AboutUs from './components/client/about/AboutUs'
import { AuthorPage, AuthorDetail } from './components/client/author'
import AdminLayout from './components/admin/AdminLayout'
import Layout from './components/layouts/Layout'
import Dashboard from './components/admin/Dashboard'
import CategoryManagement from './components/admin/CategoryManagement'
import BookManagement from './components/admin/BookManagement'
import WarehouseManagement from './components/admin/WarehouseManagement'
import OrderManagement from './components/admin/OrderManagement'
import UserManagement from './components/admin/UserManagement'
import ReviewManagement from './components/admin/ReviewManagement'
import UserProfile from './components/user/UserProfile'
import Auth from './features/auth/Auth'
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary'
import { handleRoute, navigateTo } from './routes'
import { getToken, removeToken, getUserFromToken } from './utils'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'auth', 'search', 'cart', 'notification', 'product', 'profile', 'blog', 'blog-detail', 'books', or 'categories'

  const [searchQuery, setSearchQuery] = useState(''); // State tìm kiếm toàn cục
  const [productId, setProductId] = useState(null); // ID sản phẩm cho trang chi tiết
  const [blogId, setBlogId] = useState(null);
  const [authorId, setAuthorId] = useState(null); // ID blog cho trang chi tiết blog
  const [user, setUser] = useState(null); // State xác thực người dùng
  const [profileTab, setProfileTab] = useState('profile'); // State tab profile
  const [adminWantsHome, setAdminWantsHome] = useState(false); // State để theo dõi admin có muốn ở trang chủ

  // Khởi tạo state người dùng từ localStorage
  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('Loading user from localStorage:', parsedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
        }
      } else {
        setUser(null);
      }
    };

    loadUser();

    // Listen for storage changes (when user logs in from another tab)
    window.addEventListener('storage', loadUser);

    // Listen for logout all devices event
    const handleUserLoggedOut = () => {
      setUser(null);
    };
    window.addEventListener('userLoggedOut', handleUserLoggedOut);

    return () => {
      window.removeEventListener('storage', loadUser);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, []); // Bỏ currentPage khỏi dependency để tránh vòng lặp

  // Effect riêng để xử lý admin redirect
  useEffect(() => {
    // Admin có thể truy cập homepage, không cần redirect tự động
    if (user && user.role === 'admin' && currentPage === 'home' && window.location.pathname === '/') {
      console.log('Admin đang truy cập homepage');
      // Không redirect, để admin có thể ở homepage
    }
  }, [user, currentPage, adminWantsHome]);

  // Xử lý định tuyến URL
  useEffect(() => {
    const handlePopState = () => {
      handleRoute(window.location.pathname, setCurrentPage, setProductId, setSearchQuery, setProfileTab, setBlogId, setAuthorId);
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

  // Handler riêng cho admin về trang chủ (không logout)
  const handleAdminBackToHome = useCallback(() => {
    // Set flag để admin có thể ở trang chủ
    setAdminWantsHome(true);

    // Navigate về trang chủ
    navigateTo('/');
    setSearchQuery('');
    setProductId(null);
    window.scrollTo(0, 0);
  }, []);

  const handleLoginSuccess = useCallback((userData) => {
    console.log('User logged in:', userData);
    // Force reload user from localStorage after login
    const userDataFromStorage = localStorage.getItem('user');
    if (userDataFromStorage) {
      try {
        const parsedUser = JSON.parse(userDataFromStorage);
        console.log('Setting user after login:', parsedUser);
        console.log('User role:', parsedUser.role);
        setUser(parsedUser);

        // Kiểm tra role và chuyển hướng phù hợp
        if (parsedUser.role === 'admin') {
          // Admin chuyển hướng đến homepage trước
          navigateTo('/');
          console.log('Admin logged in, redirecting to homepage');
        } else {
          // User thường chuyển hướng về trang chủ
          navigateTo('/');
          console.log('Customer logged in, redirecting to home');
        }
      } catch (error) {
        console.error('Error parsing user data after login:', error);
        // Fallback về trang chủ nếu có lỗi
        navigateTo('/');
      }
    } else {
      // Fallback về trang chủ nếu không có dữ liệu user
      navigateTo('/');
    }

    setSearchQuery(''); // Xóa tìm kiếm
    setProductId(null); // Xóa ID sản phẩm
    // Đặt lại vị trí cuộn lên đầu sau khi đăng nhập
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = useCallback(() => {
    removeToken(); // Xóa token khỏi localStorage
    setUser(null); // Xóa dữ liệu người dùng
    setAdminWantsHome(false); // Reset admin flag
    setCurrentPage('home'); // Reset current page to home
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
  const handleNavigateTo = useCallback((page, params = {}) => {
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
      'orders': '/orders',
      'contact': '/contact',
      'about': '/about',
      'author': '/author',
      'author-detail': '/author-detail',
      'admin-dashboard': '/admin/dashboard',
      'admin-books': '/admin/books',
      'admin-categories': '/admin/categories',
      'admin-warehouse': '/admin/warehouse',
      'admin-orders': '/admin/orders',
      'admin-users': '/admin/users',
      'admin-reviews': '/admin/reviews',
      'admin-reports': '/admin/reports'
    };

    const path = routeMap[page] || '/';

    // Reset admin wants home flag when navigating to admin pages
    if (page.startsWith('admin-')) {
      setAdminWantsHome(false);
    }

    // Handle product page with productId
    if (page === 'product' && params.productId) {
      setProductId(params.productId);
      navigateTo(path, { id: params.productId });
    }
    // Handle author detail page with authorId
    else if (page === 'author-detail' && params.id) {
      setAuthorId(params.id);
      navigateTo(path, { id: params.id });
    }
    // Handle admin pages
    else if (page.startsWith('admin-')) {
      navigateTo(path);
    }
    else {
      navigateTo(path);
    }

    window.scrollTo(0, 0);
  }, []);

  // Handler tìm kiếm chuyển đến trang tìm kiếm với query
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    navigateTo('/search', { q: query });
    // Đặt lại vị trí cuộn lên đầu khi tìm kiếm
    window.scrollTo(0, 0);
  }, []);

  // Handler chuyển đến trang chi tiết blog
  const handleNavigateToBlogDetail = useCallback((id) => {
    setBlogId(id);
    navigateTo('/blog-detail', { id });
    window.scrollTo(0, 0);
  }, []);

  // Handler chuyển đến trang chi tiết sản phẩm
  const handleNavigateToProduct = useCallback((id) => {
    setProductId(id);
    navigateTo('/product', { id });
    window.scrollTo(0, 0);
  }, []);

  // Handler chuyển đến trang chi tiết tác giả
  const handleNavigateToAuthorDetail = useCallback((id) => {
    setAuthorId(id);
    navigateTo('/author-detail', { id });
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
        <Layout onViewAllNotifications={handleViewAllNotifications}>
          <Checkout
            onBackToHome={handleBackToHome}
            onNavigateTo={handleNavigateTo}
          />
        </Layout>
      )}
      {currentPage === 'orders' && (
        <ErrorBoundary>
          <ListOrders
            onNavigateTo={handleNavigateTo}
          />
        </ErrorBoundary>
      )}
      {currentPage === 'blog' && (
        <BlogPage onNavigateTo={handleNavigateTo} />
      )}
      {currentPage === 'blog-detail' && (
        <ErrorBoundary>
          <BlogDetail onNavigateTo={handleNavigateTo} blogId={blogId} />
        </ErrorBoundary>
      )}
      {currentPage === 'books' && (
        <ErrorBoundary>
          <CategoriesPage onNavigateTo={handleNavigateTo} />
        </ErrorBoundary>
      )}
      {currentPage === 'categories' && (
        <ErrorBoundary>
          <CategoriesPage onNavigateTo={handleNavigateTo} />
        </ErrorBoundary>
      )}
      {currentPage === 'product' && (
        <ProductDetail productId={productId} onNavigateTo={handleNavigateTo} onNavigateToProduct={handleNavigateToProduct} user={user} />
      )}
      {currentPage === 'home' && (
        <>
          {/* Slide Section */}
          <Slide onNavigateTo={handleNavigateTo} />
          {/* Home Page Content */}
          <Home onNavigateTo={handleNavigateTo} />
        </>
      )}
      {currentPage === 'contact' && (
        <ErrorBoundary>
          <Contact onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} />
        </ErrorBoundary>
      )}
      {currentPage === 'about' && (
        <ErrorBoundary>
          <AboutUs onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} />
        </ErrorBoundary>
      )}
      {currentPage === 'author' && (
        <ErrorBoundary>
          <AuthorPage onNavigateTo={handleNavigateTo} onNavigateToAuthorDetail={handleNavigateToAuthorDetail} />
        </ErrorBoundary>
      )}
      {currentPage === 'author-detail' && (
        <ErrorBoundary>
          <AuthorDetail onNavigateTo={handleNavigateTo} authorId={authorId} />
        </ErrorBoundary>
      )}

      {/* Admin Pages */}
      {currentPage === 'admin-dashboard' && (
        <ErrorBoundary>
          <AdminLayout onNavigateTo={handleNavigateTo} onLogout={handleLogout} onBackToHome={handleAdminBackToHome} currentPage="admin-dashboard">
            <Dashboard />
          </AdminLayout>
        </ErrorBoundary>
      )}
      {currentPage === 'admin-books' && (
        <ErrorBoundary>
          <AdminLayout onNavigateTo={handleNavigateTo} onLogout={handleLogout} onBackToHome={handleAdminBackToHome} currentPage="admin-books">
            <BookManagement />
          </AdminLayout>
        </ErrorBoundary>
      )}

      {currentPage === 'admin-categories' && (
        <ErrorBoundary>
          <AdminLayout onNavigateTo={handleNavigateTo} onLogout={handleLogout} onBackToHome={handleAdminBackToHome} currentPage="admin-categories">
            <CategoryManagement />
          </AdminLayout>
        </ErrorBoundary>
      )}
      {currentPage === 'admin-warehouse' && (
        <ErrorBoundary>
          <AdminLayout onNavigateTo={handleNavigateTo} onLogout={handleLogout} onBackToHome={handleAdminBackToHome} currentPage="admin-warehouse">
            <WarehouseManagement />
          </AdminLayout>
        </ErrorBoundary>
      )}
      {currentPage === 'admin-orders' && (
        <ErrorBoundary>
          <AdminLayout onNavigateTo={handleNavigateTo} onLogout={handleLogout} onBackToHome={handleAdminBackToHome} currentPage="admin-orders">
            <OrderManagement />
          </AdminLayout>
        </ErrorBoundary>
      )}
      {currentPage === 'admin-users' && (
        <ErrorBoundary>
          <AdminLayout onNavigateTo={handleNavigateTo} onLogout={handleLogout} onBackToHome={handleAdminBackToHome} currentPage="admin-users">
            <UserManagement />
          </AdminLayout>
        </ErrorBoundary>
      )}
      {currentPage === 'admin-reviews' && (
        <ErrorBoundary>
          <AdminLayout onNavigateTo={handleNavigateTo} onLogout={handleLogout} onBackToHome={handleAdminBackToHome} currentPage="admin-reviews">
            <ReviewManagement />
          </AdminLayout>
        </ErrorBoundary>
      )}
      {currentPage === 'debug' && (
        <ErrorBoundary>
          <SimpleDebug />
        </ErrorBoundary>
      )}

      {/* Fallback for admin pages */}
      {currentPage && currentPage.startsWith('admin-') && !currentPage.includes('admin-dashboard') && !currentPage.includes('admin-books') && !currentPage.includes('admin-categories') && !currentPage.includes('admin-warehouse') && !currentPage.includes('admin-orders') && !currentPage.includes('admin-users') && !currentPage.includes('admin-reviews') && (
        <ErrorBoundary>
          <AdminLayout onNavigateTo={handleNavigateTo} onLogout={handleLogout} onBackToHome={handleAdminBackToHome} currentPage={currentPage}>
            <div className="text-center py-5">
              <h3>Trang đang được phát triển</h3>
              <p className="text-muted">Tính năng này sẽ sớm có mặt</p>
            </div>
          </AdminLayout>
        </ErrorBoundary>
      )}


      <ToastContainer />
    </div>
  )
}

export default App


