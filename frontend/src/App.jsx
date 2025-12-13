import React, { useState, useCallback, useMemo, useEffect } from 'react'
import ToastContainer from './components/common/Toast/ToastContainer'
import {
  Search,
  Cart,
  Notification,
  OrderDetail,
  ProductDetail,
  CategoriesPage,
  Checkout,
  ListOrders,
  BlogPage,
  BlogDetail,
  Contact,
  AboutUs,
  Authors,
  AuthorDetail,
  AIAsk,
  BookTranslation
} from './components/client'
import Slide from './components/layouts/Slide'
import MenuClient from './components/layouts/Menu'
import Home from './components/page/Home'
import AdminLayout from './components/admin/AdminLayout'
import Layout from './components/layouts/Layout'
import Dashboard from './components/admin/Dashboard'
import CategoryManagement from './components/admin/CategoryManagement'
import BookManagement from './components/admin/BookManagement'
import WarehouseManagement from './components/admin/WarehouseManagement'
import OrderManagement from './components/admin/OrderManagement'
import UserManagement from './components/admin/UserManagement'
import ReviewManagement from './components/admin/ReviewManagement'
import AnalyticsDashboard from './components/admin/AnalyticsDashboard'
import UserProfile from './components/user/UserProfile'
import Auth from './features/auth/Auth'
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary'
import { handleRoute, navigateTo } from './routes'
import { getToken, removeToken, getUserFromToken } from './utils'
import './App.css'
import { LanguageProvider } from './contexts/LanguageContext'
import i18n from './i18n'
import { I18nextProvider } from 'react-i18next'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'auth', 'search', 'cart', 'notification', 'product', 'profile', 'blog', 'blog-detail', 'books', or 'categories'

  const [searchQuery, setSearchQuery] = useState(''); // State tìm kiếm toàn cục
  const [productId, setProductId] = useState(null); // ID sản phẩm cho trang chi tiết
  const [blogId, setBlogId] = useState(null);
  const [authorId, setAuthorId] = useState(null);
  const [user, setUser] = useState(null); // State xác thực người dùng
  const [profileTab, setProfileTab] = useState('profile'); // State tab profile
  const [adminWantsHome, setAdminWantsHome] = useState(false); // State để theo dõi admin có muốn ở trang chủ

  // Khởi tạo state người dùng từ localStorage - chỉ load nếu có cả user và token hợp lệ
  useEffect(() => {
    const loadUser = () => {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      // Chỉ load user nếu có cả user data và token
      // Nếu không có token, coi như đã đăng xuất và xóa user data
      if (!token) {
        if (userData) {
          console.log('[App] No token found, clearing user data');
          localStorage.removeItem('user');
          localStorage.removeItem('userToken');
          localStorage.removeItem('userEmail');
        }
        setUser(null);
        return;
      }
      
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          // Kiểm tra user có hợp lệ không (phải có user_id)
          if (!parsedUser || typeof parsedUser !== 'object' || !parsedUser.user_id) {
            console.log('[App] Invalid user data, clearing');
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('userToken');
            localStorage.removeItem('userEmail');
            setUser(null);
            return;
          }
          
          console.log('[App] Loading user from localStorage:', parsedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('[App] Error parsing user data:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('userToken');
          localStorage.removeItem('userEmail');
          setUser(null);
        }
      } else {
        // Nếu không có user data nhưng có token, xóa token
        if (token) {
          console.log('[App] User data missing but token exists, clearing token');
          localStorage.removeItem('token');
        }
        setUser(null);
      }
    };

    loadUser();

    // Listen for storage changes (when user logs in from another tab)
    window.addEventListener('storage', loadUser);

    // Listen for logout all devices event
    const handleUserLoggedOut = () => {
      console.log('[App] User logged out event received');
      // Xóa tất cả dữ liệu user
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userEmail');
      
      // Xóa tất cả cart keys
      try {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('cart_')) {
            localStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.error('Error clearing cart data:', e);
      }
      
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

  // Ngăn admin truy cập giỏ hàng
  useEffect(() => {
    if (user?.role === 'admin' && currentPage === 'cart') {
      navigateTo('/');
      setCurrentPage('home');
    }
  }, [user, currentPage]);

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
    console.log('[App] handleLoginSuccess called with:', userData);
    
    // Sử dụng userData trực tiếp từ parameter hoặc lấy từ localStorage
    let userToSet = userData;
    
    if (!userToSet) {
      console.log('[App] userData is null, trying to get from localStorage');
      // Fallback: lấy từ localStorage nếu userData không có
      const userDataFromStorage = localStorage.getItem('user');
      if (userDataFromStorage) {
        try {
          userToSet = JSON.parse(userDataFromStorage);
          console.log('[App] Got user from localStorage:', userToSet);
        } catch (error) {
          console.error('[App] Error parsing user data after login:', error);
          navigateTo('/');
          return;
        }
      } else {
        console.error('[App] No user data in localStorage either');
      }
    }
    
    if (!userToSet || !userToSet.user_id) {
      console.error('[App] Invalid user data after login:', userToSet);
      navigateTo('/');
      return;
    }
    
    console.log('[App] Setting user after login:', userToSet);
    console.log('[App] User role:', userToSet.role);
    
    // Set user state trước
    setUser(userToSet);
    console.log('[App] User state set, current user:', userToSet);
    
    // Đợi một chút để state được update, sau đó navigate
    setTimeout(() => {
      console.log('[App] Navigating after login...');
      // Kiểm tra role và chuyển hướng phù hợp
      if (userToSet.role === 'admin') {
        // Admin chuyển hướng đến homepage
        navigateTo('/');
        console.log('[App] Admin logged in, redirecting to homepage');
      } else {
        // User thường chuyển hướng về trang chủ
        navigateTo('/');
        console.log('[App] Customer logged in, redirecting to home');
      }
      
      setSearchQuery(''); // Xóa tìm kiếm
      setProductId(null); // Xóa ID sản phẩm
      // Đặt lại vị trí cuộn lên đầu sau khi đăng nhập
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  const handleLogout = useCallback(() => {
    // Xóa tất cả dữ liệu user
    const userId = user?.user_id;
    
    removeToken(); // Xóa token khỏi localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    
    // Xóa cart data của user
    if (userId) {
      localStorage.removeItem(`cart_${userId}`);
    }
    
    // Xóa tất cả cart keys (fallback)
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cart_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.error('Error clearing cart data:', e);
    }
    
    setUser(null); // Xóa dữ liệu người dùng
    setAdminWantsHome(false); // Reset admin flag
    setCurrentPage('home'); // Reset current page to home
    navigateTo('/'); // Chuyển hướng về trang chủ sau khi đăng xuất
    setSearchQuery(''); // Xóa tìm kiếm
    setProductId(null); // Xóa ID sản phẩm
    
    // Dispatch event để các component khác biết user đã đăng xuất
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
    
    // Đặt lại vị trí cuộn lên đầu sau khi đăng xuất
    window.scrollTo(0, 0);
  }, [user]);

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
    if (page === 'cart' && user?.role === 'admin') {
      return;
    }

    const routeMap = {
      'home': '/',
      'books': '/categories',
      'categories': '/categories',
      'profile': '/profile',
      'cart': '/cart',
      'auth': '/login',
      'register': '/register',
      'search': '/search',
      'product': '/product',
      'notification': '/notification',
      'blog': '/blog',
      'blog-detail': '/blog-detail',
      'author': '/author',
      'author-detail': '/author-detail',
      'checkout': '/checkout',
      'orders': '/orders',
      'contact': '/contact',
      'about': '/about',
      'ai-ask': '/ai-ask',
      'translation': '/translation',
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
    if (page === 'product' && (params.productId || params.id)) {
      const id = params.productId || params.id;
      console.log(' [App] Setting productId:', id, 'from params:', params);
      setProductId(id);
      navigateTo(path, { id });
    }
    // Handle search page with searchQuery
    else if (page === 'search') {
      const query = params?.searchQuery || params?.q || '';
      if (query) {
        setSearchQuery(query);
        navigateTo(path, { q: query });
      } else {
        setSearchQuery('');
        navigateTo(path);
      }
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
  }, [user]);

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
        <Layout 
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          <Checkout
            onBackToHome={handleBackToHome}
            onNavigateTo={handleNavigateTo}
          />
        </Layout>
      )}
      {currentPage === 'orders' && (
        <Layout 
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          <ErrorBoundary>
            <ListOrders
              onNavigateTo={handleNavigateTo}
            />
          </ErrorBoundary>
        </Layout>
      )}
      {currentPage === 'blog' && (
        <Layout 
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          <BlogPage onNavigateTo={handleNavigateTo} />
        </Layout>
      )}
      {currentPage === 'blog-detail' && (
        <Layout 
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          <ErrorBoundary>
            <BlogDetail onNavigateTo={handleNavigateTo} blogId={blogId} />
          </ErrorBoundary>
        </Layout>
      )}
      {currentPage === 'books' && (
        <Layout 
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          <ErrorBoundary>
            <CategoriesPage onNavigateTo={handleNavigateTo} />
          </ErrorBoundary>
        </Layout>
      )}
      {currentPage === 'categories' && (
        <Layout 
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          <ErrorBoundary>
            <CategoriesPage onNavigateTo={handleNavigateTo} />
          </ErrorBoundary>
        </Layout>
      )}
      {currentPage === 'product' && (
        <Layout 
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          <ProductDetail productId={productId} onNavigateTo={handleNavigateTo} onNavigateToProduct={handleNavigateToProduct} user={user} />
        </Layout>
      )}
      {currentPage === 'home' && (
        <Layout 
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          {/* Slide Section */}
          <Slide onNavigateTo={handleNavigateTo} />
          {/* Home Page Content */}
          <Home onNavigateTo={handleNavigateTo} />
        </Layout>
      )}
      {currentPage === 'contact' && (
        <Layout 
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          <ErrorBoundary>
            <Contact onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} />
          </ErrorBoundary>
        </Layout>
      )}
    {currentPage === 'ai-ask' && (
      <Layout 
        onViewAllNotifications={handleViewAllNotifications}
        onNavigateTo={handleNavigateTo}
        onBackToHome={handleBackToHome}
        user={user}
        onLogout={handleLogout}
      >
        <ErrorBoundary>
          <AIAsk onNavigateTo={handleNavigateTo} onSearch={handleSearch} />
        </ErrorBoundary>
      </Layout>
    )}
      {currentPage === 'translation' && (
        <Layout
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          <ErrorBoundary>
            <BookTranslation />
          </ErrorBoundary>
        </Layout>
      )}
      {currentPage === 'about' && (
        <Layout 
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          <ErrorBoundary>
            <AboutUs onBackToHome={handleBackToHome} onNavigateTo={handleNavigateTo} />
          </ErrorBoundary>
        </Layout>
      )}

      {currentPage === 'author' && (
        <Layout 
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          <ErrorBoundary>
            <Authors onNavigateTo={handleNavigateTo} onNavigateToAuthorDetail={handleNavigateToAuthorDetail} />
          </ErrorBoundary>
        </Layout>
      )}

      {currentPage === 'author-detail' && (
        <Layout 
          onViewAllNotifications={handleViewAllNotifications}
          onNavigateTo={handleNavigateTo}
          onBackToHome={handleBackToHome}
          user={user}
          onLogout={handleLogout}
        >
          <ErrorBoundary>
            <AuthorDetail onNavigateTo={handleNavigateTo} authorId={authorId} />
          </ErrorBoundary>
        </Layout>
      )}

      {/* Admin Pages - Không sử dụng Layout để không có footer */}
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
      {currentPage === 'admin-reports' && (
        <ErrorBoundary>
          <AdminLayout onNavigateTo={handleNavigateTo} onLogout={handleLogout} onBackToHome={handleAdminBackToHome} currentPage="admin-reports">
            <AnalyticsDashboard />
          </AdminLayout>
        </ErrorBoundary>
      )}
      {currentPage === 'debug' && (
        <ErrorBoundary>
          <SimpleDebug />
        </ErrorBoundary>
      )}

      {/* Fallback for admin pages */}
      {currentPage && currentPage.startsWith('admin-') && !currentPage.includes('admin-dashboard') && !currentPage.includes('admin-books') && !currentPage.includes('admin-categories') && !currentPage.includes('admin-warehouse') && !currentPage.includes('admin-orders') && !currentPage.includes('admin-users') && !currentPage.includes('admin-reviews') && !currentPage.includes('admin-reports') && (
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

const App = () => (
  <I18nextProvider i18n={i18n}>
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  </I18nextProvider>
)

export default App


