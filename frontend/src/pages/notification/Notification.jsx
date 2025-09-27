import React, { useState, useCallback, useMemo } from 'react';
import MenuClient from '../../layouts/MenuClient';

const Notification = ({ onBackToHome, onNavigateTo, onSearch }) => {
  const [activeTab, setActiveTab] = useState('notification');

  // Mock notification data - moved outside component to avoid recreation
  const notifications = useMemo(() => [
    {
      notification_id: 1,
      order_id: 1,
      user_id: 1,
      title: "Order has been completed.",
      message: "The package GY9EX3HW from order 25092023GE13TM has been successfully delivered to you",
      created_at: "2025-09-24 15:50:00",
      is_read: false,
      action: "Review",
      book_cover_image: "/images/book1.jpg"
    },
    {
      notification_id: 2,
      order_id: 2,
      user_id: 1,
      title: "Order has been completed.",
      message: "The package GY9EX3HW from order 25092023GE13TM has been successfully delivered to you",
      created_at: "2025-09-24 15:50:00",
      is_read: false,
      action: "View Details",
      book_cover_image: "/images/book2.jpg"
    },
    {
      notification_id: 3,
      order_id: 3,
      user_id: 1,
      title: "Order has been completed.",
      message: "The package GY9EX3HW from order 25092023GE13TM has been successfully delivered to you",
      created_at: "2025-09-24 15:50:00",
      is_read: false,
      action: "Review",
      book_cover_image: "/images/book3.jpg"
    },
    {
      notification_id: 4,
      order_id: 4,
      user_id: 1,
      title: "Order has been completed.",
      message: "The package GY9EX3HW from order 25092023GE13TM has been successfully delivered to you",
      created_at: "2025-09-24 15:50:00",
      is_read: false,
      action: "Review",
      book_cover_image: "/images/book4.jpg"
    }
  ], []);

  const tabs = useMemo(() => [
    { id: 'notification', label: 'Notification' },
    { id: 'account', label: 'My Account' },
    { id: 'purchases', label: 'Purchases' },
    { id: 'voucher', label: 'Voucher' }
  ], []);

  const handleActionClick = useCallback((action, notificationId) => {
    console.log(`${action} clicked for notification ${notificationId}`);
    // Handle action logic here
  }, []);

  // Common styles to avoid recreation
  const staticCardStyle = useMemo(() => ({
    cursor: 'default',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1) !important',
    transform: 'none !important'
  }), []);

  const staticButtonStyle = useMemo(() => ({
    border: 'none', 
    background: 'none',
    borderRadius: '0',
    cursor: 'default',
    boxShadow: 'none !important',
    transform: 'none !important'
  }), []);

  const actionButtonStyle = useMemo(() => ({
    backgroundColor: '#ffc107',
    border: 'none',
    color: '#000',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: 'none !important',
    transform: 'none !important'
  }), []);

  // Event handlers to prevent hover effects
  const preventHover = useCallback((e) => {
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.backgroundColor = 'transparent';
  }, []);

  const preventHoverAction = useCallback((e) => {
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.backgroundColor = '#ffc107';
  }, []);

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f5f5f5'}}>
      {/* Main Menu */}
      <MenuClient onNavigateTo={onNavigateTo} onBackToHome={onBackToHome} onSearch={onSearch} />

      <div className="container py-4">
        {/* Back Home Navigation */}
        <div className="mb-3">
          <button
            className="btn btn-link text-dark p-0 no-hover"
            onClick={onBackToHome}
            style={{ 
              border: 'none', 
              background: 'none', 
              fontSize: '16px',
              textDecoration: 'none',
              boxShadow: 'none'
            }}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Home/
            <span className="fw-bold" style={{ fontSize: '16px' }}> Account</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="d-flex border-bottom">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`btn btn-link text-decoration-none px-4 py-2 ${
                  activeTab === tab.id ? 'text-primary border-bottom border-primary border-2' : 'text-dark'
                }`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  border: 'none', 
                  background: 'none',
                  borderRadius: '0',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="row">
          <div className="col-12">
            {activeTab === 'notification' && (
              <div className="row g-4">
                {notifications.map((notification) => (
                  <div key={notification.notification_id} className="col-12">
                    <div className="card shadow-sm" style={{
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}>
                      <div className="card-body p-3">
                        <div className="row align-items-center">
                          <div className="col-auto">
                            <img 
                              src={notification.book_cover_image} 
                              alt="Book cover"
                              className="rounded"
                              style={{ 
                                width: '60px', 
                                height: '80px', 
                                objectFit: 'cover' 
                              }}
                            />
                          </div>
                          <div className="col">
                            <h6 className="card-title mb-1 fw-bold">{notification.title}</h6>
                            <p className="card-text text-muted small mb-1">{notification.message}</p>
                            <small className="text-muted">{notification.created_at}</small>
                          </div>
                          <div className="col-auto">
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleActionClick(notification.action, notification.notification_id)}
                              style={{
                                backgroundColor: '#ffc107',
                                border: 'none',
                                color: '#000',
                                fontWeight: '500',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,193,7,0.3)';
                                e.currentTarget.style.backgroundColor = '#ffb300';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.backgroundColor = '#ffc107';
                              }}
                            >
                              {notification.action}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'account' && (
              <div className="row g-4">
                <div className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-body p-4">
                      <h5 className="card-title">My Account</h5>
                      <p className="text-muted">Account information will be displayed here.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'purchases' && (
              <div className="row g-4">
                <div className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-body p-4">
                      <h5 className="card-title">Purchases</h5>
                      <p className="text-muted">Purchase history will be displayed here.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'voucher' && (
              <div className="row g-4">
                <div className="col-12">
                  <div className="card shadow-sm">
                    <div className="card-body p-4">
                      <h5 className="card-title">Voucher</h5>
                      <p className="text-muted">Available vouchers will be displayed here.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
