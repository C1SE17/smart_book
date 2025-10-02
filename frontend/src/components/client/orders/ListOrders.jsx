import React, { useState, useEffect } from 'react';

const ListOrders = ({ onNavigateTo }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, confirmed, delivered, cancelled
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetail, setShowOrderDetail] = useState(false);

    // Load orders from localStorage
    useEffect(() => {
        const loadOrders = () => {
            try {
                let savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');

                // If no orders, create some sample orders for demo
                if (savedOrders.length === 0) {
                    const sampleOrders = [
                        // PENDING - Chờ xác nhận
                        {
                            id: '1759310269978',
                            items: [
                                {
                                    book_id: '1',
                                    title: 'Thanh Gươm Diệt Quỷ - Tập 1',
                                    price: 150000,
                                    cover_image: '/images/book1.jpg',
                                    quantity: 1,
                                    added_at: new Date().toISOString()
                                },
                                {
                                    book_id: '2',
                                    title: 'Doraemon: Nobita và Cuộc Chiến Vũ Trụ',
                                    price: 85000,
                                    cover_image: '/images/book2.jpg',
                                    quantity: 1,
                                    added_at: new Date().toISOString()
                                }
                            ],
                            shippingInfo: {
                                fullName: 'Nguyễn Lê Anh Sang',
                                phone: '0934710294',
                                email: 'sang@example.com',
                                address: '16, dsa, dsa, 12',
                                city: 'TP.HCM',
                                district: 'Quận 1',
                                ward: 'Phường Bến Nghé'
                            },
                            paymentMethod: 'cod',
                            total: 235000,
                            status: 'pending',
                            createdAt: new Date().toISOString()
                        },
                        {
                            id: '1759310269979',
                            items: [
                                {
                                    book_id: '3',
                                    title: 'Harry Potter và Hòn Đá Phù Thủy',
                                    price: 220000,
                                    cover_image: '/images/book3.jpg',
                                    quantity: 1,
                                    added_at: new Date().toISOString()
                                }
                            ],
                            shippingInfo: {
                                fullName: 'Trần Văn Minh',
                                phone: '0123456789',
                                email: 'minh@example.com',
                                address: '123 Đường Lê Lợi',
                                city: 'Hà Nội',
                                district: 'Quận Ba Đình',
                                ward: 'Phường Phúc Xá'
                            },
                            paymentMethod: 'cod',
                            total: 220000,
                            status: 'pending',
                            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
                        },
                        // CONFIRMED - Đã xác nhận
                        {
                            id: '1759310269980',
                            items: [
                                {
                                    book_id: '4',
                                    title: 'One Piece - Volume 100',
                                    price: 120000,
                                    cover_image: '/images/book1.jpg',
                                    quantity: 2,
                                    added_at: new Date().toISOString()
                                }
                            ],
                            shippingInfo: {
                                fullName: 'Nguyễn Văn A',
                                phone: '0123456789',
                                email: 'test@example.com',
                                address: '123 Đường ABC',
                                city: 'Hà Nội',
                                district: 'Quận Ba Đình',
                                ward: 'Phường Phúc Xá'
                            },
                            paymentMethod: 'cod',
                            total: 240000,
                            status: 'confirmed',
                            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
                        },
                        // SHIPPED - Đang giao hàng
                        {
                            id: '1759310269981',
                            items: [
                                {
                                    book_id: '5',
                                    title: 'Attack on Titan - Final Season',
                                    price: 180000,
                                    cover_image: '/images/book2.jpg',
                                    quantity: 1,
                                    added_at: new Date().toISOString()
                                }
                            ],
                            shippingInfo: {
                                fullName: 'Trần Thị B',
                                phone: '0987654321',
                                email: 'test2@example.com',
                                address: '456 Đường XYZ',
                                city: 'Đà Nẵng',
                                district: 'Quận Hải Châu',
                                ward: 'Phường Thạch Thang'
                            },
                            paymentMethod: 'cod',
                            total: 180000,
                            status: 'shipped',
                            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
                        },
                        {
                            id: '1759310269982',
                            items: [
                                {
                                    book_id: '6',
                                    title: 'Conan - Vụ Án Nữ Hoàng 450',
                                    price: 155000,
                                    cover_image: '/images/book4.jpg',
                                    quantity: 1,
                                    added_at: new Date().toISOString()
                                },
                                {
                                    book_id: '7',
                                    title: 'Dragon Ball Super - Tập 20',
                                    price: 95000,
                                    cover_image: '/images/book1.jpg',
                                    quantity: 1,
                                    added_at: new Date().toISOString()
                                }
                            ],
                            shippingInfo: {
                                fullName: 'Lê Thị Hương',
                                phone: '0369852147',
                                email: 'huong@example.com',
                                address: '789 Đường Nguyễn Huệ',
                                city: 'Cần Thơ',
                                district: 'Quận Ninh Kiều',
                                ward: 'Phường Cái Khế'
                            },
                            paymentMethod: 'cod',
                            total: 250000,
                            status: 'shipped',
                            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
                        },
                        // DELIVERED - Đã giao hàng
                        {
                            id: '1759310269983',
                            items: [
                                {
                                    book_id: '8',
                                    title: 'Naruto - Tập 72',
                                    price: 110000,
                                    cover_image: '/images/book3.jpg',
                                    quantity: 1,
                                    added_at: new Date().toISOString()
                                }
                            ],
                            shippingInfo: {
                                fullName: 'Phạm Văn Đức',
                                phone: '0741235698',
                                email: 'duc@example.com',
                                address: '321 Đường Trần Hưng Đạo',
                                city: 'Hải Phòng',
                                district: 'Quận Hồng Bàng',
                                ward: 'Phường Quán Toan'
                            },
                            paymentMethod: 'cod',
                            total: 110000,
                            status: 'delivered',
                            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
                        },
                        {
                            id: '1759310269984',
                            items: [
                                {
                                    book_id: '9',
                                    title: 'Bleach - Tập 74',
                                    price: 130000,
                                    cover_image: '/images/book2.jpg',
                                    quantity: 2,
                                    added_at: new Date().toISOString()
                                },
                                {
                                    book_id: '10',
                                    title: 'Fairy Tail - Tập 63',
                                    price: 105000,
                                    cover_image: '/images/book4.jpg',
                                    quantity: 1,
                                    added_at: new Date().toISOString()
                                }
                            ],
                            shippingInfo: {
                                fullName: 'Hoàng Thị Lan',
                                phone: '0852147369',
                                email: 'lan@example.com',
                                address: '654 Đường Lý Tự Trọng',
                                city: 'Vũng Tàu',
                                district: 'Quận 1',
                                ward: 'Phường Thắng Tam'
                            },
                            paymentMethod: 'cod',
                            total: 365000,
                            status: 'delivered',
                            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
                        },
                        // CANCELLED - Đã hủy
                        {
                            id: '1759310269985',
                            items: [
                                {
                                    book_id: '11',
                                    title: 'Tokyo Ghoul - Tập 14',
                                    price: 140000,
                                    cover_image: '/images/book1.jpg',
                                    quantity: 1,
                                    added_at: new Date().toISOString()
                                }
                            ],
                            shippingInfo: {
                                fullName: 'Vũ Văn Tuấn',
                                phone: '0963258741',
                                email: 'tuan@example.com',
                                address: '987 Đường Võ Văn Tần',
                                city: 'TP.HCM',
                                district: 'Quận 3',
                                ward: 'Phường Võ Thị Sáu'
                            },
                            paymentMethod: 'cod',
                            total: 140000,
                            status: 'cancelled',
                            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
                        },
                        {
                            id: '1759310269986',
                            items: [
                                {
                                    book_id: '12',
                                    title: 'Death Note - Tập 12',
                                    price: 125000,
                                    cover_image: '/images/book3.jpg',
                                    quantity: 1,
                                    added_at: new Date().toISOString()
                                },
                                {
                                    book_id: '13',
                                    title: 'Fullmetal Alchemist - Tập 27',
                                    price: 160000,
                                    cover_image: '/images/book4.jpg',
                                    quantity: 1,
                                    added_at: new Date().toISOString()
                                }
                            ],
                            shippingInfo: {
                                fullName: 'Đặng Thị Mai',
                                phone: '0321456789',
                                email: 'mai@example.com',
                                address: '147 Đường Nguyễn Thị Minh Khai',
                                city: 'Đà Nẵng',
                                district: 'Quận Thanh Khê',
                                ward: 'Phường An Khê'
                            },
                            paymentMethod: 'cod',
                            total: 285000,
                            status: 'cancelled',
                            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
                        }
                    ];
                    savedOrders = sampleOrders;
                    localStorage.setItem('orders', JSON.stringify(sampleOrders));
                }

                setOrders(savedOrders.reverse()); // Show newest first
            } catch (error) {
                console.error('Error loading orders:', error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    // Filter orders based on status
    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order?.status === filter;
    });


    // Get status badge class
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-warning';
            case 'confirmed':
                return 'bg-info';
            case 'shipped':
                return 'bg-secondary';
            case 'delivered':
                return 'bg-success';
            case 'cancelled':
                return 'bg-danger';
            default:
                return 'bg-secondary';
        }
    };

    // Get status text
    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ xác nhận';
            case 'confirmed':
                return 'Đã xác nhận';
            case 'shipped':
                return 'Đang giao hàng';
            case 'delivered':
                return 'Đã giao hàng';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate total items
    const calculateTotalItems = (items) => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    // Handle cancel order
    const handleCancelOrder = (orderId) => {
        if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
            const updatedOrders = orders.map(order =>
                order.id === orderId
                    ? { ...order, status: 'cancelled' }
                    : order
            );
            setOrders(updatedOrders);
            localStorage.setItem('orders', JSON.stringify(updatedOrders));

            if (window.showToast) {
                window.showToast('Đã hủy đơn hàng thành công!', 'success');
            }
        }
    };

    // Handle view order details
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetail(true);
    };

    // Close order detail modal
    const handleCloseDetail = () => {
        setShowOrderDetail(false);
        setSelectedOrder(null);
    };

    // Generate tracking info based on order status
    const getTrackingInfo = (order) => {
        const now = new Date();
        const orderDate = new Date(order?.createdAt || now);

        switch (order?.status) {
            case 'pending':
                return {
                    status: 'Chờ xác nhận',
                    message: 'Đơn hàng đang chờ xác nhận từ cửa hàng',
                    estimatedDelivery: null,
                    currentLocation: null
                };
            case 'confirmed':
                const estimatedDate = new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000); // +2 days
                return {
                    status: 'Đã xác nhận',
                    message: 'Đơn hàng đã được xác nhận và đang chuẩn bị',
                    estimatedDelivery: estimatedDate.toLocaleDateString('vi-VN'),
                    currentLocation: 'Kho hàng - Đang đóng gói'
                };
            case 'shipped':
                const deliveryDate = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 days
                return {
                    status: 'Đang giao hàng',
                    message: 'Đơn hàng đang được vận chuyển',
                    estimatedDelivery: deliveryDate.toLocaleDateString('vi-VN'),
                    currentLocation: 'Trên đường giao hàng - Dự kiến giao trong 1-2 ngày'
                };
            case 'delivered':
                return {
                    status: 'Đã giao hàng',
                    message: 'Đơn hàng đã được giao thành công',
                    estimatedDelivery: null,
                    currentLocation: 'Đã giao đến địa chỉ nhận hàng'
                };
            case 'cancelled':
                return {
                    status: 'Đã hủy',
                    message: 'Đơn hàng đã bị hủy',
                    estimatedDelivery: null,
                    currentLocation: null
                };
            default:
                return {
                    status: 'Không xác định',
                    message: 'Trạng thái đơn hàng không rõ',
                    estimatedDelivery: null,
                    currentLocation: null
                };
        }
    };

    if (loading) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Đang tải đơn hàng...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', minHeight: '100vh' }}>
            {/* Header Section */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between">
                        <div>
                            <h1 className="text-white mb-2" style={{ fontSize: '2.5rem', fontWeight: '700', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                                <i className="bi bi-bag-check me-3"></i>
                                Đơn hàng của tôi
                            </h1>
                            <p className="text-white-50 mb-0" style={{ fontSize: '1.1rem' }}>
                                Quản lý và theo dõi tất cả đơn hàng của bạn
                            </p>
                        </div>
                        <button
                            className="btn btn-light btn-lg px-4 py-3"
                            onClick={() => onNavigateTo('home')}
                            style={{
                                borderRadius: '50px',
                                fontWeight: '600',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                            }}
                        >
                            <i className="bi bi-house me-2"></i>
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Buttons */}
            <div className="row mb-5">
                <div className="col-12">
                    <div className="card shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <div className="card-body p-0">
                            <div className="btn-group w-100" role="group" style={{ borderRadius: '0' }}>
                                <button
                                    type="button"
                                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-light'} flex-fill py-3`}
                                    onClick={() => setFilter('all')}
                                    style={{
                                        borderRadius: '0',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        border: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="bi bi-grid-3x3-gap me-2"></i>
                                    Tất cả ({orders.length})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-light'} flex-fill py-3`}
                                    onClick={() => setFilter('pending')}
                                    style={{
                                        borderRadius: '0',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        border: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="bi bi-clock me-2"></i>
                                    Chờ xác nhận ({orders.filter(o => o.status === 'pending').length})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${filter === 'confirmed' ? 'btn-info' : 'btn-light'} flex-fill py-3`}
                                    onClick={() => setFilter('confirmed')}
                                    style={{
                                        borderRadius: '0',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        border: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="bi bi-check-circle me-2"></i>
                                    Đã xác nhận ({orders.filter(o => o.status === 'confirmed').length})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${filter === 'shipped' ? 'btn-secondary' : 'btn-light'} flex-fill py-3`}
                                    onClick={() => setFilter('shipped')}
                                    style={{
                                        borderRadius: '0',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        border: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="bi bi-truck me-2"></i>
                                    Đang giao hàng ({orders.filter(o => o.status === 'shipped').length})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${filter === 'delivered' ? 'btn-success' : 'btn-light'} flex-fill py-3`}
                                    onClick={() => setFilter('delivered')}
                                    style={{
                                        borderRadius: '0',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        border: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="bi bi-check2-circle me-2"></i>
                                    Đã giao hàng ({orders.filter(o => o.status === 'delivered').length})
                                </button>
                                <button
                                    type="button"
                                    className={`btn ${filter === 'cancelled' ? 'btn-danger' : 'btn-light'} flex-fill py-3`}
                                    onClick={() => setFilter('cancelled')}
                                    style={{
                                        borderRadius: '0',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        border: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <i className="bi bi-x-circle me-2"></i>
                                    Đã hủy ({orders.filter(o => o.status === 'cancelled').length})
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-lg border-0" style={{ borderRadius: '20px' }}>
                            <div className="card-body text-center py-5">
                                <div className="mb-4">
                                    <i className="bi bi-bag-x" style={{
                                        fontSize: '5rem',
                                        color: '#2c3e50',
                                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                                    }}></i>
                                </div>
                                <h3 className="mb-3" style={{ color: '#2c3e50', fontWeight: '600' }}>
                                    {filter === 'all' ? 'Chưa có đơn hàng nào' : 'Không có đơn hàng nào'}
                                </h3>
                                <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
                                    {filter === 'all'
                                        ? 'Bạn chưa đặt đơn hàng nào. Hãy mua sắm để tạo đơn hàng đầu tiên!'
                                        : `Không có đơn hàng nào ở trạng thái "${getStatusText(filter)}"`
                                    }
                                </p>
                                <button
                                    className="btn btn-primary btn-lg px-5 py-3"
                                    onClick={() => onNavigateTo('home')}
                                    style={{
                                        borderRadius: '50px',
                                        fontWeight: '600',
                                        boxShadow: '0 8px 25px rgba(44, 62, 80, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 12px 35px rgba(44, 62, 80, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 8px 25px rgba(44, 62, 80, 0.3)';
                                    }}
                                >
                                    <i className="bi bi-house me-2"></i>
                                    Mua sắm ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="col-12 mb-4">
                            <div className="card shadow-lg border-0" style={{
                                borderRadius: '20px',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div className="card-header" style={{
                                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                                    border: 'none',
                                    padding: '1.5rem'
                                }}>
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <h5 className="mb-1 text-white" style={{ fontWeight: '700' }}>
                                                <i className="bi bi-receipt me-2"></i>
                                                Đơn hàng #{order.id}
                                            </h5>
                                            <small className="text-white-50" style={{ fontSize: '0.9rem' }}>
                                                <i className="bi bi-calendar3 me-1"></i>
                                                Đặt ngày: {formatDate(order?.createdAt || new Date())}
                                            </small>
                                        </div>
                                        <div className="col-md-6 text-md-end">
                                            <span className={`badge ${getStatusBadgeClass(order?.status)} fs-6 px-3 py-2`} style={{
                                                borderRadius: '25px',
                                                fontWeight: '600',
                                                textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                                            }}>
                                                {getStatusText(order?.status)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body">
                                    {/* Order Items */}
                                    <div className="mb-3">
                                        <h6 className="mb-2">Sản phẩm đã đặt:</h6>
                                        {(order?.items || []).map((item, index) => (
                                            <div key={index} className="d-flex align-items-center mb-2">
                                                <img
                                                    src={item.cover_image || '/images/book1.jpg'}
                                                    alt={item.title}
                                                    className="rounded me-3"
                                                    style={{ width: '40px', height: '50px', objectFit: 'cover' }}
                                                />
                                                <div className="flex-grow-1">
                                                    <div className="fw-medium">{item.title}</div>
                                                    <small className="text-muted">
                                                        Số lượng: {item.quantity} | Giá: {item.price.toLocaleString()} VNĐ
                                                    </small>
                                                </div>
                                                <div className="text-end">
                                                    <div className="fw-bold">
                                                        {(item.price * item.quantity).toLocaleString()} VNĐ
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping Info */}
                                    <div className="mb-3">
                                        <h6 className="mb-2">Thông tin giao hàng:</h6>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <small className="text-muted d-block">Người nhận:</small>
                                                <div className="fw-medium">{order.shippingInfo?.fullName || 'Chưa cập nhật'}</div>
                                            </div>
                                            <div className="col-md-6">
                                                <small className="text-muted d-block">Số điện thoại:</small>
                                                <div className="fw-medium">{order.shippingInfo?.phone || 'Chưa cập nhật'}</div>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <small className="text-muted d-block">Địa chỉ:</small>
                                            <div className="fw-medium">
                                                {order.shippingInfo ? 
                                                    `${order.shippingInfo.address || ''}, ${order.shippingInfo.ward || ''}, ${order.shippingInfo.district || ''}, ${order.shippingInfo.city || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '') || 'Chưa cập nhật'
                                                    : 'Chưa cập nhật'
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="row align-items-center">
                                        <div className="col-md-6">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-box me-2"></i>
                                                <span className="text-muted">
                                                    {calculateTotalItems(order?.items || [])} sản phẩm
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 text-md-end">
                                            <div className="d-flex align-items-center justify-content-md-end">
                                                <span className="text-muted me-2">Tổng cộng:</span>
                                                <span className="h5 mb-0 text-success">
                                                    {(order?.total || 0).toLocaleString()} VNĐ
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="card-footer" style={{
                                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                    border: 'none',
                                    padding: '1.5rem'
                                }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <small className="text-muted" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                                                <i className="bi bi-credit-card me-1"></i>
                                                Thanh toán: {order?.paymentMethod === 'cod' ? 'Khi nhận hàng' : 'Online'}
                                            </small>
                                        </div>
                                        <div>
                                            {order?.status === 'pending' && (
                                                <button
                                                    className="btn btn-outline-danger btn-sm me-3 px-4 py-2"
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    style={{
                                                        borderRadius: '25px',
                                                        fontWeight: '600',
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = 'translateY(-2px)';
                                                        e.target.style.boxShadow = '0 5px 15px rgba(220, 53, 69, 0.3)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'translateY(0)';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                >
                                                    <i className="bi bi-x-circle me-1"></i>
                                                    Hủy đơn
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-primary btn-sm px-4 py-2"
                                                onClick={() => handleViewDetails(order)}
                                                style={{
                                                    borderRadius: '25px',
                                                    fontWeight: '600',
                                                    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                                                    border: 'none',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = 'translateY(-2px)';
                                                    e.target.style.boxShadow = '0 8px 25px rgba(44, 62, 80, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            >
                                                <i className="bi bi-eye me-1"></i>
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Order Detail Modal */}
            {showOrderDetail && selectedOrder && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            <div className="modal-header" style={{
                                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                                border: 'none',
                                padding: '2rem'
                            }}>
                                <h4 className="modal-title text-white mb-0" style={{ fontWeight: '700' }}>
                                    <i className="bi bi-receipt me-3"></i>
                                    Chi tiết đơn hàng #{selectedOrder.id}
                                </h4>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={handleCloseDetail}
                                    style={{ fontSize: '1.2rem' }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Order Status & Tracking */}
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h6 className="mb-0">
                                            <i className="bi bi-truck me-2"></i>
                                            Trạng thái đơn hàng
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        {(() => {
                                            const tracking = getTrackingInfo(selectedOrder);
                                            return (
                                                <div>
                                                    <div className="d-flex align-items-center mb-3">
                                                        <span className={`badge fs-6 ${getStatusBadgeClass(selectedOrder?.status)}`}>
                                                            {tracking.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-muted mb-2">{tracking.message}</p>

                                                    {tracking.estimatedDelivery && (
                                                        <div className="alert alert-info mb-2">
                                                            <i className="bi bi-calendar-check me-2"></i>
                                                            <strong>Dự kiến giao hàng:</strong> {tracking.estimatedDelivery}
                                                        </div>
                                                    )}

                                                    {tracking.currentLocation && (
                                                        <div className="alert alert-success mb-0">
                                                            <i className="bi bi-geo-alt me-2"></i>
                                                            <strong>Vị trí hiện tại:</strong> {tracking.currentLocation}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h6 className="mb-0">
                                            <i className="bi bi-box me-2"></i>
                                            Sản phẩm đã đặt
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        {(selectedOrder?.items || []).map((item, index) => (
                                            <div key={index} className="d-flex align-items-center mb-3">
                                                <img
                                                    src={item.cover_image || '/images/book1.jpg'}
                                                    alt={item.title}
                                                    className="rounded me-3"
                                                    style={{ width: '60px', height: '80px', objectFit: 'cover' }}
                                                />
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1">{item.title}</h6>
                                                    <div className="text-muted small">
                                                        <span>Số lượng: {item.quantity}</span>
                                                        <span className="mx-2">|</span>
                                                        <span>Giá: {item.price.toLocaleString()} VNĐ</span>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <div className="fw-bold">
                                                        {(item.price * item.quantity).toLocaleString()} VNĐ
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Information */}
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h6 className="mb-0">
                                            <i className="bi bi-geo-alt me-2"></i>
                                            Thông tin giao hàng
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p><strong>Người nhận:</strong> {selectedOrder.shippingInfo?.fullName || 'Chưa cập nhật'}</p>
                                                <p><strong>Số điện thoại:</strong> {selectedOrder.shippingInfo?.phone || 'Chưa cập nhật'}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p><strong>Email:</strong> {selectedOrder.shippingInfo?.email || 'Chưa cập nhật'}</p>
                                            </div>
                                        </div>
                                        <p><strong>Địa chỉ:</strong> {selectedOrder.shippingInfo ? 
                                            `${selectedOrder.shippingInfo.address || ''}, ${selectedOrder.shippingInfo.ward || ''}, ${selectedOrder.shippingInfo.district || ''}, ${selectedOrder.shippingInfo.city || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '') || 'Chưa cập nhật'
                                            : 'Chưa cập nhật'
                                        }</p>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="card">
                                    <div className="card-header">
                                        <h6 className="mb-0">
                                            <i className="bi bi-calculator me-2"></i>
                                            Tóm tắt đơn hàng
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p><strong>Số sản phẩm:</strong> {calculateTotalItems(selectedOrder?.items || [])}</p>
                                                <p><strong>Phương thức thanh toán:</strong> {selectedOrder?.paymentMethod === 'cod' ? 'Khi nhận hàng' : 'Online'}</p>
                                            </div>
                                            <div className="col-md-6 text-md-end">
                                                <h5 className="text-success mb-0">
                                                    Tổng cộng: {(selectedOrder?.total || 0).toLocaleString()} VNĐ
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseDetail}
                                >
                                    Đóng
                                </button>
                                {selectedOrder?.status === 'pending' && (
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            handleCancelOrder(selectedOrder.id);
                                            handleCloseDetail();
                                        }}
                                    >
                                        <i className="bi bi-x-circle me-1"></i>
                                        Hủy đơn hàng
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListOrders;
