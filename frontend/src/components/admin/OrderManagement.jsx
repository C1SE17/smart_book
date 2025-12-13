import React, { useState, useEffect, useMemo, useCallback } from 'react';
import apiService from '../../services/api';
import { useTranslation } from 'react-i18next';

const REVENUE_STATUSES = ['paid', 'shipped', 'completed'];
const MONTH_FILTERS = [
    { value: 'all', labelKey: 'all' },
    { value: '1', labelKey: '1' },
    { value: '2', labelKey: '2' },
    { value: '3', labelKey: '3' },
    { value: '4', labelKey: '4' },
    { value: '5', labelKey: '5' },
    { value: '6', labelKey: '6' },
    { value: '7', labelKey: '7' },
    { value: '8', labelKey: '8' },
    { value: '9', labelKey: '9' },
    { value: '10', labelKey: '10' },
    { value: '11', labelKey: '11' },
    { value: '12', labelKey: '12' },
];

const STATUS_BADGE_CLASSES = {
    pending: 'bg-warning',
    paid: 'bg-primary',
    completed: 'bg-success',
    shipped: 'bg-info',
    cancelled: 'bg-danger'
};

const ORDER_TYPE_BADGES = {
    cart: 'bg-info',
    instant: 'bg-secondary'
};

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
        totalRevenueSuccessful: 0,
        totalOrders: 0,
        pendingOrders: 0,
        paidOrders: 0,
        shippedOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0
    });
    const [allOrders, setAllOrders] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');

    // Multiple selection states
    const [selectedOrders, setSelectedOrders] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0
            }),
        [locale]
    );

    const formatCurrency = useCallback((amount) => currencyFormatter.format(Number(amount || 0)), [currencyFormatter]);
    const formatDateTimeWithLocale = useCallback(
        (value, options) => {
            if (!value) {
                return '';
            }
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) {
                return '';
            }
            return date.toLocaleString(locale, options);
        },
        [locale]
    );
    const getFallbackUserName = useCallback((id) => t('orderManagement.fallback.user', { id }), [t]);
    const getFallbackBookTitle = useCallback((id) => t('orderManagement.modal.items.fallbackTitle', { id }), [t]);

    const monthOptions = useMemo(
        () =>
            MONTH_FILTERS.map(option => ({
                value: option.value,
                label: t(`orderManagement.filters.months.${option.labelKey}`)
            })),
        [t]
    );

    const statusLabelMap = useMemo(() => ({
        pending: t('orderManagement.statuses.pending'),
        paid: t('orderManagement.statuses.paid'),
        shipped: t('orderManagement.statuses.shipped'),
        completed: t('orderManagement.statuses.completed'),
        cancelled: t('orderManagement.statuses.cancelled')
    }), [t]);

    const statusSelectOptions = useMemo(
        () =>
            Object.keys(STATUS_BADGE_CLASSES).map(status => ({
                value: status,
                text: statusLabelMap[status] || status
            })),
        [statusLabelMap]
    );

    const adminErrorMessages = useMemo(
        () => [
            t('orderManagement.errors.notAdmin'),
            t('orderManagement.errors.notAdminGeneric'),
            t('orderManagement.errors.updateNotAllowed'),
            t('orderManagement.errors.viewNotAllowed')
        ],
        [t]
    );

    const isAdminError = error ? adminErrorMessages.includes(error) : false;

    const orderTypeLabel = useCallback(
        (type) => (type === 'cart'
            ? t('orderManagement.orderTypes.cart')
            : t('orderManagement.orderTypes.instant')),
        [t]
    );

    const getOrderTypeBadgeClass = useCallback(
        (type) => ORDER_TYPE_BADGES[type] || ORDER_TYPE_BADGES.instant,
        []
    );

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);

        try {
            // Check if user is admin before calling admin API
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) {
                setError(t('orderManagement.errors.notLoggedIn'));
                setLoading(false);
                return;
            }

            if (user.role !== 'admin') {
                setError(t('orderManagement.errors.notAdmin'));
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
                    const customer_name = order.user_name || getFallbackUserName(order.user_id);
                    const customer_phone = order.user_phone || t('orderManagement.table.notAvailable');
                    const customer_email = order.user_email || t('orderManagement.table.notAvailable');

                    console.log(`Using customer name: ${customer_name} for user_id: ${order.user_id}`);

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

                setAllOrders(ordersWithUserDetails);
            } else {
                // Handle specific error cases
                if (allOrdersResponse.message && allOrdersResponse.message.includes('403')) {
                    setError(t('orderManagement.errors.notAdminGeneric'));
                } else {
                    setError(allOrdersResponse.message || t('orderManagement.errors.fetchFailed'));
                }
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            // Handle 403 Forbidden error specifically
            if (err.message && err.message.includes('403')) {
                setError(t('orderManagement.errors.notAdmin'));
            } else {
                setError(t('orderManagement.errors.network'));
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders from real API
    useEffect(() => {
        fetchOrders();
    }, []);

    const getMonthFromDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return null;
        return String(date.getMonth() + 1);
    };

    const getYearFromDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return null;
        return String(date.getFullYear());
    };

    const filterOrders = (ordersList, monthValue, yearValue) => {
        let result = ordersList;
        if (yearValue !== 'all') {
            result = result.filter(order => getYearFromDate(order.created_at) === yearValue);
        }
        if (monthValue !== 'all') {
            result = result.filter(order => getMonthFromDate(order.created_at) === monthValue);
        }
        return result;
    };

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const startYear = 2023;
        const options = [{ value: 'all', label: t('orderManagement.filters.years.all') }];
        for (let year = startYear; year <= currentYear; year++) {
            options.push({ value: String(year), label: t('orderManagement.filters.years.year', { year }) });
        }
        return options;
    }, [t]);

    useEffect(() => {
        const filtered = filterOrders(allOrders, selectedMonth, selectedYear);

        setOrders(filtered);
        setSelectedOrders(new Set());
        setSelectAll(false);

        const total = filtered.length;
        setTotalItems(total);
        const pages = Math.max(1, Math.ceil(total / itemsPerPage));
        setTotalPages(pages);
        if (currentPage > pages) {
            setCurrentPage(1);
        }

        const totalRevenueRecognized = filtered.reduce((sum, order) => {
            const orderTotal = parseFloat(order.total_price || order.total_amount || order.total || order.amount || 0);
            const normalizedStatus = (order.status || '').toLowerCase();
            const shouldCount = REVENUE_STATUSES.includes(normalizedStatus);

            if (!Number.isFinite(orderTotal) || !shouldCount) {
                return sum;
            }

            return sum + orderTotal;
        }, 0);

        setStats({
            totalRevenue: totalRevenueRecognized,
            totalRevenueSuccessful: totalRevenueRecognized,
            totalOrders: filtered.length,
            pendingOrders: filtered.filter(o => o.status === 'pending').length,
            paidOrders: filtered.filter(o => o.status === 'paid').length,
            shippedOrders: filtered.filter(o => o.status === 'shipped').length,
            completedOrders: filtered.filter(o => o.status === 'completed').length,
            cancelledOrders: filtered.filter(o => o.status === 'cancelled').length
        });
    }, [allOrders, selectedMonth, selectedYear, itemsPerPage, currentPage]);

    const handleMonthFilterChange = (event) => {
        setSelectedMonth(event.target.value);
        setCurrentPage(1);
    };

    const handleYearFilterChange = (event) => {
        setSelectedYear(event.target.value);
        setCurrentPage(1);
    };

    const formatDateTimeForExport = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return '';
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const mi = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    };

    const toCsvCell = (value) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'number') return value.toString();
        const str = String(value).replace(/"/g, '""');
        return `"${str}"`;
    };

    const handleExportExcel = () => {
        const filtered = filterOrders(allOrders, selectedMonth, selectedYear);
        if (!filtered.length) {
            alert(t('orderManagement.messages.exportNoData'));
            return;
        }

        const headers = [
            t('orderManagement.export.headers.orderId'),
            t('orderManagement.export.headers.customer'),
            t('orderManagement.export.headers.email'),
            t('orderManagement.export.headers.phone'),
            t('orderManagement.export.headers.orderType'),
            t('orderManagement.export.headers.total'),
            t('orderManagement.export.headers.status'),
            t('orderManagement.export.headers.createdAt')
        ];

        const rows = filtered.map(order => {
            const total = Number(order.total_price || order.total_amount || order.total || order.amount || 0);
            return [
                `#${order.order_id}`,
                order.customer_name || getFallbackUserName(order.user_id),
                order.user_email || '',
                order.customer_phone || '',
                orderTypeLabel(order.order_type),
                total,
                statusLabelMap[order.status] || order.status || '',
                formatDateTimeForExport(order.created_at)
            ];
        });

        const csvLines = [
            headers.map(toCsvCell).join(','),
            ...rows.map(row => row.map(toCsvCell).join(','))
        ].join('\n');

        const blob = new Blob(["\uFEFF" + csvLines], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const monthLabel = selectedMonth === 'all' ? 'all' : `month-${selectedMonth}`;
        const yearLabel = selectedYear === 'all' ? 'all' : `year-${selectedYear}`;
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_${yearLabel}_${monthLabel}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Validation function
    const validateStatusChange = (newStatus) => {
        const errors = {};

        if (!newStatus) {
            errors.status = t('orderManagement.validation.statusRequired');
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
                setError(t('orderManagement.errors.updateNotAllowed'));
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
                setAllOrders(prevOrders =>
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

                setSuccessMessage(t('orderManagement.messages.updateSuccess'));

                // Clear success message after 3 seconds
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(response.message || t('orderManagement.errors.updateFailed'));
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            setError(t('orderManagement.errors.updateFailed'));
        }
    };

    const handleViewDetails = async (order) => {
        try {
            setError(null);

            // Check if user is admin before calling admin API
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user || user.role !== 'admin') {
                setError(t('orderManagement.errors.viewNotAllowed'));
                return;
            }

            // Fetch detailed order information including items (admin API)
            const response = await apiService.getAdminOrderDetails(order.order_id);

            if (response.success) {
                // Fetch user details for the order
                console.log(`Fetching user details for order ${order.order_id}, user_id: ${order.user_id}`);
                const userResponse = await apiService.getUserById(order.user_id);
                console.log(`User response for order ${order.order_id}:`, userResponse);

                let customer_name = getFallbackUserName(order.user_id);
                let customer_phone = t('orderManagement.table.notAvailable');
                let customer_email = t('orderManagement.table.notAvailable');

                if (userResponse.success && userResponse.data) {
                    customer_name = userResponse.data.name || userResponse.data.fullName || getFallbackUserName(order.user_id);
                    customer_phone = userResponse.data.phone || t('orderManagement.table.notAvailable');
                    customer_email = userResponse.data.email || t('orderManagement.table.notAvailable');
                    console.log(`Successfully resolved customer name: ${customer_name} for order ${order.order_id}`);
                } else {
                    console.log(`Failed to get user details for order ${order.order_id}`, userResponse);
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
                    customer_name: order.user_name || getFallbackUserName(order.user_id),
                    customer_phone: order.user_phone || t('orderManagement.table.notAvailable'),
                    customer_email: order.user_email || t('orderManagement.table.notAvailable')
                };

                setSelectedOrder(fallbackOrderData);
                setShowDetailModal(true);
                setError(t('orderManagement.messages.partialOrderLoaded'));
            }
        } catch (error) {
            console.error('Error fetching order details:', error);

            // Show detailed error message
            let errorMessage = t('orderManagement.errors.detailsGeneric');

            if (error.message && error.message.includes('404')) {
                errorMessage = t('orderManagement.errors.detailsNotFound');
            } else if (error.message && error.message.includes('403')) {
                errorMessage = t('orderManagement.errors.viewNotAllowed');
            } else if (error.message && error.message.includes('500')) {
                errorMessage = t('orderManagement.errors.server');
            } else if (error.message) {
                errorMessage = t('orderManagement.errors.detailsWithMessage', { message: error.message });
            }

            setError(errorMessage);

            // Try fallback with existing order data
            try {
                console.log('Trying fallback with existing order data');
                const fallbackOrderData = {
                    ...order,
                    items: [], // No items available from fallback
                    customer_name: order.user_name || getFallbackUserName(order.user_id),
                    customer_phone: order.user_phone || t('orderManagement.table.notAvailable'),
                    customer_email: order.user_email || t('orderManagement.table.notAvailable')
                };

                setSelectedOrder(fallbackOrderData);
                setShowDetailModal(true);
                setError(t('orderManagement.messages.partialOrderLoaded'));
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                setError(t('orderManagement.errors.detailsGeneric'));
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
        if (!window.confirm(t('orderManagement.confirm.deleteSingle'))) {
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

                setSuccessMessage(t('orderManagement.messages.deleteSuccess'));
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(response.message || t('orderManagement.errors.deleteFailed'));
            }
        } catch (err) {
            console.error('Error deleting order:', err);
            setError(t('orderManagement.errors.deleteFailed'));
        } finally {
            setLoading(false);
        }
    };

    // Handle delete multiple orders
    const handleDeleteMultiple = async () => {
        if (selectedOrders.size === 0) {
            alert(t('orderManagement.confirm.selectAtLeastOne'));
            return;
        }

        if (!window.confirm(t('orderManagement.confirm.deleteMultiple', { count: selectedOrders.size }))) {
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

                setSuccessMessage(t('orderManagement.messages.deleteMultipleSuccess', { success: successCount, total: selectedOrders.size }));
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(t('orderManagement.errors.deleteNone'));
            }
        } catch (err) {
            console.error('Error deleting orders:', err);
            setError(t('orderManagement.errors.deleteFailed'));
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const className = STATUS_BADGE_CLASSES[status] || 'bg-secondary';
        const label = statusLabelMap[status] || t('orderManagement.statuses.unknown', { status });

        return (
            <span className={`badge ${className} px-2 py-1`}>
                {label}
            </span>
        );
    };

    const getStatusOptions = (currentStatus) => {
        return statusSelectOptions.filter(status => status.value !== currentStatus);
    };

    // Pagination functions
    const handlePageChange = (page) => {
        setCurrentPage(page);
        setSelectAll(false);
        setSelectedOrders(new Set());
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
        setSelectAll(false);
        setSelectedOrders(new Set());
    };

    // Get current page orders
    const getCurrentPageOrders = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return orders.slice(startIndex, endIndex);
    };

    // Get page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

    const startItemIndex = totalItems === 0 ? 0 : ((currentPage - 1) * itemsPerPage) + 1;
    const endItemIndex = totalItems === 0 ? 0 : Math.min(currentPage * itemsPerPage, totalItems);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">{t('orderManagement.loading.aria')}</span>
                    </div>
                    <p className="text-muted">{t('orderManagement.loading.message')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-3">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="fw-bold text-dark mb-1">{t('orderManagement.title')}</h1>
                    <p className="text-muted mb-0">{t('orderManagement.subtitle')}</p>
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
                        {t('orderManagement.buttons.refresh')}
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        onClick={handleDeleteMultiple}
                        disabled={loading || selectedOrders.size === 0}
                        title={
                            selectedOrders.size === 0
                                ? t('orderManagement.buttons.deleteSelectedTooltipEmpty')
                                : t('orderManagement.buttons.deleteSelectedTooltip', { count: selectedOrders.size })
                        }
                    >
                        <i className="fas fa-trash me-2"></i>
                        {t('orderManagement.buttons.deleteSelected', { count: selectedOrders.size })}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                    {isAdminError && (
                        <div className="mt-2">
                            <div className="mb-2">
                                <small className="text-muted">
                                    <i className="fas fa-lightbulb me-1"></i>
                                    <strong>{t('orderManagement.errorHelp.title')}</strong> {t('orderManagement.errorHelp.description')}
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
                                {t('orderManagement.errorHelp.loginAdmin')}
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                    // Redirect to home page
                                    window.location.href = '/';
                                }}
                            >
                                <i className="fas fa-home me-1"></i>
                                {t('orderManagement.errorHelp.backHome')}
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
                            <strong>{t('orderManagement.info.title')}</strong> {t('orderManagement.info.message', {
                                status: statusLabelMap.pending,
                                button: t('orderManagement.buttons.refresh')
                            })}
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
                            <p className="text-muted mb-0 small">{statusLabelMap.pending}</p>
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
                            <p className="text-muted mb-0 small">{statusLabelMap.paid}</p>
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
                            <p className="text-muted mb-0 small">{statusLabelMap.shipped}</p>
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
                            <p className="text-muted mb-0 small">{statusLabelMap.completed}</p>
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
                            <p className="text-muted mb-0 small">{statusLabelMap.cancelled}</p>
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
                            <p className="text-muted mb-0 small">{t('orderManagement.cards.total')}</p>
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
                                {t('orderManagement.revenue.title')}
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
                                            <p className="text-muted mb-0 small">{t('orderManagement.revenue.cards.totalRevenue')}</p>
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
                                            <p className="text-muted mb-0 small">{t('orderManagement.revenue.cards.totalOrders')}</p>
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
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold text-dark mb-0">
                            <i className="fas fa-list me-2 text-secondary"></i>
                            {t('orderManagement.table.title')}
                        </h5>
                        <div className="d-flex align-items-center gap-3 flex-wrap justify-content-end">
                            <button
                                className="btn btn-sm btn-outline-success"
                                onClick={handleExportExcel}
                                disabled={orders.length === 0}
                                title={t('orderManagement.buttons.exportTooltip')}
                            >
                                <i className="fas fa-file-excel me-1"></i>
                                {t('orderManagement.buttons.exportCsv')}
                            </button>
                            <div className="d-flex align-items-center">
                                <label className="form-label me-2 mb-0 small">{t('orderManagement.filters.year')}:</label>
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: '120px' }}
                                    value={selectedYear}
                                    onChange={handleYearFilterChange}
                                >
                                    {yearOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-flex align-items-center">
                                <label className="form-label me-2 mb-0 small">{t('orderManagement.filters.month')}:</label>
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: '120px' }}
                                    value={selectedMonth}
                                    onChange={handleMonthFilterChange}
                                >
                                    {monthOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-flex align-items-center">
                                <label className="form-label me-2 mb-0 small">{t('orderManagement.filters.itemsPerPage')}:</label>
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: '80px' }}
                                    value={itemsPerPage}
                                    onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>
                            <div className="text-muted small">
                                {t('orderManagement.pagination.summary', {
                                    start: startItemIndex,
                                    end: endItemIndex,
                                    total: totalItems
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0 align-middle text-center" style={{ tableLayout: 'fixed', width: '100%' }}>
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: '40px' }}>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={selectAll}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th style={{ width: '80px' }}>{t('orderManagement.table.headers.orderId')}</th>
                                    <th style={{ width: '200px' }}>{t('orderManagement.table.headers.customer')}</th>
                                    <th style={{ width: '220px' }}>{t('orderManagement.table.headers.contact')}</th>
                                    <th style={{ width: '120px' }}>{t('orderManagement.table.headers.orderType')}</th>
                                    <th style={{ width: '120px' }}>{t('orderManagement.table.headers.total')}</th>
                                    <th style={{ width: '150px' }}>{t('orderManagement.table.headers.status')}</th>
                                    <th style={{ width: '180px' }}>{t('orderManagement.table.headers.createdAt')}</th>
                                    <th style={{ width: '150px' }}>{t('orderManagement.table.headers.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCurrentPageOrders().length > 0 ? getCurrentPageOrders().map((order, index) => (
                                    <tr key={`order-${order.order_id}-${index}`} className="border-0">
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedOrders.has(order.order_id)}
                                                onChange={() => handleOrderSelect(order.order_id)}
                                            />
                                        </td>
                                        <td className="fw-bold">#{order.order_id}</td>
                                        <td>
                                            <div className="fw-medium text-dark">{order.customer_name || getFallbackUserName(order.user_id)}</div>
                                            <div className="text-muted small text-truncate" title={order.shipping_address || t('orderManagement.table.noAddress')}>
                                                {order.shipping_address || t('orderManagement.table.noAddress')}
                                            </div>
                                        </td>
                                        <td>
                                            <div>{order.user_email || t('orderManagement.table.notAvailable')}</div>
                                            <div className="text-muted small">{order.customer_phone || t('orderManagement.table.notAvailable')}</div>
                                        </td>
                                        <td>
                                            <span className={`badge ${getOrderTypeBadgeClass(order.order_type)}`}>
                                                {orderTypeLabel(order.order_type)}
                                            </span>
                                        </td>
                                        <td className="fw-bold text-end">{formatCurrency(order.total_price || 0)}</td>
                                        <td>
                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                {getStatusBadge(order.status)}
                                                <select
                                                    className="form-select form-select-sm"
                                                    style={{ width: '110px' }}
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                                >
                                                    {getStatusOptions(order.status).map(option => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.text}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="text-muted small">
                                            {order.created_at
                                                ? new Date(order.created_at).toLocaleString(locale)
                                                : t('orderManagement.table.notAvailable')}
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-2">
                                                <button className="btn btn-outline-primary btn-sm" onClick={() => handleViewDetails(order)}>
                                                    <i className="fas fa-eye me-1"></i>{t('orderManagement.table.actions.view')}
                                                </button>
                                                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteOrder(order.order_id)} disabled={loading}>
                                                    <i className="fas fa-trash me-1"></i>{t('orderManagement.table.actions.delete')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="9" className="text-center text-muted py-4">
                                            <i className="fas fa-inbox fa-2x mb-2"></i>
                                            <div>{t('orderManagement.table.empty')}</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="text-muted small">
                        {t('orderManagement.pagination.summary', {
                            start: ((currentPage - 1) * itemsPerPage) + 1,
                            end: Math.min(currentPage * itemsPerPage, totalItems),
                            total: totalItems
                        })}
                    </div>
                    <nav aria-label="Page navigation">
                        <ul className="pagination pagination-sm mb-0">
                            {/* First page button */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    title={t('orderManagement.pagination.first')}
                                >
                                    <i className="fas fa-angle-double-left"></i>
                                </button>
                            </li>

                            {/* Previous button */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    title={t('orderManagement.pagination.previous')}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>
                            </li>

                            {/* Page numbers */}
                            {getPageNumbers().map(page => (
                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}

                            {/* Next button */}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    title={t('orderManagement.pagination.next')}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </li>

                            {/* Last page button */}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    title={t('orderManagement.pagination.last')}
                                >
                                    <i className="fas fa-angle-double-right"></i>
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
                                    {t('orderManagement.modal.title', {
                                        order: orders.findIndex(o => o.order_id === selectedOrder.order_id) + 1
                                    })}
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
                                        <h6 className="fw-bold">{t('orderManagement.modal.customer.heading')}</h6>
                                        <p>
                                            <strong>{t('orderManagement.modal.customer.name')}</strong>{' '}
                                            {selectedOrder.customer_name || getFallbackUserName(selectedOrder.user_id)}
                                        </p>
                                        <p>
                                            <strong>{t('orderManagement.modal.customer.email')}</strong>{' '}
                                            {selectedOrder.customer_email || selectedOrder.user_email || t('orderManagement.table.notAvailable')}
                                        </p>
                                        <p>
                                            <strong>{t('orderManagement.modal.customer.phone')}</strong>{' '}
                                            {selectedOrder.customer_phone || t('orderManagement.table.notAvailable')}
                                        </p>
                                        <p>
                                            <strong>{t('orderManagement.modal.customer.address')}</strong><br />
                                            {selectedOrder.shipping_address || t('orderManagement.table.noAddress')}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold">{t('orderManagement.modal.order.heading')}</h6>
                                        <p><strong>{t('orderManagement.modal.order.status')}</strong> {getStatusBadge(selectedOrder.status)}</p>
                                        <p>
                                            <strong>{t('orderManagement.modal.order.createdAt')}</strong>{' '}
                                            {formatDateTimeWithLocale(selectedOrder.created_at, {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            }) || t('orderManagement.table.notAvailable')}
                                        </p>
                                        <p>
                                            <strong>{t('orderManagement.modal.order.updatedAt')}</strong>{' '}
                                            {formatDateTimeWithLocale(selectedOrder.updated_at, {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            }) || t('orderManagement.table.notAvailable')}
                                        </p>
                                        <p>
                                            <strong>{t('orderManagement.modal.order.total')}</strong>{' '}
                                            <span className="fw-bold text-primary">{formatCurrency(selectedOrder.total_price || 0)}</span>
                                        </p>
                                    </div>
                                </div>

                                <hr />

                                <h6 className="fw-bold">{t('orderManagement.modal.items.heading')}</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>{t('orderManagement.modal.items.columns.title')}</th>
                                                <th className="text-center">{t('orderManagement.modal.items.columns.quantity')}</th>
                                                <th className="text-end">{t('orderManagement.modal.items.columns.price')}</th>
                                                <th className="text-end">{t('orderManagement.modal.items.columns.subtotal')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                                selectedOrder.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.book_title || getFallbackBookTitle(item.book_id)}</td>
                                                        <td className="text-center">{item.quantity}</td>
                                                        <td className="text-end">{formatCurrency(item.price_at_order || item.price || 0)}</td>
                                                        <td className="text-end fw-bold">{formatCurrency((item.price_at_order || item.price || 0) * item.quantity)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-muted">{t('orderManagement.modal.items.empty')}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colSpan="3">{t('orderManagement.modal.items.total')}</th>
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
                                    {t('Close')}
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
