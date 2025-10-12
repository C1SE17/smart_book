import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalBooks: 0,
        totalUsers: 0,
        monthlyRevenue: [],
        topSellingBooks: [],
        recentOrders: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch real data from API
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Check if user is admin
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                if (!user || user.role !== 'admin') {
                    setError('Bạn không có quyền truy cập dashboard admin');
                    setLoading(false);
                    return;
                }

                // Fetch all data in parallel
                console.log('🔄 [Dashboard] Fetching dashboard data...');
                const [ordersResponse, booksResponse, usersCountResponse] = await Promise.all([
                    apiService.getAllOrders({ suppressWarning: true }), // Admin context - suppress warning
                    apiService.getBooks({ limit: 1000 }), // Get all books for count
                    apiService.getTotalUsersCount() // Get total users count
                ]);
                
                console.log('📊 [Dashboard] Orders response:', ordersResponse);
                console.log('📚 [Dashboard] Books response:', booksResponse);
                console.log('👥 [Dashboard] Users count response:', usersCountResponse);

                if (ordersResponse.success) {
                    const orders = ordersResponse.data || [];
                    
                    // Calculate total revenue from orders
                    const totalRevenue = orders.reduce((sum, order) => {
                        return sum + (parseFloat(order.total_price) || 0);
                    }, 0);

                    // Get recent orders (last 5)
                    const recentOrders = orders
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .slice(0, 5)
                        .map(order => ({
                            id: order.order_id,
                            customer: order.user_name || `User ${order.user_id}`,
                            amount: parseFloat(order.total_price) || 0,
                            status: order.status,
                            date: order.created_at
                        }));

                    // Calculate monthly revenue (last 6 months)
                    const monthlyRevenue = [];
                    const currentDate = new Date();
                    for (let i = 5; i >= 0; i--) {
                        const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                        const monthName = monthDate.toLocaleDateString('vi-VN', { month: 'long' });
                        
                        const monthOrders = orders.filter(order => {
                            const orderDate = new Date(order.created_at);
                            return orderDate.getMonth() === monthDate.getMonth() && 
                                   orderDate.getFullYear() === monthDate.getFullYear();
                        });
                        
                        const monthRevenue = monthOrders.reduce((sum, order) => {
                            return sum + (parseFloat(order.total_price) || 0);
                        }, 0);
                        
                        monthlyRevenue.push({
                            month: monthName,
                            revenue: monthRevenue
                        });
                    }

                    // Mock top selling books (since we don't have sales data yet)
                    const topSellingBooks = [
                        { id: 1, title: 'Sách bán chạy nhất', sales: 0, revenue: 0 },
                        { id: 2, title: 'Sách phổ biến', sales: 0, revenue: 0 },
                        { id: 3, title: 'Sách được yêu thích', sales: 0, revenue: 0 }
                    ];

                    setStats({
                        totalRevenue,
                        totalOrders: orders.length,
                        totalBooks: booksResponse.success ? (booksResponse.data?.length || 0) : 0,
                        totalUsers: usersCountResponse.success ? (usersCountResponse.data || 0) : 0,
                        monthlyRevenue,
                        topSellingBooks,
                        recentOrders
                    });
                } else {
                    setError('Không thể tải dữ liệu dashboard');
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Có lỗi xảy ra khi tải dữ liệu dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();

        // Listen for new order events
        const handleNewOrder = () => {
            fetchDashboardData(); // Refresh data when new order is created
        };

        window.addEventListener('newOrderPlaced', handleNewOrder);
        
        return () => {
            window.removeEventListener('newOrderPlaced', handleNewOrder);
        };
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'completed': { class: 'bg-success', text: 'Hoàn thành' },
            'pending': { class: 'bg-warning', text: 'Chờ xử lý' },
            'shipped': { class: 'bg-info', text: 'Đã giao' },
            'processing': { class: 'bg-primary', text: 'Đang xử lý' }
        };

        const statusInfo = statusMap[status] || { class: 'bg-secondary', text: status };

        return (
            <span className={`badge ${statusInfo.class}`}>
                {statusInfo.text}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
                <button 
                    className="btn btn-outline-primary btn-sm ms-3"
                    onClick={() => window.location.reload()}
                >
                    <i className="fas fa-sync-alt me-1"></i>
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Tổng Quan</h2>
                <div className="d-flex align-items-center gap-3">
                    <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => window.location.reload()}
                        disabled={loading}
                    >
                        <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-1`}></i>
                        Làm mới
                    </button>
                    <div className="text-muted">
                        <i className="fas fa-calendar me-2"></i>
                        {new Date().toLocaleDateString('vi-VN')}
                    </div>
                </div>
            </div>

            {/* Info Message */}
            <div className="alert alert-info alert-dismissible fade show" role="alert">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Lưu ý:</strong> Khi khách hàng đặt hàng thành công từ trang chủ, đơn hàng sẽ xuất hiện trong dashboard này với trạng thái "Chờ xử lý". Dữ liệu sẽ tự động cập nhật khi có đơn hàng mới.
                <button 
                    type="button" 
                    className="btn-close" 
                    data-bs-dismiss="alert"
                ></button>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="fas fa-dollar-sign text-white fs-4"></i>
                                    </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <div className="text-muted small">Tổng doanh thu</div>
                                    <div className="fw-bold fs-4 text-dark">{formatCurrency(stats.totalRevenue)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="bg-success bg-gradient rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="fas fa-shopping-cart text-white fs-4"></i>
                                    </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <div className="text-muted small">Tổng đơn hàng</div>
                                    <div className="fw-bold fs-4 text-dark">{stats.totalOrders.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="bg-warning bg-gradient rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="fas fa-book text-white fs-4"></i>
                                    </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <div className="text-muted small">Tổng sách</div>
                                    <div className="fw-bold fs-4 text-dark">{stats.totalBooks.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    <div className="bg-info bg-gradient rounded-circle d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="fas fa-users text-white fs-4"></i>
                                    </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <div className="text-muted small">Tổng người dùng</div>
                                    <div className="fw-bold fs-4 text-dark">{stats.totalUsers.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Revenue Chart */}
                <div className="col-xl-8 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0">
                            <h5 className="fw-bold text-dark mb-0">Doanh thu theo tháng</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Tháng</th>
                                            <th className="text-end">Doanh thu</th>
                                            <th className="text-end">Tăng trưởng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.monthlyRevenue.map((item, index) => {
                                            const prevRevenue = index > 0 ? stats.monthlyRevenue[index - 1].revenue : 0;
                                            const growth = prevRevenue > 0 ? ((item.revenue - prevRevenue) / prevRevenue * 100) : 0;

                                            return (
                                                <tr key={index}>
                                                    <td className="fw-medium">{item.month}</td>
                                                    <td className="text-end fw-bold">{formatCurrency(item.revenue)}</td>
                                                    <td className="text-end">
                                                        <span className={`badge ${growth >= 0 ? 'bg-success' : 'bg-danger'}`}>
                                                            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Selling Books */}
                <div className="col-xl-4 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0">
                            <h5 className="fw-bold text-dark mb-0">Sách bán chạy</h5>
                        </div>
                        <div className="card-body">
                            <div className="list-group list-group-flush">
                                {stats.topSellingBooks.map((book, index) => (
                                    <div key={book.id} className="list-group-item border-0 px-0 py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-shrink-0">
                                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px' }}>
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <div className="fw-medium text-dark small" style={{ lineHeight: '1.3' }}>
                                                    {book.title}
                                                </div>
                                                <div className="text-muted small">
                                                    {book.sales} bản - {formatCurrency(book.revenue)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <h5 className="fw-bold text-dark mb-0">Đơn hàng gần đây</h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Mã đơn</th>
                                            <th>Khách hàng</th>
                                            <th className="text-end">Giá trị</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="fw-medium">#{order.id.toString().padStart(6, '0')}</td>
                                                <td>{order.customer}</td>
                                                <td className="text-end fw-bold">{formatCurrency(order.amount)}</td>
                                                <td>{getStatusBadge(order.status)}</td>
                                                <td className="text-muted">{new Date(order.date).toLocaleDateString('vi-VN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
