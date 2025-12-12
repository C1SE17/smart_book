import React, { useState, useEffect, useMemo, useCallback } from 'react';
import apiService from '../../../services/api';
import { useLanguage } from '../../../contexts/LanguageContext';

const MyOrders = ({ onBackToHome, onNavigateTo }) => {
    const { t, language } = useLanguage();
    const locale = useMemo(() => (language?.startsWith('en') ? 'en-US' : 'vi-VN'), [language]);
    const currencyFormatter = useMemo(
        () =>
            new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: 'VND'
            }),
        [locale]
    );
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(20);
    
    // Multiple selection states
    const [selectedOrders, setSelectedOrders] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);

    const ordersText = useMemo(() => t('ordersPage', { returnObjects: true }) || {}, [t, language]);
    const headerText = ordersText.header || {};
    const filterText = ordersText.filters || {};
    const messagesText = ordersText.messages || {};
    const emptyText = ordersText.empty || {};
    const cardText = ordersText.card || {};
    const modalText = ordersText.modal || {};
    const modalLabels = modalText.labels || {};
    const tableHeaders = modalText.tableHeaders || {};
    const paginationText = ordersText.pagination || {};
    const statusesText = ordersText.statuses || {};
    const orderTypesText = cardText.orderTypes || {};
    const notificationsText = ordersText.notifications || {};
    const commonText = ordersText.common || {};

    const statusLabels = useMemo(() => ({
        pending: statusesText.pending || 'Pending',
        processing: statusesText.processing || 'Processing',
        paid: statusesText.paid || 'Paid',
        shipped: statusesText.shipped || 'Shipped',
        delivered: statusesText.delivered || 'Delivered',
        completed: statusesText.completed || 'Completed',
        cancelled: statusesText.cancelled || 'Cancelled',
        draft: statusesText.draft || 'Draft'
    }), [statusesText]);

    const statusBadgeClasses = useMemo(() => ({
        pending: 'bg-warning',
        processing: 'bg-primary',
        paid: 'bg-info',
        shipped: 'bg-success',
        delivered: 'bg-success',
        completed: 'bg-success',
        cancelled: 'bg-danger',
        draft: 'bg-secondary'
    }), []);

    const orderTypeLabels = useMemo(() => ({
        cart: orderTypesText.cart || 'From cart',
        buyNow: orderTypesText.buyNow || 'Buy now'
    }), [orderTypesText]);

    const normalizeId = (value) => (value !== undefined && value !== null ? String(value) : '');

    const matchesOrderId = (order, targetId) =>
        normalizeId(order.order_id ?? order.id) === normalizeId(targetId);

    const sortOrdersByTimestamp = (ordersList) => {
        return [...ordersList].sort((a, b) => {
            const dateA = new Date(a.updated_at || a.created_at || a.createdAt || 0);
            const dateB = new Date(b.updated_at || b.created_at || b.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
        });
    };

    const updateLocalStoredOrders = (targetIds, status, updatedAt) => {
        try {
            const normalizedIds = targetIds.map(normalizeId);
            const applyUpdate = (orders) =>
                orders.map(order =>
                    normalizedIds.includes(normalizeId(order.order_id ?? order.id))
                        ? { ...order, status, updated_at: updatedAt }
                        : order
                );

            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (user) {
                const userOrdersKey = `myOrders_${user.user_id}`;
                const userOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
                if (Array.isArray(userOrders) && userOrders.length > 0) {
                    localStorage.setItem(userOrdersKey, JSON.stringify(applyUpdate(userOrders)));
                }
            }

            const globalOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
            if (Array.isArray(globalOrders) && globalOrders.length > 0) {
                localStorage.setItem('myOrders', JSON.stringify(applyUpdate(globalOrders)));
            }
        } catch (storageError) {
            console.error('Error updating local storage orders:', storageError);
        }
    };

    // Fetch orders
    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Get user info
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user) {
                setError(messagesText.loginRequired || 'Please sign in to view orders');
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
                setError(response.message || messagesText.loadFailed || 'Unable to load orders');
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
                    setError(messagesText.loadedFromLocal || 'Loaded orders from local storage (backend unavailable)');
                        return;
                    }
                }
            } catch (fallbackError) {
                console.error('LocalStorage fallback also failed:', fallbackError);
            }
            
            setError(messagesText.genericError || 'Something went wrong while loading orders');
        } finally {
            setLoading(false);
        }
    };

    const isPendingStatus = useCallback((status) => {
        if (!status) return false;
        const normalized = status.toString().toLowerCase();
        return normalized === 'pending' || normalized === 'chờ xử lý';
    }, []);

    const formatTemplate = useCallback((template, replacements = {}) => {
        if (!template) return '';
        let result = template;
        Object.entries(replacements).forEach(([key, value]) => {
            const safeValue = value ?? '';
            result = result.replace(new RegExp(`{{${key}}}`, 'g'), safeValue);
        });
        return result;
    }, []);

    const getDisplayOrderId = useCallback((orderId) => {
        if (typeof orderId === 'number') {
            return orderId.toString();
        }
        if (typeof orderId === 'string' && /^\d+$/.test(orderId)) {
            return orderId;
        }
        return orderId?.toString() || commonText.notAvailable || 'N/A';
    }, [commonText]);

    // Handle cancel order (synchronized with backend)
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm(messagesText.cancelConfirm || 'Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccessMessage('');

            const response = await apiService.cancelMyOrder(orderId);

            if (response.success) {
                const updatedAt = new Date().toISOString();
                setOrders(prevOrders => {
                    const updatedOrders = prevOrders.map(order =>
                        matchesOrderId(order, orderId)
                            ? { ...order, status: 'cancelled', updated_at: updatedAt }
                            : order
                    );
                    return sortOrdersByTimestamp(updatedOrders);
                });

                setSelectedOrders(prev => {
                    const newSelected = new Set(prev);
                    newSelected.delete(normalizeId(orderId));
                    return newSelected;
                });
                setSelectAll(false);

                updateLocalStoredOrders([orderId], 'cancelled', updatedAt);

                window.dispatchEvent(new CustomEvent('orderStatusUpdated', {
                    detail: {
                        orderId,
                        newStatus: 'cancelled',
                        updatedAt
                    }
                }));

                setSuccessMessage(messagesText.cancelSuccess || 'Order cancelled successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(response.message || messagesText.cancelError || 'Unable to cancel this order');
            }
        } catch (err) {
            console.error('Error cancelling order:', err);
            setError(err.message || messagesText.cancelError || 'Unable to cancel this order');
        } finally {
            setLoading(false);
        }
    };

    // Handle individual order selection
    const handleOrderSelect = (orderId) => {
        const normalizedId = normalizeId(orderId);
        setSelectedOrders(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(normalizedId)) {
                newSelected.delete(normalizedId);
            } else {
                newSelected.add(normalizedId);
            }
            
            const deletableOrders = filteredOrders.filter(order => 
                isPendingStatus(order.status)
            );
            const allDeletableIds = deletableOrders.map(order => normalizeId(order.order_id || order.id));
            const allSelected = allDeletableIds.length > 0 && allDeletableIds.every(id => newSelected.has(id));
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
                isPendingStatus(order.status)
            );
            const orderIds = deletableOrders.map(order => normalizeId(order.order_id || order.id));
            setSelectedOrders(new Set(orderIds));
            setSelectAll(orderIds.length > 0);
        }
    };

    // Handle cancel multiple orders
    const handleCancelMultiple = async () => {
        if (selectedOrders.size === 0) {
            alert(messagesText.selectAtLeastOne || 'Please select at least one order to cancel');
            return;
        }

        if (!window.confirm((messagesText.multiCancelConfirm || 'Are you sure you want to cancel {{count}} selected orders?').replace('{{count}}', selectedOrders.size))) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccessMessage('');

            const orderIds = Array.from(selectedOrders);
            const responses = await Promise.all(orderIds.map(id => apiService.cancelMyOrder(id)));

            const successfulIds = [];
            const failedIds = [];

            responses.forEach((response, index) => {
                const targetId = orderIds[index];
                if (response.success) {
                    successfulIds.push(targetId);
                } else {
                    failedIds.push({
                        id: targetId,
                        message: response.message || 'Không rõ lý do'
                    });
                }
            });

            if (successfulIds.length > 0) {
                const updatedAt = new Date().toISOString();
                setOrders(prevOrders => {
                    const updatedOrders = prevOrders.map(order =>
                        successfulIds.some(id => matchesOrderId(order, id))
                            ? { ...order, status: 'cancelled', updated_at: updatedAt }
                            : order
                    );
                    return sortOrdersByTimestamp(updatedOrders);
                });

                updateLocalStoredOrders(successfulIds, 'cancelled', updatedAt);

                successfulIds.forEach(id => {
                    window.dispatchEvent(new CustomEvent('orderStatusUpdated', {
                        detail: {
                            orderId: id,
                            newStatus: 'cancelled',
                            updatedAt
                        }
                    }));
                });

                const successMsgTemplate = messagesText.multiCancelResult || 'Cancelled {{success}}/{{total}} orders.';
                setSuccessMessage(successMsgTemplate.replace('{{success}}', successfulIds.length).replace('{{total}}', orderIds.length));
                setTimeout(() => setSuccessMessage(''), 3000);
            }

            if (failedIds.length > 0) {
                const failedMessage = failedIds
                    .map(item => `#${item.id}: ${item.message}`)
                    .join(', ');
                const failedTemplate = messagesText.multiCancelFailed || 'Failed to cancel {{count}} orders: {{detail}}';
                setError(
                    failedTemplate
                        .replace('{{count}}', failedIds.length)
                        .replace('{{detail}}', failedMessage)
                );
            }

            setSelectedOrders(new Set());
            setSelectAll(false);
        } catch (err) {
            console.error('Error cancelling orders:', err);
            setError(messagesText.cancelError || 'Unable to cancel this order');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        
        // Request notification permission
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
        
        // Listen for order status updates from admin dashboard
        const handleOrderStatusUpdate = (event) => {
            console.log('[MyOrders] Received order status update:', event.detail);
            if (event.detail && event.detail.orderId && event.detail.newStatus) {
                setOrders(prevOrders => {
                    console.log('[MyOrders] Current orders before update:', prevOrders.map(o => ({ 
                        id: o.order_id || o.id, 
                        status: o.status 
                    })));
                    
                    const updatedOrders = prevOrders.map(order => {
                        const orderId = order.order_id || order.id;
                        const eventOrderId = event.detail.orderId;
                        
                        console.log(` [MyOrders] Comparing order ID: ${orderId} (${typeof orderId}) with event ID: ${eventOrderId} (${typeof eventOrderId})`);
                        
                        if (orderId == eventOrderId) { // Use == for type coercion
                            console.log(`[MyOrders] Found matching order ${orderId}, updating status from ${order.status} to ${event.detail.newStatus}`);
                            return { 
                                ...order, 
                                status: event.detail.newStatus,
                                updated_at: event.detail.updatedAt || new Date().toISOString()
                            };
                        }
                        return order;
                    });
                    
                    console.log(' [MyOrders] Orders after update:', updatedOrders.map(o => ({ 
                        id: o.order_id || o.id, 
                        status: o.status 
                    })));
                    
                    // Sort orders to put recently updated ones at the top
                    return updatedOrders.sort((a, b) => {
                        const dateA = new Date(a.updated_at || a.created_at || a.createdAt);
                        const dateB = new Date(b.updated_at || b.created_at || b.createdAt);
                        return dateB.getTime() - dateA.getTime();
                    });
                });
                console.log(`[MyOrders] Updated order ${event.detail.orderId} status to: ${event.detail.newStatus}`);
                
                // Show notification to user
                const statusText = statusLabels[event.detail.newStatus] || event.detail.newStatus;
                
                // Show browser notification if permission granted
                if (Notification.permission === 'granted') {
                    const titleTemplate = notificationsText.browserTitle || 'Order #{{id}}';
                    const bodyTemplate = notificationsText.browserBody || 'Status updated to "{{status}}"';
                    new Notification(titleTemplate.replace('{{id}}', event.detail.orderId), {
                        body: bodyTemplate.replace('{{status}}', statusText),
                        icon: '/favicon.ico'
                    });
                }

                console.log(
                    (notificationsText.consoleLog || 'Order #{{id}} updated to "{{status}}"')
                        .replace('{{id}}', event.detail.orderId)
                        .replace('{{status}}', statusText)
                );
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
        if (filterStatus === 'pending') {
            return isPendingStatus(order.status);
        }
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
        const statusInfo = {
            class: statusBadgeClasses[status] || 'bg-secondary',
            text: statusLabels[status] || status
        };
        return (
            <span className={`badge ${statusInfo.class}`}>
                {statusInfo.text}
            </span>
        );
    };

    const formatCurrency = useCallback(
        (amount) => currencyFormatter.format(amount || 0),
        [currencyFormatter]
    );

    const formatDate = useCallback(
        (dateString) => {
            if (!dateString) return commonText.notAvailable || 'N/A';
            try {
                return new Date(dateString).toLocaleString(locale, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (_) {
                return commonText.notAvailable || 'N/A';
            }
        },
        [locale, commonText]
    );

    // Handle view details
    const handleViewDetails = async (order) => {
        try {
            console.log('Viewing details for order:', order);
            console.log('Order order_id:', order.order_id);
            console.log('Order id:', order.id);
            const orderId = order.order_id || order.id;
            console.log('Order ID to fetch:', orderId);
            
            if (!orderId) {
                console.error('Order ID is undefined:', order);
                return;
            }
            
            const response = await apiService.getMyOrderById(orderId);
            console.log('Order details response:', response);
            console.log('Response success:', response.success);
            console.log('Response data:', response.data);
            console.log('Response data total_price:', response.data?.total_price);
            console.log('Response data items:', response.data?.items);
            
            if (response.success) {
                console.log('Selected order data:', response.data);
                
                // Tính lại total_price nếu nó bằng 0 nhưng có items
                let orderData = response.data;
                if ((orderData.total === 0 || orderData.total_price === 0) && orderData.items && orderData.items.length > 0) {
                    const calculatedTotal = orderData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
                    console.log('Tính lại total_price trong MyOrders:', calculatedTotal);
                    orderData = {
                        ...orderData,
                        total: calculatedTotal,
                        total_price: calculatedTotal
                    };
                }
                
                setSelectedOrder(orderData);
                setShowDetailModal(true);
            } else {
                setError(messagesText.detailError || 'Unable to load order details');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
            setError(messagesText.detailError || 'Unable to load order details');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{commonText.loading || 'Loading...'}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 mt-3">
                <div>
                    <h2 className="fw-bold text-dark">{headerText.title || 'My Orders'}</h2>
                    <p className="text-muted mb-0">{headerText.subtitle || ''}</p>
                </div>
                <div className="d-flex flex-column align-items-end gap-2">
                    <div className="d-flex align-items-center gap-3">
                        <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={fetchOrders}
                            disabled={loading}
                        >
                            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-1`}></i>
                            {headerText.refresh || 'Refresh'}
                        </button>
                        <div className="text-muted">
                            {formatTemplate(headerText.total || 'Total: {{count}} orders', { count: filteredOrders.length })}
                            {totalPages > 1 && (
                                <span className="ms-2">
                                    {formatTemplate(headerText.page || '(Page {{current}}/{{total}})', {
                                        current: currentPage,
                                        total: totalPages
                                    })}
                                </span>
                            )}
                        </div>
                    </div>
                    {selectedOrders.size > 0 && (
                        <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleCancelMultiple}
                            disabled={loading}
                        >
                            <i className="fas fa-ban me-1"></i>
                            {formatTemplate(headerText.bulkCancel || 'Cancel selected ({{count}})', { count: selectedOrders.size })}
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

            {/* Filter */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex flex-wrap gap-2">
                        <button 
                            className={`btn btn-sm ${filterStatus === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilterStatus('all')}
                        >
                            {formatTemplate(filterText.all || 'All ({{count}})', { count: orders.length })}
                        </button>
                        <button 
                            className={`btn btn-sm ${filterStatus === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={() => setFilterStatus('pending')}
                        >
                            {formatTemplate(filterText.pending || 'Pending ({{count}})', { count: orders.filter(o => isPendingStatus(o.status)).length })}
                        </button>
                        <button 
                            className={`btn btn-sm ${filterStatus === 'processing' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setFilterStatus('processing')}
                        >
                            {formatTemplate(filterText.processing || 'Processing ({{count}})', { count: orders.filter(o => o.status === 'processing').length })}
                        </button>
                        <button 
                            className={`btn btn-sm ${filterStatus === 'completed' ? 'btn-success' : 'btn-outline-success'}`}
                            onClick={() => setFilterStatus('completed')}
                        >
                            {formatTemplate(filterText.completed || 'Completed ({{count}})', { count: orders.filter(o => o.status === 'completed' || o.status === 'delivered' || o.status === 'shipped').length })}
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="text-center py-5">
                    <div className="mb-4">
                        <i className="fas fa-shopping-bag" style={{ fontSize: '4rem', color: '#6c757d' }}></i>
                    </div>
                    <h4 className="mb-3">{emptyText.title || 'No orders yet'}</h4>
                    <p className="text-muted mb-4">{emptyText.subtitle || 'You have no orders yet. Start shopping!'}</p>
                    <button 
                        className="btn btn-primary"
                        onClick={onBackToHome}
                    >
                        <i className="fas fa-shopping-cart me-2"></i>
                        {emptyText.cta || 'Shop now'}
                    </button>
                </div>
            ) : (
                <div className="row">
                    {currentOrders.map((order, index) => (
                        <div key={order.order_id || order.id || `order-${index}`} className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                            <div className="card border-0 shadow-sm h-100 d-flex flex-column">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            {isPendingStatus(order.status) && (
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input"
                                                    checked={selectedOrders.has(normalizeId(order.order_id || order.id))}
                                                    onChange={() => handleOrderSelect(order.order_id || order.id)}
                                                />
                                            )}
                                            <h6 className="fw-bold text-dark mb-0">
                                                {formatTemplate(cardText.orderLabel || 'Order #{{id}}', {
                                                    id: getDisplayOrderId(order.order_id || order.id)
                                                })}
                                            </h6>
                                        </div>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="text-muted small mb-1">{cardText.productsLabel || 'Products:'}</div>
                                        <div className="fw-medium">
                                            {(() => {
                                                console.log(`Order ${order.id} items:`, order.items);
                                                console.log(`Order ${order.id} items length:`, order.items?.length);
                                                
                                                if (order.items?.length > 0) {
                                                    if (order.items.length === 1) {
                                                        return order.items[0].title || order.items[0].book_title;
                                                    } else {
                                                        return formatTemplate(cardText.productMore || '{{first}} and {{count}} other item(s)', {
                                                            first: order.items[0].title || order.items[0].book_title,
                                                            count: order.items.length - 1
                                                        });
                                                    }
                                                } else {
                                                    return cardText.productEmpty || 'No products';
                                                }
                                            })()}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-muted small mb-1">{cardText.totalLabel || 'Total amount:'}</div>
                                        <div className="fw-bold text-primary h5 mb-0">
                                            {formatCurrency(order.total || order.total_price || 0)}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-muted small mb-1">{cardText.placedLabel || 'Placed:'}</div>
                                        <div className="small">
                                            {formatDate(order.createdAt || order.created_at)}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <div className="text-muted small mb-1">{cardText.typeLabel || 'Order type:'}</div>
                                        <div className="small">
                                            <span className={`badge ${order.orderType === 'cart' ? 'bg-info' : 'bg-secondary'}`}>
                                                {order.orderType === 'cart' ? orderTypeLabels.cart : orderTypeLabels.buyNow}
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
                                            {cardText.viewDetails || 'View details'}
                                        </button>
                                        {isPendingStatus(order.status) ? (
                                            <button 
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleCancelOrder(order.order_id || order.id)}
                                                disabled={loading}
                                                title={cardText.cancelHint || 'Only orders in pending state can be cancelled'}
                                                style={{ minHeight: '38px' }}
                                            >
                                                <i className="fas fa-ban me-1"></i>
                                                {cardText.cancel || 'Cancel order'}
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
                                    aria-label={paginationText.ariaPrev || 'Previous page'}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                    {paginationText.prev || 'Prev'}
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
                                    aria-label={paginationText.ariaNext || 'Next page'}
                                >
                                    {paginationText.next || 'Next'}
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
                                    {formatTemplate(modalText.title || 'Order details #{{id}}', {
                                        id: getDisplayOrderId(selectedOrder.order_id || selectedOrder.id)
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
                                        <h6 className="fw-bold">{modalText.shippingTitle || 'Shipping information'}</h6>
                                        {(() => {
                                            console.log('Selected order shipping info:', selectedOrder.shippingInfo);
                                            console.log('Selected order full data:', selectedOrder);
                                            
                                            if (selectedOrder.shippingInfo) {
                                                return (
                                                    <>
                                                        <p><strong>{modalLabels.name || 'Name:'}</strong> {selectedOrder.shippingInfo.fullName || commonText.notAvailable || 'N/A'}</p>
                                                        <p><strong>{modalLabels.email || 'Email:'}</strong> {selectedOrder.shippingInfo.email || commonText.notAvailable || 'N/A'}</p>
                                                        <p><strong>{modalLabels.phone || 'Phone:'}</strong> {selectedOrder.shippingInfo.phone || commonText.notAvailable || 'N/A'}</p>
                                                        <p><strong>{modalLabels.address || 'Address:'}</strong><br />
                                                            {[
                                                                selectedOrder.shippingInfo.address,
                                                                selectedOrder.shippingInfo.ward,
                                                                selectedOrder.shippingInfo.district,
                                                                selectedOrder.shippingInfo.city
                                                            ].filter(part => part && part.trim() !== '').join(', ') || (modalText.addressFallback || 'Address unavailable')}
                                                        </p>
                                                    </>
                                                );
                                            } else {
                                                return <p className="text-muted">{modalText.shippingFallback || 'Shipping information unavailable'}</p>;
                                            }
                                        })()}
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="fw-bold">{modalText.orderInfoTitle || 'Order information'}</h6>
                                        <p><strong>{modalText.statusLabel || 'Status:'}</strong> {getStatusBadge(selectedOrder.status)}</p>
                                        <p><strong>{modalText.placedLabel || 'Placed:'}</strong> {formatDate(selectedOrder.createdAt || selectedOrder.created_at)}</p>
                                        <p><strong>{modalText.totalLabel || 'Total:'}</strong> <span className="fw-bold text-primary">{formatCurrency(selectedOrder.total || selectedOrder.total_price || 0)}</span></p>
                                        <p><strong>{modalText.typeLabel || 'Order type:'}</strong> 
                                            <span className={`badge ms-2 ${selectedOrder.orderType === 'cart' ? 'bg-info' : 'bg-secondary'}`}>
                                                {selectedOrder.orderType === 'cart' ? orderTypeLabels.cart : orderTypeLabels.buyNow}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <hr />

                                <h6 className="fw-bold">{modalText.itemsTitle || 'Items in this order'}</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>{tableHeaders.name || 'Book title'}</th>
                                                <th className="text-center">{tableHeaders.quantity || 'Qty'}</th>
                                                <th className="text-end">{tableHeaders.price || 'Unit price'}</th>
                                                <th className="text-end">{tableHeaders.total || 'Line total'}</th>
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
                                                            <td colSpan="4" className="text-center text-muted">{messagesText.noItems || 'No items available'}</td>
                                                        </tr>
                                                    );
                                                }
                                            })()}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th colSpan="3">{modalText.summaryLabel || 'Grand total'}</th>
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
                                    {modalText.closeButton || 'Close'}
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
