import React, { useEffect, useMemo, useState } from 'react';
import apiService from '../../services/api';
import { RevenueChart, OrdersChart } from './charts';
import TopRatedBooks from './charts/TopRatedBooks';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalBooks: 0,
        totalUsers: 0,
        monthlyRevenue: [], // Đảm bảo có array rỗng
        monthlyOrders: [],  // Đảm bảo có array rỗng
        topRatedBooks: [], // Thêm mới
        recentOrders: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateFilter, setDateFilter] = useState('month'); // 'day', 'month', 'year'
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().substring(0, 7) + '-01'); // YYYY-MM-01 format (first day of current month)

    const currencyFormatter = useMemo(() => new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }), [locale]);

    const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

    const formatCurrency = (amount) => currencyFormatter.format(Number(amount || 0));
    const formatNumber = (value) => numberFormatter.format(Number(value || 0));

    // Fetch real data from API
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Check if user is admin
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                if (!user || user.role !== 'admin') {
                    setError(t('admin.dashboard.errors.unauthorized'));
                    setLoading(false);
                    return;
                }

                // Fetch all data in parallel
                console.log('Fetching dashboard data...');
                const [ordersResult, booksResult, usersResult, reviewsResult] = await Promise.allSettled([
                    apiService.getAllOrders({ suppressWarning: true }),
                    apiService.getBooks({ limit: 1000 }),
                    apiService.getTotalUsersCount(),
                    apiService.getAllReviews()
                ]);

                const normalizeResult = (result, label) => {
                    if (result.status === 'fulfilled') {
                        return result.value;
                    }
                    console.error(`API ${label} rejected:`, result.reason);
                    return { success: false, data: null, message: result.reason?.message || t('admin.dashboard.errors.apiRequest') };
                };

                const ordersResponse = normalizeResult(ordersResult, 'orders');
                const booksResponse = normalizeResult(booksResult, 'books');
                const usersCountResponse = normalizeResult(usersResult, 'users count');
                const reviewsResponse = normalizeResult(reviewsResult, 'reviews');
                
                console.log('Orders response:', ordersResponse);
                console.log('Books response:', booksResponse);
                console.log('Users count response:', usersCountResponse);
                console.log('Reviews response:', reviewsResponse);

                if (ordersResponse?.success) {
                    const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];
                    
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

                    // Calculate revenue and orders based on date filter
                    let chartData = [];
                    let chartOrders = [];
                    
                    if (dateFilter === 'day') {
                        // Daily data for selected month - only up to today
                        const selectedMonth = new Date(selectedDate);
                        const year = selectedMonth.getFullYear();
                        const month = selectedMonth.getMonth();
                        const today = new Date();
                        
                        // If selected month is current month, only show up to today
                        // If selected month is in the past, show all days in that month
                        let maxDay;
                        if (year === today.getFullYear() && month === today.getMonth()) {
                            maxDay = today.getDate(); // Only up to today
                        } else {
                            maxDay = new Date(year, month + 1, 0).getDate(); // All days in month
                        }
                        
                        for (let day = 1; day <= maxDay; day++) {
                            const dayDate = new Date(year, month, day);
                            const dayOrders = orders.filter(order => {
                                const orderDate = new Date(order.created_at);
                                return orderDate.getDate() === day && 
                                       orderDate.getMonth() === month && 
                                       orderDate.getFullYear() === year;
                            });
                            
                            const dayRevenue = dayOrders.reduce((sum, order) => {
                                return sum + (parseFloat(order.total_price) || 0);
                            }, 0);
                            
                            chartData.push({
                                month: `${day}/${month + 1}`,
                                revenue: dayRevenue
                            });
                            
                            chartOrders.push({
                                month: `${day}/${month + 1}`,
                                orders: dayOrders.length
                            });
                        }
                    } else if (dateFilter === 'month') {
                        // Monthly data (last 6 months)
                        const currentDate = new Date();
                        
                        for (let i = 5; i >= 0; i--) {
                            const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                            const monthName = monthDate.toLocaleDateString(locale, { month: 'short' });
                            
                            const monthOrders = orders.filter(order => {
                                const orderDate = new Date(order.created_at);
                                return orderDate.getMonth() === monthDate.getMonth() && 
                                       orderDate.getFullYear() === monthDate.getFullYear();
                            });
                            
                            const monthRevenue = monthOrders.reduce((sum, order) => {
                                return sum + (parseFloat(order.total_price) || 0);
                            }, 0);
                            
                            chartData.push({
                                month: monthName,
                                revenue: monthRevenue
                            });
                            
                            chartOrders.push({
                                month: monthName,
                                orders: monthOrders.length
                            });
                        }
                    } else if (dateFilter === 'year') {
                        // Yearly data (last 5 years)
                        const currentDate = new Date();
                        
                        for (let i = 4; i >= 0; i--) {
                            const year = currentDate.getFullYear() - i;
                            const yearOrders = orders.filter(order => {
                                const orderDate = new Date(order.created_at);
                                return orderDate.getFullYear() === year;
                            });
                            
                            const yearRevenue = yearOrders.reduce((sum, order) => {
                                return sum + (parseFloat(order.total_price) || 0);
                            }, 0);
                            
                            chartData.push({
                                month: year.toString(),
                                revenue: yearRevenue
                            });
                            
                            chartOrders.push({
                                month: year.toString(),
                                orders: yearOrders.length
                            });
                        }
                    }

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
                        totalBooks: booksResponse?.success ? (Array.isArray(booksResponse.data) ? booksResponse.data.length : (booksResponse.total || 0)) : 0,
                        totalUsers: usersCountResponse?.success ? Number(usersCountResponse.data || 0) : 0,
                        monthlyRevenue: chartData || [], // Sử dụng chartData dựa trên filter
                        monthlyOrders: chartOrders || [],   // Sử dụng chartOrders dựa trên filter
                        topRatedBooks, // Thêm mới
                        recentOrders
                    });
                } else {
                    const message = ordersResponse?.message || t('admin.dashboard.errors.fetchFailed');
                    console.warn('Orders API request failed:', ordersResponse);
                    setError(message);
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(t('admin.dashboard.errors.generic'));
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
    }, [dateFilter, selectedDate, locale, t]); // Refetch khi date filter, selected date hoặc ngôn ngữ thay đổi

    const statusClasses = {
        completed: 'bg-success text-white',
        pending: 'bg-warning text-dark',
        shipped: 'bg-info text-white',
        processing: 'bg-primary text-white',
        cancelled: 'bg-danger text-white'
    };

    const getStatusBadge = (status, { padded = false } = {}) => {
        const classNames = statusClasses[status] || 'bg-secondary text-white';
        const padding = padded ? 'px-3 py-2 fw-semibold' : '';

        return (
            <span className={`badge ${padding} ${classNames}`.trim()}>
                {t(`admin.dashboard.statuses.${status}`, { defaultValue: status })}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('admin.dashboard.loading')}</span>
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
                    {t('admin.dashboard.actions.retry')}
                </button>
            </div>
        );
    }

    const periodLabel = t(`admin.dashboard.charts.periods.${dateFilter}`);

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">{t('admin.dashboard.title')}</h2>
                <div className="d-flex align-items-center gap-3">
                    <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => window.location.reload()}
                        disabled={loading}
                    >
                        <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-1`}></i>
                        {t('admin.dashboard.actions.refresh')}
                    </button>
                    <div className="text-muted">
                        <i className="fas fa-calendar me-2"></i>
                        {new Date().toLocaleDateString(locale)}
                    </div>
                </div>
            </div>

            {/* Info Message */}
            <div className="alert alert-info alert-dismissible fade show" role="alert">
                <i className="fas fa-info-circle me-2"></i>
                <strong>{t('admin.dashboard.alert.title')}</strong> {t('admin.dashboard.alert.message', { status: t('admin.dashboard.statuses.pending') })}
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
                                    <div className="text-muted small">{t('admin.dashboard.stats.totalRevenue')}</div>
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
                                    <div className="text-muted small">{t('admin.dashboard.stats.totalOrders')}</div>
                                    <div className="fw-bold fs-4 text-dark">{formatNumber(stats.totalOrders)}</div>
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
                                    <div className="text-muted small">{t('admin.dashboard.stats.totalBooks')}</div>
                                    <div className="fw-bold fs-4 text-dark">{formatNumber(stats.totalBooks)}</div>
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
                                    <div className="text-muted small">{t('admin.dashboard.stats.totalUsers')}</div>
                                    <div className="fw-bold fs-4 text-dark">{formatNumber(stats.totalUsers)}</div>
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
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold text-dark mb-0">
                                    <i className="fas fa-chart-line me-2 text-primary"></i>
                                    {t('admin.dashboard.charts.revenueTitle', { period: periodLabel })}
                                </h5>
                                <div className="d-flex gap-2">
                                    <select 
                                        className="form-select form-select-sm" 
                                        style={{ width: 'auto' }}
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                    >
                                        <option value="day">{t('admin.dashboard.charts.range.day')}</option>
                                        <option value="month">{t('admin.dashboard.charts.range.month')}</option>
                                        <option value="year">{t('admin.dashboard.charts.range.year')}</option>
                                    </select>
                                    {dateFilter === 'day' && (
                                        <input 
                                            type="month" 
                                            className="form-control form-control-sm" 
                                            style={{ width: 'auto' }}
                                            value={selectedDate.substring(0, 7)}
                                            onChange={(e) => setSelectedDate(e.target.value + '-01')}
                                            max={new Date().toISOString().substring(0, 7)} // Không cho chọn tháng tương lai
                                        />
                                    )}
                                </div>
                            </div>
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
                                {t('admin.dashboard.charts.ordersTitle', { period: periodLabel })}
                            </h5>
                        </div>
                        <div className="card-body">
                            <OrdersChart data={stats.monthlyOrders || []} height={300} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Rated Books */}
            <div className="row">
                <div className="col-12 mb-4">
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
                                {t('admin.dashboard.table.title')}
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="border-0 py-3 text-center" style={{ width: '15%' }}>
                                                <span className="fw-bold text-dark">{t('admin.dashboard.table.columns.orderId')}</span>
                                            </th>
                                            <th className="border-0 py-3" style={{ width: '20%' }}>
                                                <span className="fw-bold text-dark">{t('admin.dashboard.table.columns.customer')}</span>
                                            </th>
                                            <th className="border-0 py-3 text-center" style={{ width: '20%' }}>
                                                <span className="fw-bold text-dark">{t('admin.dashboard.table.columns.amount')}</span>
                                            </th>
                                            <th className="border-0 py-3 text-center" style={{ width: '25%' }}>
                                                <span className="fw-bold text-dark">{t('admin.dashboard.table.columns.status')}</span>
                                            </th>
                                            <th className="border-0 py-3 text-center" style={{ width: '20%' }}>
                                                <span className="fw-bold text-dark">{t('admin.dashboard.table.columns.createdAt')}</span>
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
                                                    {getStatusBadge(order.status, { padded: true })}
                                                </td>
                                                <td className="py-3 text-center">
                                                    <div className="text-muted fw-semibold" style={{ fontSize: '15px' }}>
                                                        {new Date(order.date).toLocaleDateString(locale)}
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: '13px' }}>
                                                        {new Date(order.date).toLocaleTimeString(locale, { 
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
