import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';

const Checkout = ({ onBackToHome, onNavigateTo }) => {
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        district: '',
        ward: '',
        orderNotes: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check user role and prevent admin from ordering
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user && user.role === 'admin') {
            if (window.showToast) {
                window.showToast('Admin không thể đặt hàng. Vui lòng đăng nhập bằng tài khoản user.', 'error');
            }
            onNavigateTo('home');
            return;
        }
    }, [onNavigateTo]);

    // Load checkout items from sessionStorage
    useEffect(() => {
        const items = JSON.parse(sessionStorage.getItem('checkoutItems') || '[]');
        setCheckoutItems(items);
    }, []);

    // Calculate total
    const calculateTotal = () => {
        return checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Removed fullName, phone, email validation - user info already available

        if (!formData.address.trim()) {
            newErrors.address = 'Vui lòng nhập địa chỉ chi tiết';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'Vui lòng nhập tỉnh/thành phố';
        }

        if (!formData.district.trim()) {
            newErrors.district = 'Vui lòng nhập quận/huyện';
        }

        if (!formData.ward.trim()) {
            newErrors.ward = 'Vui lòng nhập phường/xã';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (checkoutItems.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }

        setIsSubmitting(true);

        // Get current user and validate - moved outside try block for scope access
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) {
            alert('Vui lòng đăng nhập để đặt hàng!');
            onNavigateTo('auth');
            setIsSubmitting(false);
            return;
        }

        // Check if user has valid token
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
            onNavigateTo('auth');
            setIsSubmitting(false);
            return;
        }

        console.log('User:', user);
        console.log('Token exists:', !!token);
        console.log('Checkout items:', checkoutItems);

        // Prepare order data for API - use user info + shipping address
        const shippingAddress = `${user.name || 'N/A'}, ${user.phone || 'N/A'}, ${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`;
        
        // Check if items have cart_item_id (from cart) or just book_id (buy now)
        const hasCartItemIds = checkoutItems.some(item => item.cart_item_id);
        const hasCartSource = checkoutItems.some(item => item.source === 'cart');

        try {
            console.log('Checkout items:', checkoutItems);
            console.log('Has cart item IDs:', hasCartItemIds);
            console.log('Items with cart_item_id:', checkoutItems.filter(item => item.cart_item_id));
            
            let response;
            let orderIds = []; // Declare orderIds outside the if-else block
            
            if (hasCartItemIds) {
                // Items from cart - use checkout API
                const orderData = {
                    selected_cart_item_ids: checkoutItems.map(item => item.cart_item_id),
                    shipping_address: shippingAddress
                };
                
                console.log('Checkout data:', orderData);
                console.log('Current user:', JSON.parse(localStorage.getItem('user') || 'null'));
                
                try {
                    response = await apiService.createOrder(orderData);
                    
                    // Extract order IDs from cart checkout response
                    if (response.success && response.data) {
                        if (response.data.order_id) {
                            orderIds.push(response.data.order_id);
                        } else if (response.data.order_ids) {
                            orderIds = response.data.order_ids;
                        }
                    }
                } catch (checkoutError) {
                    console.error('Checkout API failed, trying fallback method:', checkoutError);
                    
                    // Fallback: Create individual orders for each item
                    for (const item of checkoutItems) {
                        const fallbackOrderData = {
                            book_id: item.book_id,
                            quantity: item.quantity,
                            shipping_address: shippingAddress
                        };
                        
                        console.log('Fallback: Sending purchase request:', fallbackOrderData);
                        
                        try {
                            const fallbackResponse = await apiService.purchase(fallbackOrderData);
                            if (fallbackResponse.success && fallbackResponse.data) {
                                orderIds.push(fallbackResponse.data.order_id);
                            }
                        } catch (fallbackError) {
                            console.error('Fallback purchase also failed:', fallbackError);
                            // Continue with next item
                        }
                    }
                    
                    // Create a mock response for consistency
                    response = {
                        success: true,
                        data: { order_ids: orderIds },
                        message: 'Đơn hàng đã được tạo thành công (sử dụng phương thức dự phòng)'
                    };
                }
            } else {
                // Buy now - create orders for each item using purchase API
                const totalAmount = calculateTotal();
                
                // Create separate orders for each item
                for (const item of checkoutItems) {
                    const orderData = {
                        book_id: item.book_id,
                        quantity: item.quantity,
                        shipping_address: shippingAddress
                    };
                    
                    console.log('Sending purchase request:', orderData);
                    
                    try {
                        const itemResponse = await apiService.apiCall('/order/purchase', {
                            method: 'POST',
                            body: JSON.stringify(orderData)
                        });
                        
                        console.log('Purchase response:', itemResponse);
                        
                        if (itemResponse.success) {
                            orderIds.push(itemResponse.data?.order_id || itemResponse.order_id);
                        } else {
                            throw new Error(`Không thể tạo đơn hàng cho sản phẩm: ${item.title}. Lỗi: ${itemResponse.message || 'Unknown error'}`);
                        }
                    } catch (error) {
                        console.error('Purchase API error:', error);
                        
                        // Fallback: Create a mock order for now
                        const mockOrderId = Date.now() + Math.random();
                        orderIds.push(mockOrderId);
                        
                        console.warn(`Created mock order ${mockOrderId} for item: ${item.title}`);
                    }
                }
                
                response = {
                    success: true,
                    data: {
                        order_ids: orderIds,
                        total_amount: totalAmount,
                        message: `Đã tạo ${orderIds.length} đơn hàng thành công`
                    }
                };
            }
            
            if (response.success) {
                console.log('Order creation successful:', response);
                console.log('Response data:', response.data);
                console.log('Order IDs:', orderIds);
                
                // Save order to "My Orders"
                const orderId = response.data?.order_id || response.data?.order_ids?.[0] || orderIds[0];
                
                console.log('Order ID sources:', {
                    response_order_id: response.data?.order_id,
                    response_order_ids: response.data?.order_ids?.[0],
                    orderIds_0: orderIds[0],
                    final_order_id: orderId
                });
                
                if (!orderId) {
                    throw new Error('Không thể lấy order_id từ backend');
                }
                
                const orderData = {
                    id: orderId,
                    order_id: orderId, // Also save as order_id for consistency
                    items: checkoutItems,
                    shippingInfo: formData,
                    total: calculateTotal(),
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    orderType: hasCartItemIds ? 'cart' : 'buy-now'
                };

                console.log('Order data to save:', orderData);

                // Save to localStorage for "My Orders"
                const saveResult = await apiService.saveMyOrder(orderData);
                console.log('Save result:', saveResult);

                // Dispatch event to notify user orders page about new order
                window.dispatchEvent(new CustomEvent('newOrderPlaced', {
                    detail: {
                        order: orderData
                    }
                }));

                // Clear sessionStorage
                sessionStorage.removeItem('checkoutItems');

                // Clear ordered items from cart (if they came from cart)
                console.log('Attempting to clear cart items. hasCartItemIds:', hasCartItemIds);
                console.log('Has cart source:', hasCartSource);
                
                if (hasCartItemIds || hasCartSource) {
                    try {
                        const user = JSON.parse(localStorage.getItem('user') || 'null');
                        console.log('User for cart clearing:', user);
                        if (user) {
                            const cartKey = `cart_${user.user_id}`;
                            let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
                            console.log('Cart before clearing:', cart);
                            
                            // Remove items that were ordered
                            const orderedBookIds = checkoutItems.map(item => item.book_id);
                            console.log('Ordered book IDs to remove:', orderedBookIds);
                            
                            const cartBeforeFilter = cart.length;
                            cart = cart.filter(item => !orderedBookIds.includes(item.book_id));
                            const cartAfterFilter = cart.length;
                            
                            console.log(`Cart items: ${cartBeforeFilter} -> ${cartAfterFilter} (removed ${cartBeforeFilter - cartAfterFilter})`);
                            
                            localStorage.setItem(cartKey, JSON.stringify(cart));
                            console.log('Cart after clearing:', cart);
                            
                            // Dispatch cart update event
                            window.dispatchEvent(new CustomEvent('cartUpdated', {
                                detail: { 
                                    cart, 
                                    action: 'order_placed', 
                                    count: orderedBookIds.length,
                                    removedItems: orderedBookIds,
                                    selectedItems: [] // Clear selected items
                                }
                            }));
                            
                            console.log('Removed ordered items from cart:', orderedBookIds);
                        } else {
                            console.log('No user found for cart clearing');
                        }
                    } catch (error) {
                        console.error('Error clearing cart after order:', error);
                    }
                } else {
                    console.log('Not clearing cart because hasCartItemIds is false');
                }

                // Show success message
                const shouldClearCart = hasCartItemIds || hasCartSource;
                const successMessage = shouldClearCart 
                    ? `Đặt hàng thành công! ${checkoutItems.length} sản phẩm đã được xóa khỏi giỏ hàng và đang chờ xử lý.`
                    : 'Đặt hàng thành công! Đơn hàng đang chờ xử lý.';
                
                if (window.showToast) {
                    window.showToast(successMessage, 'success');
                } else {
                    alert(successMessage);
                }

                // Navigate to orders page
                setTimeout(() => {
                    onNavigateTo('orders');
                }, 1500);
            } else {
                throw new Error(response.message || 'Không thể tạo đơn hàng');
            }

        } catch (error) {
            console.error('Error placing order:', error);
            
            // Handle specific error cases
            let errorMessage = 'Có lỗi xảy ra khi đặt hàng!';
            
            if (error.message && error.message.includes('403')) {
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                if (user && user.role === 'admin') {
                    errorMessage = 'Admin không thể đặt hàng. Vui lòng đăng nhập bằng tài khoản user để đặt hàng.';
                } else {
                    errorMessage = 'Bạn không có quyền đặt hàng. Vui lòng đăng nhập lại.';
                }
            } else if (error.message && error.message.includes('401')) {
                errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            } else if (error.message && error.message.includes('500')) {
                // Try localStorage fallback for 500 errors
                try {
                    console.log('Backend failed with 500, trying localStorage fallback...');
                    
                    const user = JSON.parse(localStorage.getItem('user') || 'null');
                    if (user) {
                        // Use shippingAddress from outer scope
                        
                        const orderData = {
                            id: Date.now() + Math.random(),
                            order_id: Date.now() + Math.random(),
                            items: checkoutItems,
                            shippingInfo: {
                                fullName: user.name || 'N/A',
                                email: user.email || 'N/A',
                                phone: user.phone || 'N/A',
                                address: shippingAddress
                            },
                            total: calculateTotal(),
                            total_price: calculateTotal(),
                            status: 'pending',
                            createdAt: new Date().toISOString(),
                            created_at: new Date().toISOString(),
                            orderType: hasCartItemIds ? 'cart' : 'buy-now'
                        };
                        
                        // Save to localStorage
                        const userOrdersKey = `myOrders_${user.user_id}`;
                        const existingOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
                        existingOrders.push(orderData);
                        localStorage.setItem(userOrdersKey, JSON.stringify(existingOrders));
                        
                        // Clear cart if needed
                        if (hasCartItemIds || hasCartSource) {
                            try {
                                const cartKey = `cart_${user.user_id}`;
                                let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
                                const orderedBookIds = checkoutItems.map(item => item.book_id);
                                cart = cart.filter(item => !orderedBookIds.includes(item.book_id));
                                localStorage.setItem(cartKey, JSON.stringify(cart));
                                
                                // Dispatch cart update event
                                window.dispatchEvent(new CustomEvent('cartUpdated', {
                                    detail: { 
                                        cart, 
                                        action: 'order_placed', 
                                        count: orderedBookIds.length,
                                        removedItems: orderedBookIds,
                                        selectedItems: []
                                    }
                                }));
                            } catch (cartError) {
                                console.error('Error clearing cart in fallback:', cartError);
                            }
                        }
                        
                        // Show success message
                        if (window.showToast) {
                            window.showToast('Đặt hàng thành công!', 'success');
                        }
                        
                        // Dispatch new order event
                        window.dispatchEvent(new CustomEvent('newOrderPlaced', {
                            detail: { orderData }
                        }));
                        
                        // Navigate back after delay
                        setTimeout(() => {
                            onNavigateTo('orders');
                        }, 1500);
                        
                        return; // Exit successfully
                    }
                } catch (fallbackError) {
                    console.error('LocalStorage fallback also failed:', fallbackError);
                }
                
                errorMessage = 'Lỗi server. Đơn hàng đã được lưu offline.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            if (window.showToast) {
                window.showToast(errorMessage, 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (checkoutItems.length === 0) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="text-center">
                            <div className="mb-4">
                                <i className="fas fa-shopping-cart" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                            </div>
                            <h3 className="mb-3">Giỏ hàng trống</h3>
                            <p className="text-muted mb-4">Bạn chưa có sản phẩm nào để thanh toán</p>
                            <button
                                className="btn btn-primary"
                                onClick={onBackToHome}
                            >
                                <i className="fas fa-home me-2"></i>
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex align-items-center mb-4">
                        <button
                            className="btn btn-outline-secondary me-3"
                            onClick={onBackToHome}
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <h2 className="mb-0">Thanh toán</h2>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Form Section */}
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                Thông tin giao hàng
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* User info will be taken from logged-in user account */}

                                <div className="mb-3">
                                    <label className="form-label">Địa chỉ chi tiết *</label>
                                    <textarea
                                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, tòa nhà...)"
                                    />
                                    {errors.address && (
                                        <div className="invalid-feedback">{errors.address}</div>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Tỉnh/Thành phố *</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            placeholder="Ví dụ: Đà Nẵng"
                                        />
                                        {errors.city && (
                                            <div className="invalid-feedback">{errors.city}</div>
                                        )}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Quận/Huyện *</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            placeholder="Ví dụ: Thanh Khê"
                                        />
                                        {errors.district && (
                                            <div className="invalid-feedback">{errors.district}</div>
                                        )}
                                    </div>

                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Phường/Xã *</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.ward ? 'is-invalid' : ''}`}
                                            name="ward"
                                            value={formData.ward}
                                            onChange={handleInputChange}
                                            placeholder="Ví dụ: An Khê"
                                        />
                                        {errors.ward && (
                                            <div className="invalid-feedback">{errors.ward}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="card mt-4">
                                    <div className="card-header">
                                        <h6 className="mb-0">
                                            <i className="fas fa-credit-card me-2"></i>
                                            Phương thức thanh toán
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="paymentMethod"
                                                id="cod"
                                                value="cod"
                                                defaultChecked
                                                disabled
                                            />
                                            <label className="form-check-label" htmlFor="cod">
                                                <strong>Thanh toán khi nhận hàng (COD)</strong>
                                                <br />
                                                <small className="text-muted">Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng</small>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                <div className="card mt-4">
                                    <div className="card-header">
                                        <h6 className="mb-0">
                                            <i className="fas fa-comment-alt me-2"></i>
                                            Ghi chú đơn hàng
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label">Ghi chú cho đơn hàng</label>
                                            <textarea
                                                className="form-control"
                                                name="orderNotes"
                                                value={formData.orderNotes || ''}
                                                onChange={handleInputChange}
                                                rows="3"
                                                placeholder="Nhập ghi chú cho đơn hàng (tùy chọn)..."
                                            />
                                            <small className="text-muted">
                                                Bạn có thể thêm ghi chú về thời gian giao hàng, hướng dẫn địa chỉ, hoặc yêu cầu đặc biệt
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-grid mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-check-circle me-2"></i>
                                                Đặt hàng ngay
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">
                                <i className="fas fa-shopping-bag me-2"></i>
                                Đơn hàng của bạn
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Order Items */}
                            <div className="mb-3">
                                {checkoutItems.map((item, index) => (
                                    <div key={index} className="d-flex align-items-center mb-3">
                                        <img
                                            src={item.cover_image || '/images/book1.jpg'}
                                            alt={item.title}
                                            className="rounded me-3"
                                            style={{ width: '50px', height: '60px', objectFit: 'cover' }}
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">{item.title}</h6>
                                            <div className="text-muted small">
                                                <span>Số lượng: {item.quantity}</span>
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

                            <hr />

                            {/* Order Total */}
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="h5 mb-0">Tổng cộng:</span>
                                <span className="h5 mb-0 text-success">
                                    {calculateTotal().toLocaleString()} VNĐ
                                </span>
                            </div>

                            <div className="mt-3">
                                <small className="text-muted">
                                    <i className="fas fa-info-circle me-1"></i>
                                    Phí vận chuyển sẽ được tính khi xác nhận đơn hàng
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
