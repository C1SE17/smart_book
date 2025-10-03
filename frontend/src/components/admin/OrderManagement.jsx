import React, { useState, useEffect } from 'react';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Mock data
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setTimeout(() => {
                setOrders([
                    {
                        order_id: 1,
                        user_id: 1,
                        customer_name: 'Nguyễn Văn A',
                        customer_email: 'nguyenvana@email.com',
                        customer_phone: '0123456789',
                        status: 'pending',
                        total_price: 450000,
                        shipping_address: '123 Đường ABC, Quận 1, TP.HCM',
                        created_at: '2024-01-15T10:30:00Z',
                        updated_at: '2024-01-15T10:30:00Z',
                        items: [
                            { book_id: 1, title: 'Thanh Gươm Diệt Quỷ - Tập 1', quantity: 2, price: 815000 },
                            { book_id: 2, title: 'Harry Potter và Hòn Đá Phù Thủy', quantity: 1, price: 320000 }
                        ]
                    },
                    {
                        order_id: 2,
                        user_id: 2,
                        customer_name: 'Trần Thị B',
                        customer_email: 'tranthib@email.com',
                        customer_phone: '0987654321',
                        status: 'processing',
                        total_price: 680000,
                        shipping_address: '456 Đường XYZ, Quận 2, TP.HCM',
                        created_at: '2024-01-14T15:20:00Z',
                        updated_at: '2024-01-15T09:15:00Z',
                        items: [
                            { book_id: 3, title: 'One Piece - Tập 1', quantity: 3, price: 200000 },
                            { book_id: 4, title: 'Attack on Titan - Tập 1', quantity: 1, price: 220000 }
                        ]
                    },
                    {
                        order_id: 3,
                        user_id: 3,
                        customer_name: 'Lê Văn C',
                        customer_email: 'levanc@email.com',
                        customer_phone: '0369852147',
                        status: 'shipped',
                        total_price: 250000,
                        shipping_address: '789 Đường DEF, Quận 3, TP.HCM',
                        created_at: '2024-01-13T08:45:00Z',
                        updated_at: '2024-01-14T14:30:00Z',
                        items: [
                            { book_id: 5, title: 'Norwegian Wood', quantity: 1, price: 350000 }
                        ]
                    },
                    {
                        order_id: 4,
                        user_id: 4,
                        customer_name: 'Phạm Thị D',
                        customer_email: 'phamthid@email.com',
                        customer_phone: '0741852963',
                        status: 'completed',
                        total_price: 890000,
                        shipping_address: '321 Đường GHI, Quận 4, TP.HCM',
                        created_at: '2024-01-12T16:10:00Z',
                        updated_at: '2024-01-13T11:20:00Z',
                        items: [
                            { book_id: 1, title: 'Thanh Gươm Diệt Quỷ - Tập 1', quantity: 1, price: 815000 },
                            { book_id: 2, title: 'Harry Potter và Hòn Đá Phù Thủy', quantity: 1, price: 320000 }
                        ]
                    },
                    {
                        order_id: 5,
                        user_id: 5,
                        customer_name: 'Hoàng Văn E',
                        customer_email: 'hoangvane@email.com',
                        customer_phone: '0852741963',
                        status: 'cancelled',
                        total_price: 320000,
                        shipping_address: '654 Đường JKL, Quận 5, TP.HCM',
                        created_at: '2024-01-11T12:30:00Z',
                        updated_at: '2024-01-12T09:45:00Z',
                        items: [
                            { book_id: 2, title: 'Harry Potter và Hòn Đá Phù Thủy', quantity: 1, price: 320000 }
                        ]
                    }
                ]);
                setLoading(false);
            }, 1000);
        };

        fetchOrders();
    }, []);

    // Validation function
    const validateStatusChange = (newStatus) => {
        const errors = {};

        if (!newStatus) {
            errors.status = 'Vui lòng chọn trạng thái';
        }

        return errors;
    };

    const handleStatusChange = (orderId, newStatus) => {
        // Validate status change
        const errors = validateStatusChange(newStatus);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            setOrders(orders.map(order =>
                order.order_id === orderId
                    ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
                    : order
            ));
            setFormErrors({});
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng. Vui lòng thử lại.');
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { class: 'bg-warning', text: 'Chờ xử lý' },
            'processing': { class: 'bg-primary', text: 'Đang xử lý' },
            'shipped': { class: 'bg-info', text: 'Đã giao' },
            'completed': { class: 'bg-success', text: 'Hoàn thành' },
            'cancelled': { class: 'bg-danger', text: 'Đã hủy' }
        };

        const statusInfo = statusMap[status] || { class: 'bg-secondary', text: status };

        return (
            <span className={`badge ${statusInfo.class}`}>
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
            { value: 'processing', text: 'Đang xử lý' },
            { value: 'shipped', text: 'Đã giao' },
            { value: 'completed', text: 'Hoàn thành' },
            { value: 'cancelled', text: 'Đã hủy' }
        ];

        return allStatuses.filter(status => status.value !== currentStatus);
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
                <h2 className="fw-bold text-dark">Quản lý đơn hàng</h2>
                <div className="text-muted">
                    Tổng cộng: {orders.length} đơn hàng
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row mb-4">
                <div className="col-md-2 mb-3">
                    <div className="card border-0 shadow-sm text-center">
                        <div className="card-body">
                            <h4 className="fw-bold text-warning">{orders.filter(o => o.status === 'pending').length}</h4>
                            <p className="text-muted mb-0 small">Chờ xử lý</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 mb-3">
                    <div className="card border-0 shadow-sm text-center">
                        <div className="card-body">
                            <h4 className="fw-bold text-primary">{orders.filter(o => o.status === 'processing').length}</h4>
                            <p className="text-muted mb-0 small">Đang xử lý</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 mb-3">
                    <div className="card border-0 shadow-sm text-center">
                        <div className="card-body">
                            <h4 className="fw-bold text-info">{orders.filter(o => o.status === 'shipped').length}</h4>
                            <p className="text-muted mb-0 small">Đã giao</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 mb-3">
                    <div className="card border-0 shadow-sm text-center">
                        <div className="card-body">
                            <h4 className="fw-bold text-success">{orders.filter(o => o.status === 'completed').length}</h4>
                            <p className="text-muted mb-0 small">Hoàn thành</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 mb-3">
                    <div className="card border-0 shadow-sm text-center">
                        <div className="card-body">
                            <h4 className="fw-bold text-danger">{orders.filter(o => o.status === 'cancelled').length}</h4>
                            <p className="text-muted mb-0 small">Đã hủy</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 mb-3">
                    <div className="card border-0 shadow-sm text-center">
                        <div className="card-body">
                            <h4 className="fw-bold text-dark">
                                {formatCurrency(orders.reduce((sum, order) => sum + order.total_price, 0))}
                            </h4>
                            <p className="text-muted mb-0 small">Tổng doanh thu</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th>Liên hệ</th>
                                    <th className="text-end">Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Ngày tạo</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.order_id}>
                                        <td>
                                            <span className="fw-bold">#{order.order_id.toString().padStart(6, '0')}</span>
                                        </td>
                                        <td>
                                            <div className="fw-medium text-dark">{order.customer_name}</div>
                                            <div className="text-muted small">{order.shipping_address}</div>
                                        </td>
                                        <td>
                                            <div className="small">
                                                <div>{order.customer_email}</div>
                                                <div className="text-muted">{order.customer_phone}</div>
                                            </div>
                                        </td>
                                        <td className="text-end fw-bold">
                                            {formatCurrency(order.total_price)}
                                        </td>
                                        <td>
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
                                        <td className="text-muted small">
                                            {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleViewDetails(order)}
                                            >
                                                <i className="fas fa-eye me-1"></i>
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
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
                                    Chi tiết đơn hàng #{selectedOrder.order_id.toString().padStart(6, '0')}
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
                                        <p><strong>Tên:</strong> {selectedOrder.customer_name}</p>
                                        <p><strong>Email:</strong> {selectedOrder.customer_email}</p>
                                        <p><strong>Số điện thoại:</strong> {selectedOrder.customer_phone}</p>
                                        <p><strong>Địa chỉ giao hàng:</strong><br />{selectedOrder.shipping_address}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold">Thông tin đơn hàng</h6>
                                        <p><strong>Trạng thái:</strong> {getStatusBadge(selectedOrder.status)}</p>
                                        <p><strong>Ngày tạo:</strong> {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}</p>
                                        <p><strong>Cập nhật cuối:</strong> {new Date(selectedOrder.updated_at).toLocaleString('vi-VN')}</p>
                                        <p><strong>Tổng tiền:</strong> <span className="fw-bold text-primary">{formatCurrency(selectedOrder.total_price)}</span></p>
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
                                            {selectedOrder.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.title}</td>
                                                    <td className="text-center">{item.quantity}</td>
                                                    <td className="text-end">{formatCurrency(item.price)}</td>
                                                    <td className="text-end fw-bold">{formatCurrency(item.price * item.quantity)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colSpan="3">Tổng cộng</th>
                                                <th className="text-end">{formatCurrency(selectedOrder.total_price)}</th>
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
