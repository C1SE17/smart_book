import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        paidOrders: 0,
        shippedOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0
    });
    
    // Multiple selection states
    const [selectedOrders, setSelectedOrders] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Check if user is admin before calling admin API
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) {
                setError('Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập trang quản lý đơn hàng.');
                setLoading(false);
                return;
            }
            
            if (user.role !== 'admin') {
                setError('Bạn không có quyền truy cập trang quản lý đơn hàng. Chỉ admin mới có thể truy cập. Vui lòng đăng nhập bằng tài khoản admin.');
                setLoading(false);
                return;
            }
            
            // Fetch all orders (not just pending)
            const allOrdersResponse = await apiService.getAllOrders({ suppressWarning: true }); // Admin context - suppress warning
            
            if (allOrdersResponse.success) {
                const allOrders = allOrdersResponse.data || [];
                
                // Use data directly from getAllOrders (now includes user info)
                console.log('Processing orders with user data from backend:', allOrders);
                const ordersWithUserDetails = allOrders.map((order) => {
                    console.log(`Processing order ${order.order_id}:`, order);
                    console.log(`Order ${order.order_id} money fields:`, {
                        total_price: order.total_price,
                        total_amount: order.total_amount,
                        total: order.total,
                        amount: order.amount
                    });
                    
                    // Use user data from backend query
                    const customer_name = order.user_name || `User ${order.user_id}`;
                    const customer_phone = order.user_phone || 'N/A';
                    const customer_email = order.user_email || 'N/A';
                    
                    console.log(`✅ Using customer name: ${customer_name} for user_id: ${order.user_id}`);
                    
                    const finalOrder = {
                        ...order,
                        customer_name,
                        customer_phone,
                        customer_email,
                        created_at: order.created_at || new Date().toISOString(),
                        updated_at: order.updated_at || new Date().toISOString()
                    };
                    
                    console.log(`Final order data for ${order.order_id}:`, finalOrder);
                    return finalOrder;
                });
                
                // Sort by order_id from low to high (ascending)
                ordersWithUserDetails.sort((a, b) => a.order_id - b.order_id);
                console.log('Orders sorted by order_id (low to high):', ordersWithUserDetails.map(o => o.order_id));
                
                // Set orders for display
                setOrders(ordersWithUserDetails);
                
                // Calculate statistics from all orders
                console.log('Calculating statistics from orders:', ordersWithUserDetails);
                
                const totalRevenue = ordersWithUserDetails.reduce((sum, order) => {
                    // Try multiple possible fields for total price
                    const orderTotal = parseFloat(order.total_price || order.total_amount || order.total || order.amount || 0);
                    console.log(`Order ${order.order_id}: total_price = ${order.total_price}, total_amount = ${order.total_amount}, total = ${order.total}, amount = ${order.amount}, parsed = ${orderTotal}`);
                    return sum + orderTotal;
                }, 0);
                
                console.log(`Total revenue calculated from ${ordersWithUserDetails.length} orders: ${totalRevenue}`);
                
                const totalOrders = ordersWithUserDetails.length;
                const pendingOrdersCount = ordersWithUserDetails.filter(o => o.status === 'pending').length;
                const paidOrdersCount = ordersWithUserDetails.filter(o => o.status === 'paid').length;
                const shippedOrdersCount = ordersWithUserDetails.filter(o => o.status === 'shipped').length;
                const completedOrdersCount = ordersWithUserDetails.filter(o => o.status === 'completed').length;
                const cancelledOrdersCount = ordersWithUserDetails.filter(o => o.status === 'cancelled').length;
                
                const statsData = {
                    totalRevenue,
                    totalOrders,
                    pendingOrders: pendingOrdersCount,
                    paidOrders: paidOrdersCount,
                    shippedOrders: shippedOrdersCount,
                    completedOrders: completedOrdersCount,
                    cancelledOrders: cancelledOrdersCount
                };
                
                console.log('Final stats data:', statsData);
                setStats(statsData);
            } else {
                // Handle specific error cases
                if (allOrdersResponse.message && allOrdersResponse.message.includes('403')) {
                    setError('Bạn không có quyền truy cập. Vui lòng đăng nhập bằng tài khoản admin.');
                } else {
                    setError(allOrdersResponse.message || 'Không thể tải danh sách đơn hàng');
                }
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            // Handle 403 Forbidden error specifically
            if (err.message && err.message.includes('403')) {
                setError('Bạn không có quyền truy cập trang quản lý đơn hàng. Vui lòng đăng nhập bằng tài khoản admin.');
            } else {
                setError('Có lỗi xảy ra khi tải dữ liệu đơn hàng. Vui lòng kiểm tra kết nối mạng và thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch revenue statistics
    const fetchRevenueStats = async () => {
        try {
            // Check if user is admin before calling admin API
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user || user.role !== 'admin') {
                console.log('User is not admin, skipping revenue stats fetch');
                return;
            }
            
            console.log('Fetching revenue statistics...');
            const revenueResponse = await apiService.getTotalRevenue();
            
            if (revenueResponse.success) {
                console.log('Revenue stats received:', revenueResponse.data);
                const revenueData = revenueResponse.data;
                
                // Update stats with revenue data
                setStats(prevStats => ({
                    ...prevStats,
                    totalRevenue: revenueData.totalRevenue,
                    totalOrders: revenueData.orderCount
                }));
            } else {
                console.error('Failed to get revenue stats:', revenueResponse.message);
            }
        } catch (error) {
            console.error('Error fetching revenue stats:', error);
        }
    };

    // Fetch orders from real API
    useEffect(() => {
        fetchOrders();
        fetchRevenueStats(); // Also fetch revenue stats
    }, []);

    // Validation function
    const validateStatusChange = (newStatus) => {
        const errors = {};

        if (!newStatus) {
            errors.status = 'Vui lòng chọn trạng thái';
        }

        return errors;
    };

    const handleStatusChange = async (orderId, newStatus) => {
        // Validate status change
        const errors = validateStatusChange(newStatus);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            setFormErrors({});
            setError(null);
            setSuccessMessage('');

            // Check if user is admin before calling admin API
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user || user.role !== 'admin') {
                setError('Bạn không có quyền cập nhật trạng thái đơn hàng. Chỉ admin mới có thể thực hiện.');
                return;
            }
            
            // Call API to update order status
            const response = await apiService.updateOrderStatus(orderId, newStatus);
            
            if (response.success) {
                // Update local state with current timestamp
                const currentTime = new Date().toISOString();
                setOrders(prevOrders => 
                    prevOrders.map(order =>
                        order.order_id === orderId
                            ? { ...order, status: newStatus, updated_at: currentTime }
                            : order
                    )
                );

                // Dispatch event to notify user orders page about status update
                window.dispatchEvent(new CustomEvent('orderStatusUpdated', {
                    detail: {
                        orderId: orderId,
                        newStatus: newStatus,
                        updatedAt: currentTime
                    }
                }));
                
                setSuccessMessage('Cập nhật trạng thái đơn hàng thành công!');
                
                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(response.message || 'Không thể cập nhật trạng thái đơn hàng');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            setError('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng. Vui lòng thử lại.');
        }
    };

    const handleViewDetails = async (order) => {
        try {
            setError(null);
            
            // Check if user is admin before calling admin API
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user || user.role !== 'admin') {
                setError('Bạn không có quyền xem chi tiết đơn hàng. Chỉ admin mới có thể truy cập.');
                return;
            }
            
            // Fetch detailed order information including items (admin API)
            const response = await apiService.getAdminOrderDetails(order.order_id);
            
            if (response.success) {
                // Fetch user details for the order
                console.log(`Fetching user details for order ${order.order_id}, user_id: ${order.user_id}`);
                const userResponse = await apiService.getUserById(order.user_id);
                console.log(`User response for order ${order.order_id}:`, userResponse);
                
                let customer_name = `User ${order.user_id}`;
                let customer_phone = 'N/A';
                let customer_email = 'N/A';
                
                if (userResponse.success && userResponse.data) {
                    customer_name = userResponse.data.name || userResponse.data.fullName || `User ${order.user_id}`;
                    customer_phone = userResponse.data.phone || 'N/A';
                    customer_email = userResponse.data.email || 'N/A';
                    console.log(`✅ Successfully resolved customer name: ${customer_name} for order ${order.order_id}`);
                } else {
                    console.log(`❌ Failed to get user details for order ${order.order_id}`, userResponse);
                }
                
                // Combine order data with user details
                const orderWithUserDetails = {
                    ...response.data,
                    customer_name,
                    customer_phone,
                    customer_email
                };
                
                console.log(`Final order data for modal:`, orderWithUserDetails);
                setSelectedOrder(orderWithUserDetails);
                setShowDetailModal(true);
            } else {
                // Fallback: Use existing order data if API fails
                console.log('API failed, using existing order data as fallback');
                const fallbackOrderData = {
                    ...order,
                    items: [], // No items available from fallback
                    customer_name: order.user_name || `User ${order.user_id}`,
                    customer_phone: order.user_phone || 'N/A',
                    customer_email: order.user_email || 'N/A'
                };
                
                setSelectedOrder(fallbackOrderData);
                setShowDetailModal(true);
                setError('Đã tải thông tin cơ bản (Một số chi tiết có thể không khả dụng)');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            
            // Show detailed error message
            let errorMessage = 'Có lỗi xảy ra khi tải chi tiết đơn hàng';
            
            if (error.message && error.message.includes('404')) {
                errorMessage = 'Không tìm thấy đơn hàng này';
            } else if (error.message && error.message.includes('403')) {
                errorMessage = 'Bạn không có quyền xem chi tiết đơn hàng này';
            } else if (error.message && error.message.includes('500')) {
                errorMessage = 'Lỗi server. Vui lòng thử lại sau';
            } else if (error.message) {
                errorMessage = `Lỗi: ${error.message}`;
            }
            
            setError(errorMessage);
            
            // Try fallback with existing order data
            try {
                console.log('Trying fallback with existing order data');
                const fallbackOrderData = {
                    ...order,
                    items: [], // No items available from fallback
                    customer_name: order.user_name || `User ${order.user_id}`,
                    customer_phone: order.user_phone || 'N/A',
                    customer_email: order.user_email || 'N/A'
                };
                
                setSelectedOrder(fallbackOrderData);
                setShowDetailModal(true);
                setError('Đã tải thông tin cơ bản (Một số chi tiết có thể không khả dụng)');
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                setError('Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.');
            }
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
            const allOrderIds = orders.map(order => order.order_id);
            const allSelected = allOrderIds.every(id => newSelected.has(id));
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
            const allOrderIds = orders.map(order => order.order_id);
            setSelectedOrders(new Set(allOrderIds));
            setSelectAll(true);
        }
    };

    // Handle delete single order
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác.')) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await apiService.deleteOrder(orderId);
            
            if (response.success) {
                // Remove order from local state
                setOrders(prevOrders => prevOrders.filter(order => order.order_id !== orderId));
                
                // Remove from selection if selected
                setSelectedOrders(prev => {
                    const newSelected = new Set(prev);
                    newSelected.delete(orderId);
                    return newSelected;
                });
                
                setSuccessMessage('Xóa đơn hàng thành công!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(response.message || 'Không thể xóa đơn hàng');
            }
        } catch (err) {
            console.error('Error deleting order:', err);
            setError('Có lỗi xảy ra khi xóa đơn hàng');
        } finally {
            setLoading(false);
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
            
            // Delete orders one by one
            const deletePromises = Array.from(selectedOrders).map(orderId => 
                apiService.deleteOrder(orderId)
            );
            
            const results = await Promise.all(deletePromises);
            const successCount = results.filter(result => result.success).length;
            
            if (successCount > 0) {
                // Remove deleted orders from local state
                setOrders(prevOrders => prevOrders.filter(order => !selectedOrders.has(order.order_id)));
                
                // Clear selection
                setSelectedOrders(new Set());
                setSelectAll(false);
                
                setSuccessMessage(`Xóa thành công ${successCount}/${selectedOrders.size} đơn hàng!`);
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError('Không thể xóa đơn hàng nào');
            }
        } catch (err) {
            console.error('Error deleting orders:', err);
            setError('Có lỗi xảy ra khi xóa đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { class: 'bg-warning', text: 'Chờ xử lý' },
            'paid': { class: 'bg-primary', text: 'Đã thanh toán' },
            'completed': { class: 'bg-success', text: 'Hoàn thành' },
            'shipped': { class: 'bg-info', text: 'Đã giao' },
            'cancelled': { class: 'bg-danger', text: 'Đã hủy' }
        };

        const statusInfo = statusMap[status] || { class: 'bg-secondary', text: status };

        return (
            <span className={`badge ${statusInfo.class} px-2 py-1`}>
                {statusInfo.text}
            </span>
        );
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getStatusOptions = (currentStatus) => {
        const allStatuses = [
            { value: 'pending', text: 'Chờ xử lý' },
            { value: 'paid', text: 'Đã thanh toán' },
            { value: 'shipped', text: 'Đã giao' },
            { value: 'completed', text: 'Hoàn thành' },
            { value: 'cancelled', text: 'Đã hủy' }
        ];

        return allStatuses.filter(status => status.value !== currentStatus);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-3">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold text-dark mb-1">Quản lý đơn hàng</h1>
                    <p className="text-muted mb-0">Hiển thị đơn hàng chờ xử lý - Nhấn "Làm mới" để cập nhật đơn hàng mới</p>
                </div>
                <div className="d-flex align-items-center gap-3">
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            fetchOrders();
                            fetchRevenueStats();
                        }}
                        disabled={loading}
                    >
                        <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-2`}></i>
                        Làm mới
                    </button>
                    <button 
                        className="btn btn-outline-danger"
                        onClick={handleDeleteMultiple}
                        disabled={loading || selectedOrders.size === 0}
                        title={selectedOrders.size === 0 ? "Chọn đơn hàng để xóa" : `Xóa ${selectedOrders.size} đơn hàng đã chọn`}
                    >
                        <i className="fas fa-trash me-2"></i>
                        Xóa nhiều ({selectedOrders.size})
                    </button>
                    
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                    {error.includes('admin') && (
                        <div className="mt-2">
                            <div className="mb-2">
                                <small className="text-muted">
                                    <i className="fas fa-lightbulb me-1"></i>
                                    <strong>Hướng dẫn:</strong> Để truy cập trang quản lý đơn hàng, bạn cần đăng nhập bằng tài khoản có quyền admin. 
                                    Nếu chưa có tài khoản admin, vui lòng liên hệ quản trị viên hệ thống.
                                </small>
                            </div>
                            <button 
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={() => {
                                    // Redirect to login page
                                    window.location.href = '/login';
                                }}
                            >
                                <i className="fas fa-sign-in-alt me-1"></i>
                                Đăng nhập Admin
                            </button>
                            <button 
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                    // Redirect to home page
                                    window.location.href = '/';
                                }}
                            >
                                <i className="fas fa-home me-1"></i>
                                Về trang chủ
                            </button>
                        </div>
                    )}
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setError(null)}
                    ></button>
                </div>
            )}

            {/* Success Message */}
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="fas fa-check-circle me-2"></i>
                    {successMessage}
                    <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setSuccessMessage('')}
                    ></button>
                </div>
            )}

            {/* Info Message - Only show if user is admin */}
            {!error && (
                <div className="alert alert-info alert-dismissible fade show mb-4" role="alert">
                    <div className="d-flex align-items-start">
                        <i className="fas fa-info-circle me-3 mt-1"></i>
                        <div className="flex-grow-1">
                            <strong>Lưu ý:</strong> Khi khách hàng đặt hàng thành công từ trang chủ, đơn hàng sẽ xuất hiện trong danh sách này với trạng thái "Chờ xử lý". Nhấn nút "Làm mới" để cập nhật danh sách đơn hàng mới nhất.
                        </div>
                        <button 
                            type="button" 
                            className="btn-close" 
                            data-bs-dismiss="alert"
                        ></button>
                    </div>
                </div>
            )}

            {/* Order Status Cards - Compact Design */}
            <div className="row mb-4">
                <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center py-3 d-flex flex-column justify-content-center" style={{ minHeight: '120px' }}>
                            <div className="text-warning mb-2">
                                <i className="fas fa-clock fs-3"></i>
                            </div>
                            <h4 className="fw-bold text-warning mb-1">{stats.pendingOrders}</h4>
                            <p className="text-muted mb-0 small">Chờ xử lý</p>
                        </div>
                    </div>
                </div>

                <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center py-3 d-flex flex-column justify-content-center" style={{ minHeight: '120px' }}>
                            <div className="text-primary mb-2">
                                <i className="fas fa-credit-card fs-3"></i>
                            </div>
                            <h4 className="fw-bold text-primary mb-1">{stats.paidOrders}</h4>
                            <p className="text-muted mb-0 small">Đã thanh toán</p>
                        </div>
                    </div>
                </div>

                <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center py-3 d-flex flex-column justify-content-center" style={{ minHeight: '120px' }}>
                            <div className="text-info mb-2">
                                <i className="fas fa-truck fs-3"></i>
                            </div>
                            <h4 className="fw-bold text-info mb-1">{stats.shippedOrders}</h4>
                            <p className="text-muted mb-0 small">Đã giao</p>
                        </div>
                    </div>
                </div>

                <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center py-3 d-flex flex-column justify-content-center" style={{ minHeight: '120px' }}>
                            <div className="text-success mb-2">
                                <i className="fas fa-check-circle fs-3"></i>
                            </div>
                            <h4 className="fw-bold text-success mb-1">{stats.completedOrders}</h4>
                            <p className="text-muted mb-0 small">Hoàn thành</p>
                        </div>
                    </div>
                </div>

                <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center py-3 d-flex flex-column justify-content-center" style={{ minHeight: '120px' }}>
                            <div className="text-danger mb-2">
                                <i className="fas fa-times-circle fs-3"></i>
                            </div>
                            <h4 className="fw-bold text-danger mb-1">{stats.cancelledOrders}</h4>
                            <p className="text-muted mb-0 small">Đã hủy</p>
                        </div>
                    </div>
                </div>

                <div className="col-xl-2 col-md-4 col-sm-6 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center py-3 d-flex flex-column justify-content-center" style={{ minHeight: '120px' }}>
                            <div className="text-secondary mb-2">
                                <i className="fas fa-list fs-3"></i>
                            </div>
                            <h4 className="fw-bold text-secondary mb-1">{stats.totalOrders}</h4>
                            <p className="text-muted mb-0 small">Tổng cộng</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Revenue Overview Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <h5 className="fw-bold text-dark mb-0">
                                <i className="fas fa-chart-bar me-2 text-primary"></i>
                                Tổng quan doanh thu
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <div className="card border-0 bg-light">
                                        <div className="card-body text-center py-3">
                                            <div className="text-primary mb-2">
                                                <i className="fas fa-dollar-sign fs-2"></i>
                                            </div>
                                            <h4 className="fw-bold text-primary mb-1">{formatCurrency(stats.totalRevenue)}</h4>
                                            <p className="text-muted mb-0 small">Tổng doanh thu</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="card border-0 bg-light">
                                        <div className="card-body text-center py-3">
                                            <div className="text-success mb-2">
                                                <i className="fas fa-shopping-cart fs-2"></i>
                                            </div>
                                            <h4 className="fw-bold text-success mb-1">{stats.totalOrders}</h4>
                                            <p className="text-muted mb-0 small">Tổng đơn hàng</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0">
                    <h5 className="fw-bold text-dark mb-0">
                        <i className="fas fa-list me-2 text-secondary"></i>
                        Danh sách đơn hàng
                    </h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="border-0 py-3">
                                        <input 
                                            type="checkbox" 
                                            className="form-check-input"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="border-0 py-3">Mã đơn</th>
                                    <th className="border-0 py-3">Khách hàng</th>
                                    <th className="border-0 py-3">Liên hệ</th>
                                    <th className="border-0 py-3">Loại đơn hàng</th>
                                    <th className="border-0 py-3 text-end">Tổng tiền</th>
                                    <th className="border-0 py-3">Trạng thái</th>
                                    <th className="border-0 py-3">Ngày tạo</th>
                                    <th className="border-0 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders && orders.length > 0 ? orders.map((order, index) => (
                                    <tr key={`order-${order.order_id}-${index}`} className="border-0">
                                        <td className="py-3">
                                            <input 
                                                type="checkbox" 
                                                className="form-check-input"
                                                checked={selectedOrders.has(order.order_id)}
                                                onChange={() => handleOrderSelect(order.order_id)}
                                            />
                                        </td>
                                        <td className="py-3">
                                            <span className="fw-bold">#{order.order_id}</span>
                                        </td>
                                        <td className="py-3">
                                            <div className="fw-medium text-dark">{order.customer_name || `User ${order.user_id}`}</div>
                                            <div className="text-muted small">{order.shipping_address || 'Chưa có địa chỉ'}</div>
                                        </td>
                                        <td className="py-3">
                                            <div className="small">
                                                <div>{order.user_email || 'N/A'}</div>
                                                <div className="text-muted">{order.customer_phone || 'N/A'}</div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <span className={`badge ${order.order_type === 'cart' ? 'bg-info' : 'bg-secondary'}`}>
                                                {order.order_type === 'cart' ? 'Từ giỏ hàng' : 'Mua ngay'}
                                            </span>
                                        </td>
                                        <td className="text-end fw-bold py-3">
                                            {(() => {
                                                const amount = order.total_price || order.total_amount || order.total || 0;
                                                console.log(`Order ${order.order_id} amount:`, amount, 'type:', typeof amount);
                                                return formatCurrency(amount);
                                            })()}
                                        </td>
                                        <td className="py-3">
                                            <div className="d-flex align-items-center">
                                                {getStatusBadge(order.status)}
                                                <select
                                                    className={`form-select form-select-sm ms-2 ${formErrors.status ? 'is-invalid' : ''}`}
                                                    style={{ width: '120px' }}
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                                >
                                                    {getStatusOptions(order.status).map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.text}
                                                        </option>
                                                    ))}
                                                </select>
                                                {formErrors.status && (
                                                    <div className="invalid-feedback">{formErrors.status}</div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-muted small py-3">
                                            {order.created_at ? new Date(order.created_at).toLocaleString('vi-VN', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            }) : 'N/A'}
                                        </td>
                                        <td className="text-center py-3">
                                            <div className="d-flex gap-2 justify-content-center">
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => handleViewDetails(order)}
                                                >
                                                    <i className="fas fa-eye me-1"></i>
                                                    Chi tiết
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleDeleteOrder(order.order_id)}
                                                    disabled={loading}
                                                >
                                                    <i className="fas fa-trash me-1"></i>
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr className="border-0">
                                        <td colSpan="9" className="text-center text-muted py-4">
                                            <i className="fas fa-inbox fa-2x mb-2"></i>
                                            <div>Không có đơn hàng nào</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Chi tiết đơn hàng #{orders.findIndex(o => o.order_id === selectedOrder.order_id) + 1}
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
                                        <h6 className="fw-bold">Thông tin khách hàng</h6>
                                        <p><strong>Tên:</strong> {selectedOrder.customer_name || `User ${selectedOrder.user_id}`}</p>
                                        <p><strong>Email:</strong> {selectedOrder.customer_email || selectedOrder.user_email || 'N/A'}</p>
                                        <p><strong>Số điện thoại:</strong> {selectedOrder.customer_phone || 'N/A'}</p>
                                        <p><strong>Địa chỉ giao hàng:</strong><br />{selectedOrder.shipping_address || 'Chưa có địa chỉ'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold">Thông tin đơn hàng</h6>
                                        <p><strong>Trạng thái:</strong> {getStatusBadge(selectedOrder.status)}</p>
                                        <p><strong>Ngày tạo:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('vi-VN', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        }) : 'N/A'}</p>
                                        <p><strong>Cập nhật cuối:</strong> {selectedOrder.updated_at ? new Date(selectedOrder.updated_at).toLocaleString('vi-VN', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        }) : 'N/A'}</p>
                                        <p><strong>Tổng tiền:</strong> <span className="fw-bold text-primary">{formatCurrency(selectedOrder.total_price || 0)}</span></p>
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
                                            {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                                selectedOrder.items.map((item, index) => (
                                                <tr key={index}>
                                                        <td>{item.book_title || `Book ID: ${item.book_id}`}</td>
                                                    <td className="text-center">{item.quantity}</td>
                                                        <td className="text-end">{formatCurrency(item.price_at_order || item.price || 0)}</td>
                                                        <td className="text-end fw-bold">{formatCurrency((item.price_at_order || item.price || 0) * item.quantity)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-muted">Không có sản phẩm nào</td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colSpan="3">Tổng cộng</th>
                                                <th className="text-end">{formatCurrency(selectedOrder.total_price || 0)}</th>
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

export default OrderManagement;
