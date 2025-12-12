import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import apiService from '../../services';
import { useLanguage } from '../../contexts/LanguageContext';

const parseStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};

const hasCompletedProfileInfo = (user) => {
  if (!user) return false;
  const normalize = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value.trim();
    return String(value).trim();
  };
  return Boolean(normalize(user.phone)) && Boolean(normalize(user.address));
};

const Home = ({ onNavigateTo }) => {
  const { t } = useLanguage();
  // State cho dữ liệu sách
  const [books, setBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [hasRecommendations, setHasRecommendations] = useState(false);
  const [recoLoading, setRecoLoading] = useState(true);
  const [hasTrackingData, setHasTrackingData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho danh mục
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // State cho user role và quyền hiển thị đề xuất
  const [userRole, setUserRole] = useState(() => {
    const user = parseStoredUser();
    return user?.role || null;
  });
  const [shouldShowRecommendations, setShouldShowRecommendations] = useState(() => {
    const user = parseStoredUser();
    // Chỉ hiển thị recommendations khi user đã đăng nhập (trừ admin)
    // Không hiển thị khi đăng xuất
    if (!user) return false;
    return user.role !== 'admin';
  });

  // IntersectionObserver để track impression của đề xuất
  const recoObserverRef = useRef(null);
  const recoObservedIdsRef = useRef(new Set());
  const recoScrollRef = useRef(null);
  const recoRefreshTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  const scrollReco = useCallback((direction) => {
    const el = recoScrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector('.reco-card');
    const cardWidth = firstCard ? firstCard.clientWidth : Math.min(el.clientWidth / 4, 280);
    const gap = 16;
    el.scrollBy({ left: direction * (cardWidth + gap) * 2, behavior: 'smooth' });
  }, []);

  // Kiểm tra xem user có tracking data không
  const checkTrackingData = useCallback(async () => {
    try {
      const user = parseStoredUser();
      if (!user || user.role === 'admin') {
        setHasTrackingData(false);
        return false;
      }

      // Gọi API recommendations để kiểm tra xem có tracking data không
      const res = await apiService.getRecommendedProducts({ limit: 1 });
      
      // Chỉ trả về true nếu có tracking data VÀ có products
      if (res && res.success && res.data) {
        const hasTrackingData = res.data.hasTrackingData === true;
        const hasProducts = res.data.products && Array.isArray(res.data.products) && res.data.products.length > 0;
        const hasData = hasTrackingData && hasProducts;
        setHasTrackingData(hasTrackingData);
        return hasData;
      }
      
      setHasTrackingData(false);
      return false;
    } catch (error) {
      console.error('Home: Error checking tracking data:', error);
      setHasTrackingData(false);
      return false;
    }
  }, []);

  const refreshRecommendations = useCallback(async ({ silent = false } = {}) => {
    if (userRole === 'admin' || !shouldShowRecommendations) {
      if (isMountedRef.current) {
        setRecommended([]);
        setRecoLoading(false);
        setHasTrackingData(false);
      }
      return;
    }

    if (!silent && isMountedRef.current) {
      setRecoLoading(true);
    }

    try {
      const res = await apiService.getRecommendedProducts({ limit: 20 });
      
      if (res && res.success && res.data) {
        const hasTrackingData = res.data.hasTrackingData === true;
        const next = Array.isArray(res.data.products) ? res.data.products : [];
        
        // Chỉ set recommendations nếu có tracking data VÀ có products
        const shouldShow = hasTrackingData && next.length > 0;
        
        if (isMountedRef.current) {
          setRecommended(next);
          setHasRecommendations(shouldShow);
          setHasTrackingData(hasTrackingData);
        }
      } else {
        if (isMountedRef.current) {
          setRecommended([]);
          setHasRecommendations(false);
          setHasTrackingData(false);
        }
      }
    } catch (error) {
      console.error('Home: Error fetching recommendations', error);
      if (isMountedRef.current) {
        setRecommended([]);
        setHasRecommendations(false);
        setHasTrackingData(false);
      }
    } finally {
      if (!silent && isMountedRef.current) {
        setRecoLoading(false);
      }
    }
  }, [shouldShowRecommendations, userRole]);

  const scheduleRecommendationRefresh = useCallback((delay = 1500) => {
    if (userRole === 'admin' || !shouldShowRecommendations) return;
    if (recoRefreshTimerRef.current) {
      clearTimeout(recoRefreshTimerRef.current);
    }
    recoRefreshTimerRef.current = setTimeout(() => {
      refreshRecommendations();
      recoRefreshTimerRef.current = null;
    }, delay);
  }, [refreshRecommendations, shouldShowRecommendations, userRole]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (recoRefreshTimerRef.current) {
        clearTimeout(recoRefreshTimerRef.current);
        recoRefreshTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const user = parseStoredUser();
    if (!shouldShowRecommendations || !user) {
      setRecommended([]);
      setHasRecommendations(false);
      setHasTrackingData(false);
      setRecoLoading(false);
    }
  }, [shouldShowRecommendations]);

  // Ghi nhớ dữ liệu để tránh tạo lại mỗi lần render
  const blogPosts = useMemo(() => [
    { title: "Fujiko F. Fujio - The Creator of Doraemon", date: "24 Oct, 2019", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop" },
    { title: "The Art of Manga Storytelling", date: "15 Nov, 2019", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop" },
    { title: "Top 10 Must-Read Manga Series", date: "01 Dec, 2019", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=200&fit=crop" }
  ], []);

  // Lấy dữ liệu sách từ API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Home: Fetching books from API...');

        const extractBookList = (response, debugLabel = 'books') => {
          if (Array.isArray(response)) {
            return response;
          }

          if (response?.success) {
            const rawData = response.data ?? response?.books ?? [];

            if (Array.isArray(rawData)) {
              return rawData;
            }

            if (rawData?.books && Array.isArray(rawData.books)) {
              return rawData.books;
            }

            console.warn(`Home: "${debugLabel}" payload is not an array`, rawData);
            return [];
          }

          const fallbackMessage = response?.message || `Không thể tải danh sách ${debugLabel}`;
          throw new Error(fallbackMessage);
        };

        // Fetch all books, new books, and popular books using apiService
        const [booksResponse, newBooksData, popularBooksData] = await Promise.all([
          apiService.getBooks({ limit: 12 }),
          apiService.getBooks({ limit: 4 }), // New books
          apiService.getBooks({ limit: 4 })  // Popular books
        ]);

        console.log('Home: API responses:', {
          booksResponse,
          newBooksData,
          popularBooksData
        });

        const booksData = extractBookList(booksResponse, 'sách');
        const newBooksDataArray = extractBookList(newBooksData, 'sách mới');
        const popularBooksDataArray = extractBookList(popularBooksData, 'sách phổ biến');

        console.log('Home: Processed data:', {
          booksData: booksData?.length || 0,
          newBooksDataArray: newBooksDataArray?.length || 0,
          popularBooksDataArray: popularBooksDataArray?.length || 0
        });

        if (booksData && booksData.length > 0) {
          console.log('Home: First book:', booksData[0]);
        }

        setBooks(booksData);
        setNewBooks(newBooksDataArray);
        setPopularBooks(popularBooksDataArray);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError(error.message || 'Không thể tải dữ liệu sách');
        setBooks([]);
        setNewBooks([]);
        setPopularBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Lấy sản phẩm đề xuất (không subscribe realtime để tránh thay đổi liên tục)
  useEffect(() => {
    refreshRecommendations();
    return () => {
      if (recoRefreshTimerRef.current) {
        clearTimeout(recoRefreshTimerRef.current);
        recoRefreshTimerRef.current = null;
      }
    };
  }, [refreshRecommendations, userRole]);

  // Listen for order status updates to refresh recommendations
  useEffect(() => {
    const handleOrderStatusUpdate = (event) => {
      const { newStatus } = event.detail || {};
      // Refresh recommendations when order is completed
      if (newStatus === 'completed') {
        console.log('[Home] Order completed, refreshing recommendations...');
        // Delay refresh để đảm bảo backend đã track purchase
        setTimeout(() => {
          refreshRecommendations({ silent: false });
        }, 2000);
      }
    };

    window.addEventListener('orderStatusUpdated', handleOrderStatusUpdate);
    return () => {
      window.removeEventListener('orderStatusUpdated', handleOrderStatusUpdate);
    };
  }, [refreshRecommendations]);

  // Kiểm tra tracking data khi user thay đổi
  useEffect(() => {
    if (userRole !== 'admin' && shouldShowRecommendations) {
      checkTrackingData();
    } else {
      setHasTrackingData(false);
    }
  }, [userRole, shouldShowRecommendations, checkTrackingData]);

  // Khởi tạo IntersectionObserver để track impression
  useEffect(() => {
    if (userRole === 'admin' || !shouldShowRecommendations) return;
    // Clean old observer
    if (recoObserverRef.current) {
      try { recoObserverRef.current.disconnect(); } catch (_) {}
      recoObserverRef.current = null;
    }
    if (!('IntersectionObserver' in window)) return;
    const seen = recoObservedIdsRef.current;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const { productId, title } = entry.target.dataset;
          if (productId && !seen.has(productId)) {
            seen.add(productId);
            apiService.trackProductView({
              productId,
              productName: title,
              viewDuration: 0
            });
          }
        }
      });
    }, { threshold: 0.25 });
    recoObserverRef.current = observer;
    // Attach to current recommended items
    setTimeout(() => {
      document.querySelectorAll('[data-reco-item="1"]').forEach((el) => observer.observe(el));
    }, 0);
    return () => {
      try { observer.disconnect(); } catch (_) {}
    };
  }, [recommended, shouldShowRecommendations, userRole]);

  // Lấy danh mục từ API và đếm số sách cho mỗi danh mục
  useEffect(() => {
    const fetchCategoriesWithBookCount = async () => {
      setCategoriesLoading(true);
      try {
        console.log('Home: Fetching categories and book counts...');

        const categoriesResponse = await apiService.getCategories();

        if (categoriesResponse.success) {
          const categoriesData = categoriesResponse.data || [];
          console.log('Home: Categories loaded:', categoriesData.length);

          // Fetch tất cả sách để đếm số lượng cho mỗi danh mục
          const booksResponse = await apiService.getBooks({ limit: 1000 });
          const allBooks = booksResponse.success ? (booksResponse.data || []) : [];

          // Đếm số sách cho mỗi danh mục và lấy hình ảnh từ sách đầu tiên
          const categoriesWithCount = categoriesData.map(category => {
            const categoryBooks = allBooks.filter(book => book.category_id === category.category_id);
            const bookCount = categoryBooks.length;

            // Lấy hình ảnh từ sách đầu tiên trong danh mục, hoặc sử dụng hình mặc định
            const coverImage = categoryBooks.length > 0 && categoryBooks[0].cover_image
              ? categoryBooks[0].cover_image
              : '/images/book1.jpg';

            return {
              ...category,
              book_count: bookCount,
              cover_image: coverImage
            };
          });

          console.log('Home: Categories with book counts:', categoriesWithCount);
          setCategories(categoriesWithCount);
        } else {
          console.error('Failed to fetch categories:', categoriesResponse);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategoriesWithBookCount();
  }, []);

  // Lấy user role và trạng thái hồ sơ để kiểm tra quyền đặt hàng và hiển thị đề xuất
  useEffect(() => {
    const updateUserState = () => {
      const user = parseStoredUser();
      setUserRole(user?.role || null);
      // Chỉ hiển thị recommendations khi user đã đăng nhập (trừ admin)
      // Không hiển thị khi đăng xuất
      if (!user) {
        setShouldShowRecommendations(false);
        setRecommended([]);
        setHasRecommendations(false);
        setHasTrackingData(false);
        setRecoLoading(false);
      } else {
        setShouldShowRecommendations(user.role !== 'admin');
      }
    };

    // Cập nhật state ban đầu
    updateUserState();

    // Listen for logout events
    const handleUserLoggedOut = () => {
      console.log('[Home] User logged out, clearing recommendations');
      updateUserState();
    };

    // Listen for storage changes (when user logs in/out from another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === null) {
        console.log('[Home] Storage changed, updating user state');
        updateUserState();
      }
    };

    window.addEventListener('userLoggedOut', handleUserLoggedOut);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Ghi nhớ các event handlers
  const handleBookClick = useCallback((bookId) => {
    scheduleRecommendationRefresh();
    onNavigateTo('product', { productId: bookId });
  }, [onNavigateTo, scheduleRecommendationRefresh]);

  // Xử lý thêm vào giỏ hàng 
  const handleAddToCart = useCallback(async (book, e) => {
    e.stopPropagation();

    // Kiểm tra user đã đăng nhập chưa - kiểm tra chặt chẽ hơn
    let user = null;
    try {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'null' && userStr !== 'undefined') {
        user = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      user = null;
    }

    // Kiểm tra user có hợp lệ không (phải là object và có user_id)
    if (!user || typeof user !== 'object' || !user.user_id) {
      const message = t('home.messages.loginRequired');
      if (window.showToast) {
        window.showToast(message, 'warning');
      } else {
        alert(message);
      }
      onNavigateTo('auth');
      return;
    }

    if (user.role === 'admin') {
      const message = 'Admin không thể thêm sản phẩm vào giỏ.';
      if (window.showToast) {
        window.showToast(message, 'warning');
      } else {
        alert(message);
      }
      return;
    }

    // Kiểm tra còn hàng không
    if (book.stock <= 0) {
      const message = t('home.messages.outOfStock');
      if (window.showToast) {
        window.showToast(message, 'warning');
      } else {
        alert(message);
      }
      return;
    }

    try {

      const cartKey = `cart_${user.user_id}`;
      const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      const existingItem = existingCart.find(item => item.book_id === book.book_id);

      if (existingItem) {
        // Kiểm tra số lượng trong giỏ có vượt quá stock không
        if (existingItem.quantity >= book.stock) {
          const message = t('home.messages.stockLimit', { stock: book.stock });
          if (window.showToast) {
            window.showToast(message, 'warning');
          } else {
            alert(message);
          }
          return;
        }

        // Tăng số lượng sản phẩm hiện có
        existingItem.quantity += 1;

        // Cập nhật localStorage
        const updatedCart = existingCart.map(item =>
          item.book_id === book.book_id ? existingItem : item
        );
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));

        // Hiển thị thông báo thành công
        const message = t('home.messages.quantityIncreased', { title: book.title });
        if (window.showToast) {
          window.showToast(message, 'success');
        } else {
          alert(message);
        }
      } else {
        // Thêm sản phẩm mới vào giỏ hàng
        const newItem = {
          book_id: book.book_id,
          title: book.title,
          price: book.price,
          quantity: 1,
          cover_image: book.cover_image,
          author_name: book.author_name,
          author: book.author,
          category_name: book.category_name,
          publisher_name: book.publisher_name
        };

        // Thêm vào localStorage
        const updatedCart = [...existingCart, newItem];
        localStorage.setItem(cartKey, JSON.stringify(updatedCart));

        // Hiển thị thông báo thành công
        const message = t('home.messages.addSuccess', { title: book.title });
        if (window.showToast) {
          window.showToast(message, 'success');
        } else {
          alert(message);
        }
      }

      // Kích hoạt sự kiện cập nhật giỏ hàng
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { action: 'add', bookId: book.book_id }
      }));

      scheduleRecommendationRefresh();

    } catch (error) {
      console.error('Error adding to cart:', error);
      const message = t('home.messages.addFailed');
      if (window.showToast) {
        window.showToast(message, 'error');
      } else {
        alert(message);
      }
    }
  }, [onNavigateTo, scheduleRecommendationRefresh]);

  return (
    <main className="flex-grow-1">

      {/* Danh Mục Nổi Bật Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">{t('home.sections.categoriesTitle')}</h2>
            </div>
            <div className="col-auto">
              <a href="#" className="text-decoration-none" style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                transition: 'all 0.3s ease'
              }}
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState({}, '', '/categories');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#007bff';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#333';
                  e.target.style.transform = 'translateX(0)';
                }}>
                {t('home.actions.viewAll')} <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>

          <div className="row g-4">
            {categoriesLoading ? (
              // Loading state
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="col-lg-3 col-md-6">
                  <div className="card h-100 border-0 shadow-sm" style={{
                    borderRadius: '8px',
                    overflow: 'visible',
                    minHeight: '400px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <div className="card-body d-flex align-items-center justify-content-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">{t('home.states.loading')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (categories && categories.length > 0) ? (
              // Render categories from API
              (categories || []).slice(0, 4).map((category, index) => (
                <div key={index} className="col-lg-3 col-md-6">
                  <div className="card h-100 border-0 shadow-sm" style={{
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    overflow: 'visible',
                    minHeight: '400px',
                    backgroundColor: 'white'
                  }}
                    onClick={() => {
                      // Chuyển đến trang categories với filter theo danh mục
                      window.history.pushState({}, '', `/categories?category=${encodeURIComponent(category.name)}`);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}>
                    <div className="position-relative" style={{ height: '250px', overflow: 'hidden' }}>
                      <img
                        src={category.cover_image || '/images/book1.jpg'}
                        className="card-img-top"
                        alt={category.name}
                        style={{
                          height: '100%',
                          objectFit: 'cover',
                          width: '100%'
                        }}
                        onError={(e) => {
                          e.target.src = '/images/book1.jpg';
                        }}
                      />
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-primary px-3 py-2" style={{ fontSize: '0.8rem' }}>
                          {t('home.badges.bookCount', { count: category.book_count || 0 })}
                        </span>
                      </div>
                    </div>

                    <div className="card-body p-3 text-center" style={{ minHeight: '120px' }}>
                      <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1.1rem', lineHeight: '1.3' }}>
                        {category.name}
                      </h5>
                      <p className="card-text text-muted mb-0" style={{
                        fontSize: '0.85rem',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {category.description || t('home.messages.categoryFallback')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback when no categories
              <div className="col-12">
                <div className="text-center py-5">
                  <h5>{t('home.states.noCategoriesTitle')}</h5>
                  <p className="text-muted">{t('home.states.noCategoriesSubtitle')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Đề xuất cho bạn - chỉ hiển thị khi user đã đăng nhập và có recommendations */}
      {(() => {
        const user = parseStoredUser();
        return user && userRole !== 'admin' && shouldShowRecommendations && hasRecommendations;
      })() && (
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="fw-bold mb-0">{t('home.sections.recommendTitle')}</h2>
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-outline-secondary btn-sm" onClick={() => scrollReco(-1)}>
                <i className="bi bi-chevron-left"></i>
              </button>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => scrollReco(1)}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
          <p className="text-muted mb-4">{t('home.sections.recommendSubtitle')}</p>

          {recoLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('home.states.loading')}</span>
              </div>
              <p className="mt-2">{t('home.messages.recommendLoading')}</p>
            </div>
          ) : (
            <div
              ref={recoScrollRef}
              className="reco-slider d-flex flex-nowrap gap-4"
              style={{ overflowX: 'auto', scrollBehavior: 'smooth', paddingBottom: '6px' }}
            >
              {recommended.map((book, idx) => (
                <div
                  key={`reco-${book.book_id || idx}`}
                  className="reco-card card h-100 border-0 shadow-sm"
                  style={{
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    height: '450px',
                    backgroundColor: 'white',
                    width: '300px',
                    minWidth: '300px'
                  }}
                  onClick={() => handleBookClick(book.book_id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                  data-reco-item="1"
                  data-product-id={String(book.book_id)}
                  data-title={book.title}
                >
                  <div className="position-relative">
                    <img
                      src={book.cover_image || '/images/book1.jpg'}
                      className="card-img-top"
                      alt={book.title}
                      style={{
                        height: '280px',
                        objectFit: 'contain',
                        width: '100%',
                        backgroundColor: '#f8f9fa'
                      }}
                    />
                    <div className="position-absolute top-0 start-0 m-2">
                      <button
                        className="btn btn-sm"
                        style={{
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          backdropFilter: 'blur(10px)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,1)';
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,0.95)';
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                      >
                        <i className="bi bi-heart text-dark" style={{ fontSize: '14px' }}></i>
                      </button>
                    </div>

                    {book.stock > 0 && userRole !== 'admin' && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <button
                          className="btn btn-sm"
                          style={{
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,123,255,0.95)',
                            border: '1px solid rgba(0,123,255,0.3)',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,123,255,0.2)',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)'
                          }}
                          onClick={(e) => handleAddToCart(book, e)}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(0,123,255,1)';
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(0,123,255,0.95)';
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 2px 8px rgba(0,123,255,0.2)';
                          }}
                        >
                          <i className="bi bi-cart-plus text-white" style={{ fontSize: '14px' }}></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="card-title fw-bold mb-2" style={{
                      fontSize: '1rem',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.6rem'
                    }}>
                      {book.title}
                    </h6>
                    <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                      {book.author_name || t('home.messages.unknownAuthor')}
                    </p>

                    <div className="mb-2">
                      <div className="d-flex align-items-center">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi bi-star${i < Math.floor(book.rating || 0) ? '-fill' : ''} text-warning`}
                            style={{ fontSize: '12px' }}
                          ></i>
                        ))}
                        <span className="text-muted small ms-1" style={{ fontSize: '11px' }}>
                          {t('home.badges.ratingCount', { count: book.review_count ?? book.reviewCount ?? 0 })}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold text-dark h5 mb-0">
                          {book.price ? new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(book.price) : t('home.messages.contactForPrice')}
                        </span>
                        {book.stock > 0 ? (
                          <small className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            {t('home.states.inStock')}
                          </small>
                        ) : (
                          <small className="text-danger">
                            <i className="bi bi-x-circle me-1"></i>
                            {t('home.states.outOfStock')}
                          </small>
                        )}
                      </div>
                      <button
                        className="btn btn-outline-primary w-100"
                        style={{
                          fontSize: '14px',
                          padding: '8px 16px',
                          border: '1px solid #007bff',
                          backgroundColor: 'white',
                          color: '#007bff'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookClick(book.book_id);
                        }}
                      >
                        {t('home.actions.viewDetails')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* Sách Nổi Bật Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">{t('home.sections.featuredTitle')}</h2>
            </div>
          </div>

          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">{t('home.states.loading')}</span>
                </div>
                <p className="mt-2">{t('home.states.updating')}</p>
              </div>
            ) : error ? (
              <div className="col-12 text-center py-5">
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              </div>
            ) : (books || []).slice(0, 4).map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  height: '450px',
                  backgroundColor: 'white'
                }}
                  onClick={() => handleBookClick(book.book_id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                    // Hiển thị nút thêm vào giỏ hàng nếu còn hàng
                    const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                    if (addToCartBtn && book.stock > 0) {
                      addToCartBtn.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    // Ẩn nút thêm vào giỏ hàng
                    const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                    if (addToCartBtn) {
                      addToCartBtn.style.opacity = '0';
                    }
                  }}>
                  <div className="position-relative">
                    <img
                      src={book.cover_image || '/images/book1.jpg'}
                      className="card-img-top"
                      alt={book.title}
                      style={{
                        height: '280px',
                        objectFit: 'contain',
                        width: '100%',
                        backgroundColor: '#f8f9fa'
                      }}
                    />
                    {/* Heart Icon - góc trên trái */}
                    <div className="position-absolute top-0 start-0 m-2">
                      <button
                        className="btn btn-sm"
                        style={{
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          backdropFilter: 'blur(10px)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Add to wishlist functionality
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,1)';
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,0.95)';
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                      >
                        <i className="bi bi-heart text-dark" style={{ fontSize: '14px' }}></i>
                      </button>
                    </div>

                    {/* Shopping Cart Icon - góc trên phải */}
                    {book.stock > 0 && userRole !== 'admin' && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <button
                          className="btn btn-sm"
                          style={{
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,123,255,0.95)',
                            border: '1px solid rgba(0,123,255,0.3)',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,123,255,0.2)',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)'
                          }}
                          onClick={(e) => handleAddToCart(book, e)}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(0,123,255,1)';
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(0,123,255,0.95)';
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 2px 8px rgba(0,123,255,0.2)';
                          }}
                        >
                          <i className="bi bi-cart-plus text-white" style={{ fontSize: '14px' }}></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="card-title fw-bold mb-2" style={{
                      fontSize: '1rem',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.6rem'
                    }}>
                      {book.title}
                    </h6>
                    <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                      {book.author_name || t('home.messages.unknownAuthor')}
                    </p>

                    {/* Rating */}
                    <div className="mb-2">
                      <div className="d-flex align-items-center">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi bi-star${i < Math.floor(book.rating || 0) ? '-fill' : ''} text-warning`}
                            style={{ fontSize: '12px' }}
                          ></i>
                        ))}
                        <span className="text-muted small ms-1" style={{ fontSize: '11px' }}>
                          ({book.review_count ?? book.reviewCount ?? 0})
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold text-dark h5 mb-0">
                          {book.price ? new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(book.price) : t('home.messages.contactForPrice')}
                        </span>
                        {book.stock > 0 ? (
                          <small className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            {t('home.states.inStock')}
                          </small>
                        ) : (
                          <small className="text-danger">
                            <i className="bi bi-x-circle me-1"></i>
                            {t('home.states.outOfStock')}
                          </small>
                        )}
                      </div>
                      {/* Button Xem chi tiết */}
                      <button
                        className="btn btn-outline-primary w-100"
                        style={{
                          fontSize: '14px',
                          padding: '8px 16px',
                          border: '1px solid #007bff',
                          backgroundColor: 'white',
                          color: '#007bff'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookClick(book.book_id);
                        }}
                      >
                        {t('home.actions.viewDetails')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sách Mới Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">{t('home.sections.newTitle')}</h2>
            </div>
          </div>

          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">{t('home.states.loading')}</span>
                </div>
                <p className="mt-2">{t('home.states.updating')}</p>
              </div>
            ) : error ? (
              <div className="col-12 text-center py-5">
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              </div>
            ) : newBooks.map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  height: '450px',
                  backgroundColor: 'white'
                }}
                  onClick={() => handleBookClick(book.book_id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                    // Hiển thị nút thêm vào giỏ hàng nếu còn hàng
                    const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                    if (addToCartBtn && book.stock > 0) {
                      addToCartBtn.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    // Ẩn nút thêm vào giỏ hàng
                    const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                    if (addToCartBtn) {
                      addToCartBtn.style.opacity = '0';
                    }
                  }}>
                  <div className="position-relative">
                    <img
                      src={book.cover_image || '/images/book1.jpg'}
                      className="card-img-top"
                      alt={book.title}
                      style={{
                        height: '280px',
                        objectFit: 'contain',
                        width: '100%',
                        backgroundColor: '#f8f9fa'
                      }}
                    />
                    {/* Heart Icon - góc trên trái */}
                    <div className="position-absolute top-0 start-0 m-2">
                      <button
                        className="btn btn-sm"
                        style={{
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          backdropFilter: 'blur(10px)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Add to wishlist functionality
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,1)';
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,0.95)';
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                      >
                        <i className="bi bi-heart text-dark" style={{ fontSize: '14px' }}></i>
                      </button>
                    </div>

                    {/* Shopping Cart Icon - góc trên phải */}
                    {book.stock > 0 && userRole !== 'admin' && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <button
                          className="btn btn-sm"
                          style={{
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,123,255,0.95)',
                            border: '1px solid rgba(0,123,255,0.3)',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,123,255,0.2)',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)'
                          }}
                          onClick={(e) => handleAddToCart(book, e)}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(0,123,255,1)';
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(0,123,255,0.95)';
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 2px 8px rgba(0,123,255,0.2)';
                          }}
                        >
                          <i className="bi bi-cart-plus text-white" style={{ fontSize: '14px' }}></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="card-title fw-bold mb-2" style={{
                      fontSize: '1rem',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.6rem'
                    }}>
                      {book.title}
                    </h6>
                    <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                      {book.author_name || t('home.messages.unknownAuthor')}
                    </p>

                    {/* Rating */}
                    <div className="mb-2">
                      <div className="d-flex align-items-center">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi bi-star${i < Math.floor(book.rating || 0) ? '-fill' : ''} text-warning`}
                            style={{ fontSize: '12px' }}
                          ></i>
                        ))}
                        <span className="text-muted small ms-1" style={{ fontSize: '11px' }}>
                          ({book.review_count ?? book.reviewCount ?? 0})
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold text-dark h5 mb-0">
                          {book.price ? new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(book.price) : t('home.messages.contactForPrice')}
                        </span>
                        {book.stock > 0 ? (
                          <small className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            {t('home.states.inStock')}
                          </small>
                        ) : (
                          <small className="text-danger">
                            <i className="bi bi-x-circle me-1"></i>
                            {t('home.states.outOfStock')}
                          </small>
                        )}
                      </div>
                      {/* Button Xem chi tiết */}
                      <button
                        className="btn btn-outline-primary w-100"
                        style={{
                          fontSize: '14px',
                          padding: '8px 16px',
                          border: '1px solid #007bff',
                          backgroundColor: 'white',
                          color: '#007bff'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookClick(book.book_id);
                        }}
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sách Phổ Biến Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">{t('home.sections.popularTitle')}</h2>
            </div>
          </div>

          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-dark" role="status">
                  <span className="visually-hidden">{t('home.states.loading')}</span>
                </div>
                <p className="mt-2">{t('home.states.updating')}</p>
              </div>
            ) : error ? (
              <div className="col-12 text-center py-5">
                <div className="alert alert-warning" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              </div>
            ) : popularBooks.map((book, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm" style={{
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  height: '450px',
                  backgroundColor: 'white'
                }}
                  onClick={() => handleBookClick(book.book_id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                    // Hiển thị nút thêm vào giỏ hàng nếu còn hàng
                    const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                    if (addToCartBtn && book.stock > 0) {
                      addToCartBtn.style.opacity = '1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    // Ẩn nút thêm vào giỏ hàng
                    const addToCartBtn = e.currentTarget.querySelector('.add-to-cart-btn');
                    if (addToCartBtn) {
                      addToCartBtn.style.opacity = '0';
                    }
                  }}>
                  <div className="position-relative">
                    <img
                      src={book.cover_image || '/images/book1.jpg'}
                      className="card-img-top"
                      alt={book.title}
                      style={{
                        height: '280px',
                        objectFit: 'contain',
                        width: '100%',
                        backgroundColor: '#f8f9fa'
                      }}
                    />
                    {/* Heart Icon - góc trên trái */}
                    <div className="position-absolute top-0 start-0 m-2">
                      <button
                        className="btn btn-sm"
                        style={{
                          width: '35px',
                          height: '35px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          border: '1px solid rgba(0,0,0,0.1)',
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease',
                          backdropFilter: 'blur(10px)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Add to wishlist functionality
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,1)';
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(255,255,255,0.95)';
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                      >
                        <i className="bi bi-heart text-dark" style={{ fontSize: '14px' }}></i>
                      </button>
                    </div>

                    {/* Shopping Cart Icon - góc trên phải */}
                    {book.stock > 0 && userRole !== 'admin' && (
                      <div className="position-absolute top-0 end-0 m-2">
                        <button
                          className="btn btn-sm"
                          style={{
                            width: '35px',
                            height: '35px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,123,255,0.95)',
                            border: '1px solid rgba(0,123,255,0.3)',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,123,255,0.2)',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)'
                          }}
                          onClick={(e) => handleAddToCart(book, e)}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(0,123,255,1)';
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,123,255,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'rgba(0,123,255,0.95)';
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0 2px 8px rgba(0,123,255,0.2)';
                          }}
                        >
                          <i className="bi bi-cart-plus text-white" style={{ fontSize: '14px' }}></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-body p-3 d-flex flex-column">
                    <h6 className="card-title fw-bold mb-2" style={{
                      fontSize: '1rem',
                      lineHeight: '1.3',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.6rem'
                    }}>
                      {book.title}
                    </h6>
                    <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                      {book.author_name || t('home.messages.unknownAuthor')}
                    </p>

                    {/* Rating */}
                    <div className="mb-2">
                      <div className="d-flex align-items-center">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi bi-star${i < Math.floor(book.rating || 0) ? '-fill' : ''} text-warning`}
                            style={{ fontSize: '12px' }}
                          ></i>
                        ))}
                        <span className="text-muted small ms-1" style={{ fontSize: '11px' }}>
                          ({book.review_count ?? book.reviewCount ?? 0})
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="fw-bold text-dark h5 mb-0">
                          {book.price ? new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(book.price) : t('home.messages.contactForPrice')}
                        </span>
                        {book.stock > 0 ? (
                          <small className="text-success">
                            <i className="bi bi-check-circle me-1"></i>
                            {t('home.states.inStock')}
                          </small>
                        ) : (
                          <small className="text-danger">
                            <i className="bi bi-x-circle me-1"></i>
                            {t('home.states.outOfStock')}
                          </small>
                        )}
                      </div>
                      {/* Button view details */}
                      <button
                        className="btn btn-outline-primary w-100"
                        style={{
                          fontSize: '14px',
                          padding: '8px 16px',
                          border: '1px solid #007bff',
                          backgroundColor: 'white',
                          color: '#007bff'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookClick(book.book_id);
                        }}
                      >
                        {t('home.actions.viewDetails')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tác Giả Yêu Thích Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">{t('home.sections.authorsTitle')}</h2>
            </div>
            <div className="col-auto">
              <a
                href="#"
                className="text-decoration-none"
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333',
                  transition: 'all 0.3s ease'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateTo('author');
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#007bff';
                  e.target.style.transform = 'translateX(5px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#333';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                {t('home.actions.viewAll')} <i className="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>

          <div className="row g-4 justify-content-center">
            {[
              { id: 2, name: "Fujiko F. Fujio", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
              { id: 7, name: "Delia Owens", image: "https://photo.znews.vn/w960/Uploaded/sgorvz/2025_05_23/tac_gia_70_tuoi.jpg" },
              { id: 1, name: "Koyoharu Gotouge", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
              { id: 4, name: "Gosho Aoyama", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face" },
              { id: 8, name: "Haruki Murakami", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face" },
              { id: 3, name: "J.K. Rowling", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" }
            ].map((author, index) => (
              <div key={index} className="col-lg-2 col-md-3 col-sm-4 col-6">
                <div
                  className="text-center"
                  style={{
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    padding: '10px',
                    borderRadius: '10px'
                  }}
                  onClick={() => onNavigateTo('author-detail', { id: author.id })}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <img
                    src={author.image}
                    alt={author.name}
                    className="rounded-circle mx-auto mb-3"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80/6c757d/ffffff?text=' + encodeURIComponent(author.name.charAt(0));
                    }}
                  />
                  <h6 className="text-dark mb-0">{author.name}</h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* From the Blog Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-4">
            <div className="col">
              <h2 className="fw-bold text-dark">{t('home.sections.blogTitle')}</h2>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-outline-primary"
                onClick={() => {
                  console.log('Blog button clicked');
                  onNavigateTo('blog');
                }}
              >
                {t('home.actions.viewAll')} <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>

          <div className="row g-4">
            {[
              { title: "Fujiko F. Fujio - The Creator of Doraemon", date: "24 Oct, 2019", image: "https://xkld.thanhgiang.com.vn/wp-content/uploads/2020/12/chuyen-doi-it-ai-biet-ve-hoa-si-fujiko-f-fujio-1-1024x538.jpg" },
              { title: "The Art of Manga Storytelling", date: "15 Nov, 2019", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop" },
              { title: "Top 10 Must-Read Manga Series", date: "01 Dec, 2019", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=200&fit=crop" }
            ].map((post, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div
                  className="card h-100 shadow-sm"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onNavigateTo('blog-detail')}
                >
                  <img
                    src={post.image}
                    className="card-img-top"
                    alt={post.title}
                    style={{ height: '200px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                  />
                  <div className="card-body">
                    <small className="text-muted">{post.date}</small>
                    <h5 className="card-title mt-2">{post.title}</h5>
                    <p className="card-text text-muted">
                      Discover the life and works of the legendary manga artist who created Doraemon.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;


