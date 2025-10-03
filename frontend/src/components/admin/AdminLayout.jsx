import React, { useState } from 'react';

const AdminLayout = ({ children, onNavigateTo, currentPage }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: 'fas fa-chart-pie', path: 'admin-dashboard' },
        { id: 'books', name: 'Quản lý sách', icon: 'fas fa-book', path: 'admin-books' },
        { id: 'categories', name: 'Quản lý danh mục', icon: 'fas fa-tags', path: 'admin-categories' },
        { id: 'warehouse', name: 'Quản lý kho', icon: 'fas fa-warehouse', path: 'admin-warehouse' },
        { id: 'orders', name: 'Quản lý đơn hàng', icon: 'fas fa-shopping-cart', path: 'admin-orders' },
        { id: 'users', name: 'Quản lý người dùng', icon: 'fas fa-users', path: 'admin-users' },
        { id: 'reviews', name: 'Quản lý đánh giá', icon: 'fas fa-star', path: 'admin-reviews' },
        { id: 'reports', name: 'Báo cáo', icon: 'fas fa-chart-bar', path: 'admin-reports' }
    ];

    const handleMenuClick = (path) => {
        onNavigateTo(path);
    };

    const handleBackToHome = () => {
        onNavigateTo('home');
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* Sidebar */}
            <div
                className={`bg-dark text-white position-fixed ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
                style={{
                    width: sidebarOpen ? '250px' : '70px',
                    height: '100vh',
                    transition: 'width 0.3s ease',
                    zIndex: 1000,
                    paddingTop: '80px'
                }}
            >
                <div className="p-3">
                    {/* Toggle Button */}
                    <button
                        className="btn btn-outline-light btn-sm mb-4"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={{ width: '100%' }}
                    >
                        <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
                    </button>

                    {/* Back to Home */}
                    <button
                        className="btn btn-outline-light btn-sm mb-4"
                        onClick={handleBackToHome}
                        style={{ width: '100%' }}
                    >
                        <i className="fas fa-home me-2"></i>
                        {sidebarOpen && 'Về trang chủ'}
                    </button>

                    {/* Menu Items */}
                    <nav className="nav flex-column">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                className={`btn btn-link text-white text-start mb-2 ${currentPage === item.path ? 'active' : ''
                                    }`}
                                onClick={() => handleMenuClick(item.path)}
                                style={{
                                    textDecoration: 'none',
                                    border: 'none',
                                    backgroundColor: currentPage === item.path ? '#e74c3c' : 'transparent',
                                    borderRadius: '8px',
                                    padding: '12px 16px',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentPage !== item.path) {
                                        e.target.style.backgroundColor = '#34495e';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentPage !== item.path) {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <i className={`${item.icon} me-3`} style={{ width: '20px' }}></i>
                                {sidebarOpen && item.name}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div
                className="flex-grow-1"
                style={{
                    marginLeft: sidebarOpen ? '250px' : '70px',
                    transition: 'margin-left 0.3s ease',
                    paddingTop: '80px'
                }}
            >
                <div className="container-fluid p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
