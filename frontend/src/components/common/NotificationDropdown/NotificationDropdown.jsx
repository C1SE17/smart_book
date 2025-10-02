import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';

const NotificationDropdown = ({ onViewAllNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  // Mock notification data - memoized to prevent recreation
  const notifications = useMemo(() => [
    {
      id: 1,
      title: "Đơn hàng đã hoàn tất",
      message: "Đơn hàng 25092023GE13TM đã được giao thành công. Hãy đánh giá sản phẩm trước 27-10-2025 để nhận 200 xu!",
      time: "2 giờ trước",
      isRead: false,
      image: "/images/book1.jpg",
      bookTitle: "WHERE THE CRAWDADS SING",
      author: "Delia Owens",
      type: "order"
    },
    {
      id: 2,
      title: "Sách mới phù hợp với bạn",
      message: "Dựa trên lịch sử mua hàng, chúng tôi gợi ý những cuốn sách mới có thể bạn sẽ thích",
      time: "4 giờ trước",
      isRead: false,
      image: "/images/book2.jpg",
      bookTitle: "Doraemon: Nobita's Little Star Wars",
      author: "Fujiko F. Fujio",
      type: "recommendation"
    },
    {
      id: 3,
      title: "Khuyến mãi đặc biệt",
      message: "Giảm giá 30% cho tất cả sách Manga trong tuần này. Đừng bỏ lỡ cơ hội!",
      time: "1 ngày trước",
      isRead: true,
      image: "/images/book3.jpg",
      bookTitle: "Demon Slayer - Infinity Castle",
      author: "Koyoharu Gotouge",
      type: "promotion"
    },
    {
      id: 4,
      title: "Cập nhật tài khoản",
      message: "Thông tin tài khoản của bạn đã được cập nhật thành công",
      time: "2 ngày trước",
      isRead: true,
      image: "/images/book4.jpg",
      bookTitle: "Conan - Vụ Án Nữ Hoàng 450",
      author: "Gosho Aoyama",
      type: "account"
    }
  ], []);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.isRead).length, 
    [notifications]
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsHovered(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Delay closing to allow user to move mouse to dropdown content
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  }, []);

  const handleNotificationClick = useCallback((notification) => {
    console.log('Notification clicked:', notification);
    // Mark as read logic here
  }, []);

  const handleViewAllClick = useCallback((e) => {
    e.stopPropagation();
    if (onViewAllNotifications) {
      onViewAllNotifications();
    }
  }, [onViewAllNotifications]);

  return (
    <div 
      ref={dropdownRef}
      className="position-relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Notification Bell Icon */}
      <div 
        className="position-relative"
        style={{ cursor: 'pointer' }}
      >
        <i 
          className="bi bi-bell fs-5 text-white"
          style={{ 
            transition: 'all 0.3s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        ></i>
        {unreadCount > 0 && (
          <span 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: '10px', minWidth: '18px', height: '18px' }}
          >
            {unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div 
          className="position-absolute end-0 mt-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            width: '380px',
            maxHeight: '500px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            border: '1px solid #e9ecef',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          {/* Header */}
          <div 
            className="d-flex justify-content-between align-items-center p-3"
            style={{ 
              backgroundColor: 'white',
              borderBottom: '1px solid #e9ecef'
            }}
          >
            <h6 className="mb-0 fw-bold text-dark d-flex align-items-center">
              <i className="bi bi-bell me-2 text-primary"></i>
              Thông báo mới nhận
            </h6>
            <a
              href="#"
              className="text-decoration-none"
              onClick={handleViewAllClick}
              style={{ 
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                transition: 'all 0.3s ease'
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
              Xem tất cả <i className="bi bi-arrow-right ms-1"></i>
            </a>
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 border-bottom"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: !notification.isRead ? '#f8f9fa' : 'white',
                    borderLeft: !notification.isRead ? '4px solid #007bff' : '4px solid transparent'
                  }}
                  onClick={() => handleNotificationClick(notification)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f0f8ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = !notification.isRead ? '#f8f9fa' : 'white';
                  }}
                >
                  <div className="d-flex align-items-start">
                    <img
                      src={notification.image}
                      alt="Notification"
                      className="rounded me-3"
                      style={{
                        width: '60px',
                        height: '80px',
                        objectFit: 'cover',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 
                          className={`mb-1 ${!notification.isRead ? 'fw-bold' : 'fw-normal'}`}
                          style={{ 
                            fontSize: '15px', 
                            lineHeight: '1.3',
                            color: '#333'
                          }}
                        >
                          {notification.title}
                        </h6>
                        {!notification.isRead && (
                          <div 
                            className="rounded-circle bg-primary"
                            style={{ 
                              width: '8px', 
                              height: '8px', 
                              flexShrink: 0, 
                              marginTop: '4px' 
                            }}
                          ></div>
                        )}
                      </div>
                      
                      {/* Book title and author */}
                      <div className="mb-2">
                        <p 
                          className="mb-1 fw-semibold"
                          style={{ 
                            fontSize: '13px', 
                            color: '#333',
                            lineHeight: '1.2'
                          }}
                        >
                          {notification.bookTitle}
                        </p>
                        <p 
                          className="mb-1 text-muted"
                          style={{ 
                            fontSize: '12px',
                            lineHeight: '1.2'
                          }}
                        >
                          {notification.author}
                        </p>
                      </div>
                      
                      <p 
                        className="text-muted mb-2"
                        style={{ 
                          fontSize: '13px', 
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {notification.message}
                      </p>
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted" style={{ fontSize: '11px' }}>
                          {notification.time}
                        </small>
                        {notification.type === 'order' && (
                          <span 
                            className="badge bg-success"
                            style={{ fontSize: '10px' }}
                          >
                            Hoàn tất
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4">
                <i className="bi bi-bell-slash display-4 text-muted mb-3"></i>
                <p className="text-muted mb-0">Không có thông báo mới</p>
              </div>
            )}
          </div>

        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationDropdown;
