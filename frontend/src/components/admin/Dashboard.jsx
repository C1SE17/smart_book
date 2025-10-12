import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import { RevenueChart, OrdersChart } from './charts';
import BestsellingBooks from './charts/BestsellingBooks';
import TopRatedBooks from './charts/TopRatedBooks';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalBooks: 0,
        totalUsers: 0,
        monthlyRevenue: [], // Đảm bảo có array rỗng
        monthlyOrders: [],  // Đảm bảo có array rỗng
        topSellingBooks: [],
        topRatedBooks: [], // Thêm mới
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
                const [ordersResponse, booksResponse, usersCountResponse, reviewsResponse] = await Promise.all([
                    apiService.getAllOrders({ suppressWarning: true }), // Admin context - suppress warning
                    apiService.getBooks({ limit: 1000 }), // Get all books for count
                    apiService.getTotalUsersCount(), // Get total users count
                    apiService.getAllReviews() // Thêm API lấy reviews
                ]);
                
                console.log('📊 [Dashboard] Orders response:', ordersResponse);
                console.log('📚 [Dashboard] Books response:', booksResponse);
                console.log('👥 [Dashboard] Users count response:', usersCountResponse);
                console.log('📝 [Dashboard] Reviews response:', reviewsResponse);

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

                    // Calculate monthly revenue and orders (last 6 months)
                    const monthlyRevenue = [];
                    const monthlyOrders = []; // Thêm dòng này
                    const currentDate = new Date();
                    
                    for (let i = 5; i >= 0; i--) {
                        const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                        const monthName = monthDate.toLocaleDateString('vi-VN', { month: 'short' });
                        
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
                        
                        monthlyOrders.push({ // Sử dụng monthlyOrders đã khai báo
                            month: monthName,
                            orders: monthOrders.length
                        });
                    }

                    // Calculate top selling books from orders
                    const bookSales = {};
                    orders.forEach(order => {
                        if (order.items && order.items.length > 0) {
                            order.items.forEach(item => {
                                const bookId = item.book_id;
                                const bookTitle = item.book_title || `Book ${bookId}`;
                                const quantity = item.quantity || 0;
                                const price = item.price_at_order || item.price || 0;
                                
                                if (!bookSales[bookId]) {
                                    bookSales[bookId] = {
                                        id: bookId,
                                        title: bookTitle,
                                        sales: 0,
                                        revenue: 0
                                    };
                                }
                                
                                bookSales[bookId].sales += quantity;
                                bookSales[bookId].revenue += quantity * price;
                            });
                        }
                    });

                    // Convert to array and sort by sales (lượt mua) - DESCENDING
                    const topSellingBooks = Object.values(bookSales)
                        .sort((a, b) => b.sales - a.sales) // Sắp xếp giảm dần theo số lượng bán
                        .slice(0, 5) // Top 5 books
                        .map((book, index) => ({
                            ...book,
                            rank: index + 1 // Thêm rank để hiển thị thứ hạng
                        }));

                    // Calculate top rated books (5 stars)
                    let topRatedBooks = [];
                    if (reviewsResponse.success && reviewsResponse.data) {
                        const reviews = reviewsResponse.data;
                        const bookRatings = {};
                        
                        // Group reviews by book_id
                        reviews.forEach(review => {
                            const bookId = review.book_id;
                            if (!bookRatings[bookId]) {
                                bookRatings[bookId] = {
                                    id: bookId,
                                    title: review.book_title || `Book ${bookId}`,
                                    ratings: [],
                                    fiveStarCount: 0,
                                    totalRatings: 0,
                                    averageRating: 0
                                };
                            }
                            
                            bookRatings[bookId].ratings.push(review.rating);
                            bookRatings[bookId].totalRatings++;
                            
                            if (review.rating === 5) {
                                bookRatings[bookId].fiveStarCount++;
                            }
                        });
                        
                        // Calculate average rating for each book
                        Object.values(bookRatings).forEach(book => {
                            const sum = book.ratings.reduce((a, b) => a + b, 0);
                            book.averageRating = (sum / book.totalRatings).toFixed(1);
                        });
                        
                        // Sort by five star count and get top 3
                        topRatedBooks = Object.values(bookRatings)
                            .sort((a, b) => b.fiveStarCount - a.fiveStarCount)
                            .slice(0, 3)
                            .map((book, index) => ({
                                ...book,
                                rank: index + 1
                            }));
                    }

                    // Trong useEffect, đảm bảo setStats luôn có đầy đủ data
                    setStats({
                        totalRevenue,
                        totalOrders: orders.length,
                        totalBooks: booksResponse.success ? (booksResponse.data?.length || 0) : 0,
                        totalUsers: usersCountResponse.success ? (usersCountResponse.data || 0) : 0,
                        monthlyRevenue: monthlyRevenue || [], // Đảm bảo không undefined
                        monthlyOrders: monthlyOrders || [],   // Đảm bảo không undefined
                        topSellingBooks,
                        topRatedBooks, // Thêm mới
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
                {/* Revenue Chart - Line Chart */}
                <div className="col-xl-8 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0">
                            <h5 className="fw-bold text-dark mb-0">
                                <i className="fas fa-chart-line me-2 text-primary"></i>
                                Doanh thu theo tháng
                            </h5>
                        </div>
                        <div className="card-body">
                            <RevenueChart data={stats.monthlyRevenue || []} height={300} />
                        </div>
                    </div>
                </div>

                {/* Orders Chart - Bar Chart */}
                <div className="col-xl-4 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0">
                            <h5 className="fw-bold text-dark mb-0">
                                <i className="fas fa-chart-bar me-2 text-success"></i>
                                Số đơn hàng theo tháng
                            </h5>
                        </div>
                        <div className="card-body">
                            <OrdersChart data={stats.monthlyOrders || []} height={300} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Selling Books and Top Rated Books */}
            <div className="row">
                {/* Top Selling Books */}
                <div className="col-xl-6 mb-4">
                    <BestsellingBooks data={stats.topSellingBooks || []} height={400} />
                </div>

                {/* Top Rated Books */}
                <div className="col-xl-6 mb-4">
                    <TopRatedBooks data={stats.topRatedBooks || []} height={400} />
                </div>
            </div>

            {/* Recent Orders - Full Width */}
            <div className="row">
                <div className="col-12 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <h5 className="fw-bold text-dark mb-0">
                                <i className="fas fa-clock me-2 text-info"></i>
                                Đơn hàng gần đây
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="border-0 py-3 text-center" style={{ width: '15%' }}>
                                                <span className="fw-bold text-dark">Mã đơn</span>
                                            </th>
                                            <th className="border-0 py-3" style={{ width: '20%' }}>
                                                <span className="fw-bold text-dark">Khách hàng</span>
                                            </th>
                                            <th className="border-0 py-3 text-center" style={{ width: '20%' }}>
                                                <span className="fw-bold text-dark">Giá trị</span>
                                            </th>
                                            <th className="border-0 py-3 text-center" style={{ width: '25%' }}>
                                                <span className="fw-bold text-dark">Trạng thái</span>
                                            </th>
                                            <th className="border-0 py-3 text-center" style={{ width: '20%' }}>
                                                <span className="fw-bold text-dark">Ngày tạo</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentOrders.map((order, index) => (
                                            <tr key={order.id} className={`border-0 ${index % 2 === 0 ? 'bg-light' : 'bg-white'}`}>
                                                <td className="py-3 text-center">
                                                    <span className="badge bg-primary bg-opacity-10 text-primary fw-bold px-3 py-2" style={{ fontSize: '14px' }}>
                                                        #{order.id.toString().padStart(6, '0')}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <div className="fw-semibold text-dark">{order.customer}</div>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <div className="fw-bold text-success fs-5">
                                                        {formatCurrency(order.amount)}
                                                    </div>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <span className={`badge px-3 py-2 fw-semibold ${
                                                        order.status === 'completed' ? 'bg-success text-white' :
                                                        order.status === 'shipped' ? 'bg-info text-white' :
                                                        order.status === 'pending' ? 'bg-warning text-dark' :
                                                        order.status === 'cancelled' ? 'bg-danger text-white' :
                                                        'bg-secondary text-white'
                                                    }`}>
                                                        {order.status === 'completed' ? 'Hoàn thành' :
                                                         order.status === 'shipped' ? 'Đã giao' :
                                                         order.status === 'pending' ? 'Chờ xử lý' :
                                                         order.status === 'cancelled' ? 'Đã hủy' :
                                                         order.status}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <div className="text-muted fw-semibold" style={{ fontSize: '15px' }}>
                                                        {new Date(order.date).toLocaleDateString('vi-VN')}
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: '13px' }}>
                                                        {new Date(order.date).toLocaleTimeString('vi-VN', { 
                                                            hour: '2-digit', 
                                                            minute: '2-digit' 
                                                        })}
                                                    </div>
                                                </td>
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
