import React, { useState, useEffect } from 'react';

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

    // Mock data - trong thực tế sẽ fetch từ API
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
                setStats({
                    totalRevenue: 125000000,
                    totalOrders: 1247,
                    totalBooks: 342,
                    totalUsers: 892,
                    monthlyRevenue: [
                        { month: 'Tháng 1', revenue: 15000000 },
                        { month: 'Tháng 2', revenue: 18000000 },
                        { month: 'Tháng 3', revenue: 22000000 },
                        { month: 'Tháng 4', revenue: 19000000 },
                        { month: 'Tháng 5', revenue: 25000000 },
                        { month: 'Tháng 6', revenue: 26000000 }
                    ],
                    topSellingBooks: [
                        { id: 1, title: 'Thanh Gươm Diệt Quỷ - Tập 1', sales: 156, revenue: 127140000 },
                        { id: 2, title: 'Harry Potter và Hòn Đá Phù Thủy', sales: 134, revenue: 42880000 },
                        { id: 3, title: 'One Piece - Tập 1', sales: 98, revenue: 19600000 },
                        { id: 4, title: 'Attack on Titan - Tập 1', sales: 87, revenue: 19140000 },
                        { id: 5, title: 'Norwegian Wood', sales: 76, revenue: 26600000 }
                    ],
                    recentOrders: [
                        { id: 1, customer: 'Nguyễn Văn A', amount: 450000, status: 'completed', date: '2024-01-15' },
                        { id: 2, customer: 'Trần Thị B', amount: 320000, status: 'pending', date: '2024-01-15' },
                        { id: 3, customer: 'Lê Văn C', amount: 680000, status: 'shipped', date: '2024-01-14' },
                        { id: 4, customer: 'Phạm Thị D', amount: 250000, status: 'completed', date: '2024-01-14' },
                        { id: 5, customer: 'Hoàng Văn E', amount: 890000, status: 'processing', date: '2024-01-13' }
                    ]
                });
                setLoading(false);
            }, 1000);
        };

        fetchDashboardData();
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

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Dashboard Tổng Quan</h2>
                <div className="text-muted">
                    <i className="fas fa-calendar me-2"></i>
                    {new Date().toLocaleDateString('vi-VN')}
                </div>
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
