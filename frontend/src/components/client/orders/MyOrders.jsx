import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';

const MyOrders = ({ onBackToHome, onNavigateTo }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(20);
    
    // Multiple selection states
    const [selectedOrders, setSelectedOrders] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    // Fetch orders
    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Get user info
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) {
                setError('Vui lòng đăng nhập để xem đơn hàng');
                setLoading(false);
                return;
            }

            // Try to get orders from backend first (for real-time status updates)
            try {
                const backendResponse = await apiService.getMyOrders();
                if (backendResponse.success && backendResponse.data && backendResponse.data.length > 0) {
                    console.log('Using backend orders:', backendResponse.data);
                    // Sort by creation date (newest first), then by order_id as secondary sort
                    const sortedOrders = backendResponse.data.sort((a, b) => {
                        const dateA = new Date(a.created_at || a.createdAt);
                        const dateB = new Date(b.created_at || b.createdAt);
                        
                        // Primary sort by date (newest first)
                        if (dateB.getTime() !== dateA.getTime()) {
                            return dateB.getTime() - dateA.getTime();
                        }
                        
                        // Secondary sort by order_id (higher ID first for same date)
                        const idA = parseInt(a.order_id || a.id) || 0;
                        const idB = parseInt(b.order_id || b.id) || 0;
                        return idB - idA;
                    });
                    console.log('Sorted backend orders:', sortedOrders.map(o => ({
                        id: o.order_id || o.id,
                        date: o.created_at || o.createdAt,
                        title: o.items?.[0]?.book_title || 'N/A'
                    })));
                    setOrders(sortedOrders);
                    setLoading(false);
                    return;
                }
            } catch (backendError) {
                console.log('Backend orders not available, using localStorage:', backendError);
                
                // Fallback to localStorage orders
                const ordersKey = `myOrders_${user.user_id}`;
                const localOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
                
                if (localOrders.length > 0) {
                    console.log('Using localStorage orders:', localOrders);
                    // Sort by creation date (newest first), then by order_id as secondary sort
                    const sortedOrders = localOrders.sort((a, b) => {
                        const dateA = new Date(a.created_at || a.createdAt);
                        const dateB = new Date(b.created_at || b.createdAt);
                        
                        // Primary sort by date (newest first)
                        if (dateB.getTime() !== dateA.getTime()) {
                            return dateB.getTime() - dateA.getTime();
                        }
                        
                        // Secondary sort by order_id (higher ID first for same date)
                        const idA = parseInt(a.order_id || a.id) || 0;
                        const idB = parseInt(b.order_id || b.id) || 0;
                        return idB - idA;
                    });
                    
                    setOrders(sortedOrders);
                    setLoading(false);
                    return;
                } else {
                    console.log('No orders found in localStorage either');
                    setOrders([]);
                    setLoading(false);
                    return;
                }
            }

            // This should not be reached if backend fails
            const response = await apiService.getMyOrders();
            console.log('Fetched orders response:', response);
            
            if (response.success) {
                const ordersData = response.data || [];
                console.log('Orders data:', ordersData);
                
                // Sort by creation date (newest first), then by order_id as secondary sort
                const sortedOrders = ordersData.sort((a, b) => {
                    const dateA = new Date(a.created_at || a.createdAt);
                    const dateB = new Date(b.created_at || b.createdAt);
                    
                    // Primary sort by date (newest first)
                    if (dateB.getTime() !== dateA.getTime()) {
                        return dateB.getTime() - dateA.getTime();
                    }
                    
                    // Secondary sort by order_id (higher ID first for same date)
                    const idA = parseInt(a.order_id || a.id) || 0;
                    const idB = parseInt(b.order_id || b.id) || 0;
                    return idB - idA;
                });
                console.log('Sorted localStorage orders:', sortedOrders.map(o => ({
                    id: o.order_id || o.id,
                    date: o.created_at || o.createdAt,
                    title: o.items?.[0]?.book_title || 'N/A'
                })));
                setOrders(sortedOrders);
            } else {
                setError(response.message || 'Không thể tải danh sách đơn hàng');
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            
            // Try localStorage fallback as last resort
            try {
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                if (user) {
                    const ordersKey = `myOrders_${user.user_id}`;
                    const localOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
                    
                    if (localOrders.length > 0) {
                        console.log('Using localStorage fallback after error:', localOrders);
                        // Sort by creation date (newest first)
                        const sortedOrders = localOrders.sort((a, b) => {
                            const dateA = new Date(a.created_at || a.createdAt);
                            const dateB = new Date(b.created_at || b.createdAt);
                            
                            if (dateB.getTime() !== dateA.getTime()) {
                                return dateB.getTime() - dateA.getTime();
                            }
                            
                            const idA = parseInt(a.order_id || a.id) || 0;
                            const idB = parseInt(b.order_id || b.id) || 0;
                            return idB - idA;
                        });
                        
                        setOrders(sortedOrders);
                        setError('Đã tải đơn hàng từ bộ nhớ cục bộ (Backend không khả dụng)');
                        return;
                    }
                }
            } catch (fallbackError) {
                console.error('LocalStorage fallback also failed:', fallbackError);
            }
            
            setError('Có lỗi xảy ra khi tải dữ liệu đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    // Handle delete order (frontend only)
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.')) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // Remove order from local state only (no API call)
            setOrders(prevOrders => prevOrders.filter(order => 
                (order.order_id || order.id) !== orderId
            ));
            
            // Also remove from localStorage if exists
            try {
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                if (user) {
                    const ordersKey = `myOrders_${user.user_id}`;
                    let localOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
                    localOrders = localOrders.filter(order => 
                        (order.order_id || order.id) !== orderId
                    );
                    localStorage.setItem(ordersKey, JSON.stringify(localOrders));
                }
            } catch (error) {
                console.error('Error updating localStorage after delete:', error);
            }
            
            console.log(`✅ Order ${orderId} deleted from frontend successfully`);
            alert('Xóa đơn hàng thành công! (Chỉ xóa trên giao diện)');
        } catch (err) {
            console.error('Error deleting order:', err);
            setError('Có lỗi xảy ra khi xóa đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    // Handle individual order selection
    const handleOrderSelect = (orderId) => {
        setSelectedOrders(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(orderId)) {
                newSelected.delete(orderId);
            } else {
                newSelected.add(orderId);
            }
            
            // Update selectAll state based on current selection
            const deletableOrders = filteredOrders.filter(order => 
                order.status === 'pending' || order.status === 'Chờ xử lý'
            );
            const allDeletableIds = deletableOrders.map(order => order.order_id || order.id);
            const allSelected = allDeletableIds.every(id => newSelected.has(id));
            setSelectAll(allSelected);
            
            return newSelected;
        });
    };

    // Handle select all orders
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedOrders(new Set());
            setSelectAll(false);
        } else {
            const deletableOrders = filteredOrders.filter(order => 
                order.status === 'pending' || order.status === 'Chờ xử lý'
            );
            const orderIds = deletableOrders.map(order => order.order_id || order.id);
            setSelectedOrders(new Set(orderIds));
            setSelectAll(true);
        }
    };

    // Handle delete multiple orders
    const handleDeleteMultiple = async () => {
        if (selectedOrders.size === 0) {
            alert('Vui lòng chọn ít nhất một đơn hàng để xóa');
            return;
        }

        if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedOrders.size} đơn hàng đã chọn? Hành động này không thể hoàn tác.`)) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            // Remove selected orders from local state
            setOrders(prevOrders => prevOrders.filter(order => 
                !selectedOrders.has(order.order_id || order.id)
            ));
            
            // Also remove from localStorage if exists
            try {
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                if (user) {
                    const ordersKey = `myOrders_${user.user_id}`;
                    let localOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
                    localOrders = localOrders.filter(order => 
                        !selectedOrders.has(order.order_id || order.id)
                    );
                    localStorage.setItem(ordersKey, JSON.stringify(localOrders));
                }
            } catch (error) {
                console.error('Error updating localStorage after delete:', error);
            }
            
            console.log(`✅ ${selectedOrders.size} orders deleted from frontend successfully`);
            alert(`Xóa ${selectedOrders.size} đơn hàng thành công! (Chỉ xóa trên giao diện)`);
            
            // Clear selection
            setSelectedOrders(new Set());
            setSelectAll(false);
        } catch (err) {
            console.error('Error deleting orders:', err);
            setError('Có lỗi xảy ra khi xóa đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        
        // Listen for order status updates from admin dashboard
        const handleOrderStatusUpdate = (event) => {
            console.log('Received order status update:', event.detail);
            if (event.detail && event.detail.orderId && event.detail.newStatus) {
                setOrders(prevOrders => {
                    const updatedOrders = prevOrders.map(order => 
                        order.order_id === event.detail.orderId || order.id === event.detail.orderId
                            ? { 
                                ...order, 
                                status: event.detail.newStatus,
                                updated_at: event.detail.updatedAt || new Date().toISOString()
                              }
                            : order
                    );
                    
                    // Sort orders to put recently updated ones at the top
                    return updatedOrders.sort((a, b) => {
                        const dateA = new Date(a.updated_at || a.created_at || a.createdAt);
                        const dateB = new Date(b.updated_at || b.created_at || b.createdAt);
                        return dateB.getTime() - dateA.getTime();
                    });
                });
                console.log(`✅ Updated order ${event.detail.orderId} status to: ${event.detail.newStatus}`);
                
                // Show notification to user
                const statusText = {
                    'pending': 'Chờ xử lý',
                    'processing': 'Đang xử lý', 
                    'shipped': 'Đã giao',
                    'delivered': 'Đã giao',
                    'cancelled': 'Đã hủy'
                }[event.detail.newStatus] || event.detail.newStatus;
                
                // You can add a toast notification here if you have a toast library
                console.log(`📢 Thông báo: Đơn hàng #${event.detail.orderId} đã được cập nhật trạng thái thành "${statusText}"`);
            }
        };

        // Listen for new orders
        const handleNewOrder = (event) => {
            console.log('Received new order:', event.detail);
            if (event.detail && event.detail.order) {
                setOrders(prevOrders => [event.detail.order, ...prevOrders]);
            }
        };

        window.addEventListener('orderStatusUpdated', handleOrderStatusUpdate);
        window.addEventListener('newOrderPlaced', handleNewOrder);
        
        return () => {
            window.removeEventListener('orderStatusUpdated', handleOrderStatusUpdate);
            window.removeEventListener('newOrderPlaced', handleNewOrder);
        };
    }, []);

    // Filter orders by status
    const filteredOrders = orders.filter(order => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'completed') {
            // Include 'completed', 'delivered', and 'shipped' statuses for "Hoàn thành" filter
            return order.status === 'completed' || order.status === 'delivered' || order.status === 'shipped';
        }
        return order.status === filterStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    // Reset to first page when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus]);

    // Reset selection when filter changes
    useEffect(() => {
        setSelectedOrders(new Set());
        setSelectAll(false);
    }, [filterStatus]);

    // Pagination handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top when changing page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { class: 'bg-warning', text: 'Chờ xử lý' },
            'processing': { class: 'bg-primary', text: 'Đang xử lý' },
            'paid': { class: 'bg-info', text: 'Đã thanh toán' },
            'shipped': { class: 'bg-success', text: 'Hoàn thành' }, // Admin "Đã giao" -> User "Hoàn thành"
            'delivered': { class: 'bg-success', text: 'Hoàn thành' }, // Admin "Đã giao" -> User "Hoàn thành"
            'completed': { class: 'bg-success', text: 'Hoàn thành' },
            'cancelled': { class: 'bg-danger', text: 'Đã hủy' },
            'draft': { class: 'bg-secondary', text: 'Bản nháp' }
        };

        const statusInfo = statusMap[status] || { class: 'bg-secondary', text: status };

        return (
            <span className={`badge ${statusInfo.class}`}>
                {statusInfo.text}
            </span>
        );
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle view details
    const handleViewDetails = async (order) => {
        try {
            console.log('Viewing details for order:', order);
            const response = await apiService.getMyOrderById(order.id);
            console.log('Order details response:', response);
            
            if (response.success) {
                console.log('Selected order data:', response.data);
                setSelectedOrder(response.data);
                setShowDetailModal(true);
            } else {
                setError('Không thể tải chi tiết đơn hàng');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError('Có lỗi xảy ra khi tải chi tiết đơn hàng');
        }
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
        <div className="container">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark">Đơn hàng của tôi</h2>
                    <p className="text-muted mb-0">Quản lý và theo dõi đơn hàng của bạn</p>
                </div>
                <div className="d-flex flex-column align-items-end gap-2">
                    <div className="d-flex align-items-center gap-3">
                        <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={fetchOrders}
                            disabled={loading}
                        >
                            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-1`}></i>
                            Làm mới
                        </button>
                        <div className="text-muted">
                            Tổng cộng: {filteredOrders.length} đơn hàng
                            {totalPages > 1 && (
                                <span className="ms-2">
                                    (Trang {currentPage}/{totalPages})
                                </span>
                            )}
                        </div>
                    </div>
                    {selectedOrders.size > 0 && (
                        <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleDeleteMultiple}
                            disabled={loading}
                        >
                            <i className="fas fa-trash me-1"></i>
                            Xóa nhiều ({selectedOrders.size})
                        </button>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setError(null)}
                    ></button>
                </div>
            )}

            {/* Filter */}
            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="d-flex gap-2">
                        <button 
                            className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilterStatus('all')}
                        >
                            Tất cả ({orders.length})
                        </button>
                        <button 
                            className={`btn btn-sm ${filterStatus === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={() => setFilterStatus('pending')}
                        >
                            Chờ xử lý ({orders.filter(o => o.status === 'pending').length})
                        </button>
                        <button 
                            className={`btn btn-sm ${filterStatus === 'processing' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilterStatus('processing')}
                        >
                            Đang xử lý ({orders.filter(o => o.status === 'processing').length})
                        </button>
                        <button 
                            className={`btn btn-sm ${filterStatus === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => setFilterStatus('completed')}
                        >
                            Hoàn thành ({orders.filter(o => o.status === 'completed' || o.status === 'delivered' || o.status === 'shipped').length})
                        </button>
                    </div>
                </div>
                <div className="col-md-4 text-end">
                    {filteredOrders.filter(order => order.status === 'pending' || order.status === 'Chờ xử lý').length > 0 && (
                        <button 
                            className={`btn btn-sm ${selectAll ? 'btn-secondary' : 'btn-outline-secondary'}`}
                            onClick={handleSelectAll}
                        >
                            <i className="fas fa-check-square me-1"></i>
                            {selectAll ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </button>
                    )}
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-5">
                    <div className="mb-4">
                        <i className="fas fa-shopping-bag" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                    </div>
                    <h4 className="mb-3">Chưa có đơn hàng nào</h4>
                    <p className="text-muted mb-4">Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
                    <button 
                        className="btn btn-primary"
                        onClick={onBackToHome}
                    >
                        <i className="fas fa-shopping-cart me-2"></i>
                        Mua sắm ngay
                    </button>
                </div>
            ) : (
                <div className="row">
                    {currentOrders.map((order) => (
                        <div key={order.id} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                            <div className="card border-0 shadow-sm h-100 d-flex flex-column">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            {(order.status === 'pending' || order.status === 'Chờ xử lý') && (
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input"
                                                    checked={selectedOrders.has(order.order_id || order.id)}
                                                    onChange={() => handleOrderSelect(order.order_id || order.id)}
                                                />
                                            )}
                                            <h6 className="fw-bold text-dark mb-0">
                                                Đơn hàng #{(() => {
                                                    const orderId = order.order_id || order.id;
                                                    console.log(`Order ID for display: ${orderId} (type: ${typeof orderId})`);
                                                    
                                                    // Always use database order_id as sequential number
                                                    if (typeof orderId === 'number') {
                                                        return orderId.toString();
                                                    }
                                                    // If it's a string that looks like a number, use it directly
                                                    if (typeof orderId === 'string' && /^\d+$/.test(orderId)) {
                                                        return orderId;
                                                    }
                                                    // For other formats, try to extract number or use as is
                                                    return orderId?.toString() || 'N/A';
                                                })()}
                                            </h6>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="text-muted small mb-1">Sản phẩm:</div>
                                        <div className="fw-medium">
                                            {(() => {
                                                console.log(`Order ${order.id} items:`, order.items);
                                                console.log(`Order ${order.id} items length:`, order.items?.length);
                                                
                                                if (order.items?.length > 0) {
                                                    if (order.items.length === 1) {
                                                        return order.items[0].title || order.items[0].book_title;
                                                    } else {
                                                        return `${order.items[0].title || order.items[0].book_title} và ${order.items.length - 1} sản phẩm khác`;
                                                    }
                                                } else {
                                                    return 'Không có sản phẩm';
                                                }
                                            })()}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-muted small mb-1">Tổng tiền:</div>
                                        <div className="fw-bold text-primary h5 mb-0">
                                            {formatCurrency(order.total || order.total_price || 0)}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-muted small mb-1">Ngày đặt:</div>
                                        <div className="small">
                                            {formatDate(order.createdAt || order.created_at)}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-muted small mb-1">Loại đơn hàng:</div>
                                        <div className="small">
                                            <span className={`badge ${order.orderType === 'cart' ? 'bg-info' : 'bg-secondary'}`}>
                                                {order.orderType === 'cart' ? 'Từ giỏ hàng' : 'Mua ngay'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="d-grid gap-2 mt-auto">
                                        <button 
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => handleViewDetails(order)}
                                            style={{ minHeight: '38px' }}
                                        >
                                            <i className="fas fa-eye me-1"></i>
                                            Xem chi tiết
                                        </button>
                                        {(order.status === 'pending' || order.status === 'Chờ xử lý') ? (
                                            <button 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleDeleteOrder(order.order_id || order.id)}
                                                disabled={loading}
                                                title="Chỉ có thể xóa đơn hàng đang chờ xử lý (chỉ xóa trên giao diện)"
                                                style={{ minHeight: '38px' }}
                                            >
                                                <i className="fas fa-trash me-1"></i>
                                                Xóa đơn hàng
                                            </button>
                                        ) : (
                                            <div style={{ minHeight: '38px' }}></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <nav aria-label="Pagination">
                        <ul className="pagination">
                            {/* Previous Button */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                    aria-label="Trang trước"
                                >
                                    <i className="fas fa-chevron-left"></i>
                                    Trước
                                </button>
                            </li>

                            {/* Page Numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                // Show first page, last page, current page, and pages around current page
                                const showPage = page === 1 || 
                                               page === totalPages || 
                                               Math.abs(page - currentPage) <= 2;
                                
                                if (!showPage) {
                                    // Show ellipsis for gaps
                                    if (page === 2 && currentPage > 4) {
                                        return (
                                            <li key={`ellipsis-${page}`} className="page-item disabled">
                                                <span className="page-link">...</span>
                                            </li>
                                        );
                                    }
                                    if (page === totalPages - 1 && currentPage < totalPages - 3) {
                                        return (
                                            <li key={`ellipsis-${page}`} className="page-item disabled">
                                                <span className="page-link">...</span>
                                            </li>
                                        );
                                    }
                                    return null;
                                }

                                return (
                                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    </li>
                                );
                            })}

                            {/* Next Button */}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    aria-label="Trang tiếp theo"
                                >
                                    Tiếp
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            {/* Order Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Chi tiết đơn hàng #{(() => {
                                        const orderId = selectedOrder.order_id || selectedOrder.id;
                                        console.log(`Modal Order ID for display: ${orderId} (type: ${typeof orderId})`);
                                        
                                        // Always use database order_id as sequential number
                                        if (typeof orderId === 'number') {
                                            return orderId.toString();
                                        }
                                        // If it's a string that looks like a number, use it directly
                                        if (typeof orderId === 'string' && /^\d+$/.test(orderId)) {
                                            return orderId;
                                        }
                                        // For other formats, try to extract number or use as is
                                        return orderId?.toString() || 'N/A';
                                    })()}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDetailModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="fw-bold">Thông tin giao hàng</h6>
                                        {(() => {
                                            console.log('Selected order shipping info:', selectedOrder.shippingInfo);
                                            console.log('Selected order full data:', selectedOrder);
                                            
                                            if (selectedOrder.shippingInfo) {
                                                return (
                                                    <>
                                                        <p><strong>Tên:</strong> {selectedOrder.shippingInfo.fullName || 'N/A'}</p>
                                                        <p><strong>Email:</strong> {selectedOrder.shippingInfo.email || 'N/A'}</p>
                                                        <p><strong>Số điện thoại:</strong> {selectedOrder.shippingInfo.phone || 'N/A'}</p>
                                                        <p><strong>Địa chỉ:</strong><br />
                                                            {[
                                                                selectedOrder.shippingInfo.address,
                                                                selectedOrder.shippingInfo.ward,
                                                                selectedOrder.shippingInfo.district,
                                                                selectedOrder.shippingInfo.city
                                                            ].filter(part => part && part.trim() !== '').join(', ') || 'Chưa có địa chỉ'}
                                                        </p>
                                                    </>
                                                );
                                            } else {
                                                return <p className="text-muted">Không có thông tin giao hàng</p>;
                                            }
                                        })()}
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold">Thông tin đơn hàng</h6>
                                        <p><strong>Trạng thái:</strong> {getStatusBadge(selectedOrder.status)}</p>
                                        <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.createdAt || selectedOrder.created_at)}</p>
                                        <p><strong>Tổng tiền:</strong> <span className="fw-bold text-primary">{formatCurrency(selectedOrder.total || selectedOrder.total_price || 0)}</span></p>
                                        <p><strong>Loại đơn hàng:</strong> 
                                            <span className={`badge ms-2 ${selectedOrder.orderType === 'cart' ? 'bg-info' : 'bg-secondary'}`}>
                                                {selectedOrder.orderType === 'cart' ? 'Từ giỏ hàng' : 'Mua ngay'}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <hr />

                                <h6 className="fw-bold">Sản phẩm trong đơn hàng</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Tên sách</th>
                                                <th className="text-center">Số lượng</th>
                                                <th className="text-end">Đơn giá</th>
                                                <th className="text-end">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(() => {
                                                console.log('Selected order items:', selectedOrder.items);
                                                console.log('Items length:', selectedOrder.items ? selectedOrder.items.length : 0);
                                                console.log('Selected order shippingInfo:', selectedOrder.shippingInfo);
                                                console.log('Phone number in selectedOrder:', selectedOrder.shippingInfo?.phone);
                                                
                                                if (selectedOrder.items && selectedOrder.items.length > 0) {
                                                    return selectedOrder.items.map((item, index) => {
                                                        console.log(`Item ${index}:`, item);
                                                        return (
                                                            <tr key={index}>
                                                                <td>{item.title || item.book_title}</td>
                                                                <td className="text-center">{item.quantity}</td>
                                                                <td className="text-end">{formatCurrency(item.price || 0)}</td>
                                                                <td className="text-end fw-bold">{formatCurrency((item.price || 0) * item.quantity)}</td>
                                                            </tr>
                                                        );
                                                    });
                                                } else {
                                                    return (
                                                        <tr>
                                                            <td colSpan="4" className="text-center text-muted">Không có sản phẩm nào</td>
                                                        </tr>
                                                    );
                                                }
                                            })()}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colSpan="3">Tổng cộng</th>
                                                <th className="text-end">{formatCurrency(selectedOrder.total || selectedOrder.total_price || 0)}</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetailModal(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
