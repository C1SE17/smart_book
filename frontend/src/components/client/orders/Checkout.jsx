import React, { useState, useEffect } from 'react';

const Checkout = ({ onBackToHome, onNavigateTo }) => {
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        ward: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Vui lòng nhập họ và tên';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

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

        try {
            // Create order data
            const orderData = {
                id: Date.now().toString(),
                items: checkoutItems,
                shippingInfo: formData,
                paymentMethod: 'cod',
                total: calculateTotal(),
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Save to localStorage
            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            existingOrders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(existingOrders));

            // Clear sessionStorage
            sessionStorage.removeItem('checkoutItems');

            // Show success message
            if (window.showToast) {
                window.showToast('Đặt hàng thành công!', 'success');
            }

            // Navigate to orders page
            setTimeout(() => {
                onNavigateTo('orders');
            }, 1500);

        } catch (error) {
            console.error('Error placing order:', error);
            if (window.showToast) {
                window.showToast('Có lỗi xảy ra khi đặt hàng!', 'error');
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
                                <i className="bi bi-cart-x" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                            </div>
                            <h3 className="mb-3">Giỏ hàng trống</h3>
                            <p className="text-muted mb-4">Bạn chưa có sản phẩm nào để thanh toán</p>
                            <button
                                className="btn btn-primary"
                                onClick={onBackToHome}
                            >
                                <i className="bi bi-house me-2"></i>
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
                            <i className="bi bi-arrow-left"></i>
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
                                <i className="bi bi-geo-alt me-2"></i>
                                Thông tin giao hàng
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Họ và tên *</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            placeholder="Nhập họ và tên"
                                        />
                                        {errors.fullName && (
                                            <div className="invalid-feedback">{errors.fullName}</div>
                                        )}
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Số điện thoại *</label>
                                        <input
                                            type="tel"
                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Nhập số điện thoại"
                                        />
                                        {errors.phone && (
                                            <div className="invalid-feedback">{errors.phone}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email *</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Nhập email"
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email}</div>
                                    )}
                                </div>

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
                                            <i className="bi bi-credit-card me-2"></i>
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
                                                <i className="bi bi-check-circle me-2"></i>
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
                                <i className="bi bi-bag me-2"></i>
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
                                    <i className="bi bi-info-circle me-1"></i>
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
