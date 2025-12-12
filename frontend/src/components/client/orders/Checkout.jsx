import React, { useState, useEffect } from 'react';
import apiService from '../../../services/api';
import addressApi from '../../../services/addressApi';
import { useLanguage } from '../../../contexts/LanguageContext';

const Checkout = ({ onBackToHome, onNavigateTo }) => {
    const { t } = useLanguage();
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [useDefaultAddress, setUseDefaultAddress] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        district: '',
        ward: '',
        orderNotes: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Address API states
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    const [addressInputRef, setAddressInputRef] = useState(null);
    const [googleAutocomplete, setGoogleAutocomplete] = useState(null);

    // Check user role and prevent admin from ordering
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user && user.role === 'admin') {
            if (window.showToast) {
                window.showToast(t('checkout.messages.adminRestriction'), 'error');
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

    // Load provinces on component mount
    useEffect(() => {
        const loadProvinces = async () => {
            setLoadingProvinces(true);
            try {
                const data = await addressApi.getProvinces();
                setProvinces(data);
            } catch (error) {
                console.error('Error loading provinces:', error);
            } finally {
                setLoadingProvinces(false);
            }
        };
        loadProvinces();
    }, []);

    // Initialize Google Places Autocomplete when address input is available
    useEffect(() => {
        if (addressInputRef && !useDefaultAddress && window.google && window.google.maps) {
            const autocomplete = addressApi.initGooglePlacesAutocomplete(
                addressInputRef,
                async (addressData) => {
                    // Auto-fill address field
                    setFormData(prev => ({
                        ...prev,
                        address: addressData.streetAddress || addressData.formattedAddress
                    }));

                    // Try to match and fill city, district, ward
                    if (addressData.city) {
                        const matchedProvince = await addressApi.findMatchingProvince(addressData.city);
                        if (matchedProvince) {
                            // Load districts for matched province first
                            setLoadingDistricts(true);
                            try {
                                const districtsData = await addressApi.getDistricts(matchedProvince.code);
                                setDistricts(districtsData);

                                // Update city in formData
                                setFormData(prev => ({
                                    ...prev,
                                    city: matchedProvince.name
                                }));

                                // Try to match district
                                if (addressData.district && districtsData.length > 0) {
                                    const matchedDistrict = await addressApi.findMatchingDistrict(
                                        addressData.district,
                                        matchedProvince.code
                                    );
                                    if (matchedDistrict) {
                                        // Load wards for matched district
                                        setLoadingWards(true);
                                        try {
                                            const wardsData = await addressApi.getWards(matchedDistrict.code);
                                            setWards(wardsData);

                                            // Update district in formData
                                            setFormData(prev => ({
                                                ...prev,
                                                district: matchedDistrict.name
                                            }));

                                            // Try to match ward
                                            if (addressData.ward && wardsData.length > 0) {
                                                const matchedWard = await addressApi.findMatchingWard(
                                                    addressData.ward,
                                                    matchedDistrict.code
                                                );
                                                if (matchedWard) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        ward: matchedWard.name
                                                    }));
                                                }
                                            }
                                        } catch (error) {
                                            console.error('Error loading wards:', error);
                                        } finally {
                                            setLoadingWards(false);
                                        }
                                    } else {
                                        // District not matched, clear ward
                                        setWards([]);
                                        setFormData(prev => ({
                                            ...prev,
                                            district: '',
                                            ward: ''
                                        }));
                                    }
                                } else {
                                    // No district data, clear district and ward
                                    setWards([]);
                                    setFormData(prev => ({
                                        ...prev,
                                        district: '',
                                        ward: ''
                                    }));
                                }
                            } catch (error) {
                                console.error('Error loading districts:', error);
                            } finally {
                                setLoadingDistricts(false);
                            }
                        }
                    }
                }
            );
            setGoogleAutocomplete(autocomplete);

            return () => {
                if (autocomplete) {
                    window.google.maps.event.clearInstanceListeners(autocomplete);
                }
            };
        }
    }, [addressInputRef, useDefaultAddress]);

    // Load default address from user profile
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user && user.address) {
            // Nếu user chọn dùng địa chỉ mặc định, tự động điền
            if (useDefaultAddress) {
                setFormData(prev => ({
                    ...prev,
                    address: user.address || ''
                }));
            }
        }
    }, [useDefaultAddress]);

    // Calculate total
    const calculateTotal = () => {
        return checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Handle address type selection
    const handleAddressTypeChange = (e) => {
        const useDefault = e.target.value === 'default';
        setUseDefaultAddress(useDefault);

        if (useDefault) {
            // Load địa chỉ mặc định từ profile
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (user && user.address) {
                setFormData(prev => ({
                    ...prev,
                    address: user.address || ''
                }));
            }
        } else {
            // Clear form khi chọn địa chỉ mới
            setFormData(prev => ({
                ...prev,
                address: '',
                city: '',
                district: '',
                ward: ''
            }));
            // Clear districts and wards when switching to new address
            setDistricts([]);
            setWards([]);
        }

        // Clear errors
        setErrors({});
    };

    // Handle city selection - load districts
    const handleCityChange = async (e) => {
        const provinceCode = e.target.value;
        
        // Nếu user bắt đầu chỉnh sửa, tự động chuyển sang "địa chỉ mới"
        if (useDefaultAddress) {
            setUseDefaultAddress(false);
        }

        // Find selected province - handle both string and number code
        const selectedProvince = provinces.find(p => 
            String(p.code) === String(provinceCode) || 
            p.code === provinceCode ||
            p.code === parseInt(provinceCode, 10)
        );

        setFormData(prev => ({
            ...prev,
            city: selectedProvince ? (selectedProvince.name || selectedProvince.name_with_type) : '',
            district: '',
            ward: ''
        }));

        // Clear districts and wards when city changes
        setDistricts([]);
        setWards([]);

        // Load districts if province is selected
        if (provinceCode) {
            setLoadingDistricts(true);
            try {
                const districtsData = await addressApi.getDistricts(provinceCode);
                setDistricts(districtsData || []);
            } catch (error) {
                console.error('Error loading districts:', error);
                setDistricts([]);
            } finally {
                setLoadingDistricts(false);
            }
        }

        // Clear error when user selects
        if (errors.city) {
            setErrors(prev => ({
                ...prev,
                city: '',
                district: '',
                ward: ''
            }));
        }
    };

    // Handle district selection - load wards
    const handleDistrictChange = async (e) => {
        const districtCode = e.target.value;
        
        // Nếu user bắt đầu chỉnh sửa, tự động chuyển sang "địa chỉ mới"
        if (useDefaultAddress) {
            setUseDefaultAddress(false);
        }

        // Find selected district - handle both string and number code
        const selectedDistrict = districts.find(d => 
            String(d.code) === String(districtCode) || 
            d.code === districtCode ||
            d.code === parseInt(districtCode, 10)
        );

        setFormData(prev => ({
            ...prev,
            district: selectedDistrict ? (selectedDistrict.name || selectedDistrict.name_with_type) : '',
            ward: ''
        }));

        // Clear wards when district changes
        setWards([]);

        // Load wards if district is selected
        if (districtCode) {
            setLoadingWards(true);
            try {
                const wardsData = await addressApi.getWards(districtCode);
                setWards(wardsData || []);
            } catch (error) {
                console.error('Error loading wards:', error);
                setWards([]);
            } finally {
                setLoadingWards(false);
            }
        }

        // Clear error when user selects
        if (errors.district) {
            setErrors(prev => ({
                ...prev,
                district: '',
                ward: ''
            }));
        }
    };

    // Handle ward selection
    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        
        // Nếu user bắt đầu chỉnh sửa, tự động chuyển sang "địa chỉ mới"
        if (useDefaultAddress) {
            setUseDefaultAddress(false);
        }

        // Find selected ward - handle both string and number code
        const selectedWard = wards.find(w => 
            String(w.code) === String(wardCode) || 
            w.code === wardCode ||
            w.code === parseInt(wardCode, 10)
        );

        setFormData(prev => ({
            ...prev,
            ward: selectedWard ? (selectedWard.name || selectedWard.name_with_type) : ''
        }));

        // Clear error when user selects
        if (errors.ward) {
            setErrors(prev => ({
                ...prev,
                ward: ''
            }));
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Nếu user bắt đầu chỉnh sửa, tự động chuyển sang "địa chỉ mới"
        if (useDefaultAddress && (name === 'address' || name === 'orderNotes')) {
            setUseDefaultAddress(false);
        }

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

        // Nếu dùng địa chỉ mặc định, chỉ cần kiểm tra address có tồn tại không
        if (useDefaultAddress) {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user || !user.address || !user.address.trim()) {
                newErrors.address = t('checkout.validation.noDefaultAddress');
            }
        } else {
            // Validation cho địa chỉ chi tiết (khi nhập mới)
            if (!formData.address.trim()) {
                newErrors.address = t('checkout.validation.addressRequired');
            } else {
                const trimmedAddress = formData.address.trim();
                if (trimmedAddress.length < 10) {
                    newErrors.address = t('checkout.validation.addressMin');
                } else {
                    // Kiểm tra địa chỉ hợp lệ: phải có ít nhất một ký tự chữ cái
                    const hasValidChars = /[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ]/.test(trimmedAddress);
                    if (!hasValidChars) {
                        newErrors.address = t('checkout.validation.addressInvalid');
                    }
                }
            }

            // Validation cho tỉnh/thành phố
            if (!formData.city.trim()) {
                newErrors.city = t('checkout.validation.cityRequired');
            }

            // Validation cho quận/huyện
            if (!formData.district.trim()) {
                newErrors.district = t('checkout.validation.districtRequired');
            }

            // Validation cho phường/xã
            if (!formData.ward.trim()) {
                newErrors.ward = t('checkout.validation.wardRequired');
            }
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
            alert(t('checkout.messages.cartEmpty'));
            return;
        }

        setIsSubmitting(true);

        // Get current user and validate - moved outside try block for scope access
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) {
            alert(t('checkout.messages.loginRequired'));
            onNavigateTo('auth');
            setIsSubmitting(false);
            return;
        }

        // Check if user has valid token
        const token = localStorage.getItem('token');
        if (!token) {
            alert(t('checkout.messages.sessionExpired'));
            onNavigateTo('auth');
            setIsSubmitting(false);
            return;
        }

        console.log('User:', user);
        console.log('Token exists:', !!token);
        console.log('Checkout items:', checkoutItems);

        // Prepare order data for API - use structured shipping address
        let shippingAddress;
        if (useDefaultAddress) {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            shippingAddress = user?.address || formData.address;
        } else {
            shippingAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`;
        }
        
        // Check if items have cart_item_id (from cart) or just book_id (buy now)
        const hasCartItemIds = checkoutItems.some(item => item.cart_item_id);
        const hasCartSource = checkoutItems.some(item => item.source === 'cart');

        try {
            console.log('Checkout items:', checkoutItems);
            console.log('Has cart item IDs:', hasCartItemIds);
            
            let response;
            let orderId = null;
            
            if (hasCartItemIds) {
                // Items from cart - use checkout API
                const orderData = {
                    selected_cart_item_ids: checkoutItems.map(item => item.book_id), // Use book_id as cart_item_id
                    shipping_address: shippingAddress,
                    // Thêm thông tin về số lượng để backend biết
                    items_info: checkoutItems.map(item => ({
                        book_id: item.book_id,
                        quantity: item.quantity || 1,
                        price: item.price || 0
                    }))
                };
                
                console.log('Checkout data:', orderData);
                response = await apiService.createOrder(orderData);
                
                if (response.success && response.data) {
                    orderId = response.data.order_id;
                }
            } else {
                // Buy now - create single order for all items using purchase API
                // For simplicity, we'll create one order per item
                const orderData = {
                    book_id: checkoutItems[0].book_id, // Take first item for now
                    quantity: checkoutItems[0].quantity,
                    shipping_address: shippingAddress
                };
                
                console.log('Purchase data:', orderData);
                response = await apiService.purchase(orderData);
                
                if (response.success && response.data) {
                    orderId = response.data.order_id;
                }
            }
            
            if (response.success && orderId) {
                console.log('Order creation successful:', response);
                console.log('Order ID:', orderId);
                
                const orderData = {
                    id: orderId,
                    order_id: orderId,
                    items: checkoutItems.map(item => ({
                        book_id: item.book_id,
                        title: item.title || item.book_title || 'Unknown Book',
                        book_title: item.title || item.book_title || 'Unknown Book',
                        quantity: item.quantity || 1,
                        price: item.price || 0,
                        price_at_order: item.price || 0
                    })),
                    shippingInfo: {
                        address: formData.address,
                        ward: formData.ward,
                        district: formData.district,
                        city: formData.city
                    },
                    total: calculateTotal(),
                    total_price: calculateTotal(),
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    created_at: new Date().toISOString(),
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
                    ? t('checkout.messages.successWithCart', { count: checkoutItems.length })
                    : t('checkout.messages.success');
                
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
            
            let errorMessage = t('checkout.messages.error');
            
            if (error.message && error.message.includes('403')) {
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                if (user && user.role === 'admin') {
                    errorMessage = t('checkout.messages.adminNoPermission');
                } else {
                    errorMessage = t('checkout.messages.noPermission');
                }
            } else if (error.message && error.message.includes('401')) {
                errorMessage = t('checkout.messages.sessionExpiredShort');
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
                            <h3 className="mb-3">{t('checkout.states.emptyTitle')}</h3>
                            <p className="text-muted mb-4">{t('checkout.states.emptySubtitle')}</p>
                            <button
                                className="btn btn-primary"
                                onClick={onBackToHome}
                            >
                                <i className="fas fa-home me-2"></i>
                                {t('checkout.actions.backHome')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <style>{`
                .checkout-form-label-required {
                    color: red;
                    margin-left: 2px;
                }
            `}</style>
            <div className="row">
                <div className="col-12">
                    <div className="d-flex align-items-center mb-4">
                        <button
                            className="btn btn-outline-secondary me-3"
                            onClick={onBackToHome}
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <h2 className="mb-0">{t('checkout.sections.title')}</h2>
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
                                {t('checkout.sections.shippingInfo')}
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Address Type Selection */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold">{t('checkout.form.addressType')}</label>
                                    <div className="d-flex gap-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="addressType"
                                                id="addressTypeDefault"
                                                value="default"
                                                checked={useDefaultAddress}
                                                onChange={handleAddressTypeChange}
                                            />
                                            <label className="form-check-label" htmlFor="addressTypeDefault">
                                                {t('checkout.form.useDefaultAddress')}
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="addressType"
                                                id="addressTypeNew"
                                                value="new"
                                                checked={!useDefaultAddress}
                                                onChange={handleAddressTypeChange}
                                            />
                                            <label className="form-check-label" htmlFor="addressTypeNew">
                                                {t('checkout.form.useNewAddress')}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* City, District, Ward - Only required when using new address */}
                                {!useDefaultAddress && (
                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">
                                                {t('checkout.form.city').replace(' *', '')}
                                                <span className="checkout-form-label-required">*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                                                value={(() => {
                                                    if (!formData.city || provinces.length === 0) return '';
                                                    const matched = provinces.find(p => 
                                                        p.name === formData.city || 
                                                        p.name_with_type === formData.city ||
                                                        formData.city.includes(p.name) ||
                                                        p.name.includes(formData.city)
                                                    );
                                                    return matched ? matched.code : '';
                                                })()}
                                                onChange={handleCityChange}
                                                disabled={loadingProvinces}
                                            >
                                                <option value="">
                                                    {loadingProvinces 
                                                        ? t('checkout.form.loading') || 'Đang tải...' 
                                                        : t('checkout.form.selectCity') || 'Chọn tỉnh/thành phố'}
                                                </option>
                                                {provinces.map(province => (
                                                    <option key={province.code} value={String(province.code)}>
                                                        {province.name || province.name_with_type}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.city && (
                                                <div className="invalid-feedback">{errors.city}</div>
                                            )}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">
                                                {t('checkout.form.district').replace(' *', '')}
                                                <span className="checkout-form-label-required">*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.district ? 'is-invalid' : ''}`}
                                                value={(() => {
                                                    if (!formData.district || districts.length === 0) return '';
                                                    const matched = districts.find(d => 
                                                        d.name === formData.district || 
                                                        d.name_with_type === formData.district ||
                                                        formData.district.includes(d.name) ||
                                                        d.name.includes(formData.district)
                                                    );
                                                    return matched ? String(matched.code) : '';
                                                })()}
                                                onChange={handleDistrictChange}
                                                disabled={!formData.city || loadingDistricts}
                                            >
                                                <option value="">
                                                    {!formData.city 
                                                        ? t('checkout.form.selectCityFirst') || 'Chọn tỉnh/thành phố trước'
                                                        : loadingDistricts 
                                                            ? t('checkout.form.loading') || 'Đang tải...'
                                                            : t('checkout.form.selectDistrict') || 'Chọn quận/huyện'}
                                                </option>
                                                {districts.map(district => (
                                                    <option key={district.code} value={String(district.code)}>
                                                        {district.name || district.name_with_type}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.district && (
                                                <div className="invalid-feedback">{errors.district}</div>
                                            )}
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">
                                                {t('checkout.form.ward').replace(' *', '')}
                                                <span className="checkout-form-label-required">*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.ward ? 'is-invalid' : ''}`}
                                                value={(() => {
                                                    if (!formData.ward || wards.length === 0) return '';
                                                    const matched = wards.find(w => 
                                                        w.name === formData.ward || 
                                                        w.name_with_type === formData.ward ||
                                                        formData.ward.includes(w.name) ||
                                                        w.name.includes(formData.ward)
                                                    );
                                                    return matched ? String(matched.code) : '';
                                                })()}
                                                onChange={handleWardChange}
                                                disabled={!formData.district || loadingWards}
                                            >
                                                <option value="">
                                                    {!formData.district 
                                                        ? t('checkout.form.selectDistrictFirst') || 'Chọn quận/huyện trước'
                                                        : loadingWards 
                                                            ? t('checkout.form.loading') || 'Đang tải...'
                                                            : t('checkout.form.selectWard') || 'Chọn phường/xã'}
                                                </option>
                                                {wards.map(ward => (
                                                    <option key={ward.code} value={String(ward.code)}>
                                                        {ward.name || ward.name_with_type}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.ward && (
                                                <div className="invalid-feedback">{errors.ward}</div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Address Fields - Only show when not using default or when editing */}
                                {(!useDefaultAddress || formData.address) && (
                                    <div className="mb-3">
                                        <label className="form-label">
                                            {t('checkout.form.address').replace(' *', '')}
                                            <span className="checkout-form-label-required">*</span>
                                            <small className="text-muted ms-2">
                                                <i className="fas fa-map-marker-alt me-1"></i>
                                                {t('checkout.form.googlePlacesHint') || 'Gõ địa chỉ để tự động điền'}
                                            </small>
                                        </label>
                                        <input
                                            ref={(el) => setAddressInputRef(el)}
                                            type="text"
                                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder={t('checkout.form.addressPlaceholder')}
                                            disabled={useDefaultAddress}
                                            autoComplete="off"
                                        />
                                        {errors.address && (
                                            <div className="invalid-feedback">{errors.address}</div>
                                        )}
                                        <small className="text-muted">
                                            <i className="fas fa-info-circle me-1"></i>
                                            {t('checkout.form.googlePlacesHelp') || 'Nhập địa chỉ và chọn từ gợi ý để tự động điền thông tin'}
                                        </small>
                                    </div>
                                )}

                                {/* Payment Method */}
                                <div className="card mt-4">
                                    <div className="card-header">
                                        <h6 className="mb-0">
                                            <i className="fas fa-credit-card me-2"></i>
                                            {t('checkout.sections.paymentMethod')}
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
                                                <strong>{t('checkout.payment.codLabel')}</strong>
                                                <br />
                                                <small className="text-muted">{t('checkout.payment.codDescription')}</small>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Notes */}
                                <div className="card mt-4">
                                    <div className="card-header">
                                        <h6 className="mb-0">
                                            <i className="fas fa-comment-alt me-2"></i>
                                            {t('checkout.sections.orderNotes')}
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label">{t('checkout.form.orderNotes')}</label>
                                            <textarea
                                                className="form-control"
                                                name="orderNotes"
                                                value={formData.orderNotes || ''}
                                                onChange={handleInputChange}
                                                rows="3"
                                                placeholder={t('checkout.form.orderNotesPlaceholder')}
                                            />
                                            <small className="text-muted">
                                                {t('checkout.form.orderNotesHelp')}
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
                                                {t('checkout.actions.processing')}
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-check-circle me-2"></i>
                                                {t('checkout.actions.placeOrder')}
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
                                {t('checkout.sections.orderSummary')}
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Order Items */}
                            <div className="mb-3">
                                {checkoutItems.map((item, index) => (
                                    <div key={index} className="d-flex align-items-center mb-3">
                                        <img
                                            src={item.cover_image || item.image_url || '/images/book1.jpg'}
                                            alt={item.title || item.book_title}
                                            className="rounded me-3"
                                            style={{ width: '50px', height: '60px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = '/images/book1.jpg';
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">{item.title || item.book_title}</h6>
                                            <div className="text-muted small">
                                                <span>{t('checkout.summary.quantityLabel', { count: item.quantity })}</span>
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
                                <span className="h5 mb-0">{t('checkout.summary.total')}</span>
                                <span className="h5 mb-0 text-success">
                                    {calculateTotal().toLocaleString()} VNĐ
                                </span>
                            </div>

                            <div className="mt-3">
                                <small className="text-muted">
                                    <i className="fas fa-info-circle me-1"></i>
                                    {t('checkout.summary.shippingNotice')}
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
