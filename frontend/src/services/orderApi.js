/**
 * Order API Service - Quản lý các API liên quan đến đơn hàng
 */

import BaseApiService from './baseApi.js';

class OrderApiService extends BaseApiService {
  // ==================== ORDERS ====================
  async getOrders(params = {}) {
    try {
      console.log(` [OrderAPI] Đang lấy danh sách đơn hàng với tham số:`, params);
      
      const queryParams = new URLSearchParams();
      
      if (params.user_id) queryParams.append('user_id', params.user_id);
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);

      const queryString = queryParams.toString();
      const endpoint = `/order${queryString ? `?${queryString}` : ''}`;
      
      console.log(` [OrderAPI] Endpoint cuối cùng: ${endpoint}`);
      const result = await this.apiCall(endpoint);
      console.log(` [OrderAPI] Kết quả lấy danh sách đơn hàng:`, result);
      return result;
    } catch (error) {
      console.error(` [OrderAPI] Lỗi khi lấy danh sách đơn hàng:`, error);
      throw error;
    }
  }

  async getOrderById(id) {
    try {
      console.log(` [OrderAPI] Đang lấy thông tin đơn hàng theo ID: ${id}`);
      const result = await this.apiCall(`/order/${id}`);
      console.log(` [OrderAPI] Kết quả lấy thông tin đơn hàng:`, result);
      return result;
    } catch (error) {
      console.error(` [OrderAPI] Lỗi khi lấy thông tin đơn hàng ID ${id}:`, error);
      throw error;
    }
  }

  async createOrder(orderData) {
    try {
      console.log(` [OrderAPI] Đang tạo đơn hàng mới với dữ liệu:`, orderData);
      const result = await this.apiCall('/order/checkout', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      console.log(` [OrderAPI] Kết quả tạo đơn hàng:`, result);
      return result;
    } catch (error) {
      console.error(` [OrderAPI] Lỗi khi tạo đơn hàng:`, error);
      throw error;
    }
  }

  async purchase(orderData) {
    try {
      console.log(` [OrderAPI] Đang thực hiện mua hàng với dữ liệu:`, orderData);
      const result = await this.apiCall('/order/purchase', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
      console.log(` [OrderAPI] Kết quả mua hàng:`, result);
      return result;
    } catch (error) {
      console.error(` [OrderAPI] Lỗi khi thực hiện mua hàng:`, error);
      throw error;
    }
  }

  async updateOrder(id, orderData) {
    return await this.apiCall(`/order/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData)
    });
  }

  async deleteOrder(id) {
    return await this.apiCall(`/order/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== ORDER MANAGEMENT (ADMIN) ====================
  async getPendingOrders() {
    return await this.apiCall('/order/pending');
  }

  // ==================== USER ORDERS ====================
  async getMyOrders(params = {}) {
    try {
      console.log(` [OrderAPI] Đang lấy đơn hàng của người dùng từ backend API...`);
      console.log(` [OrderAPI] Tham số:`, params);
      
      // Use backend API to get user's orders
      const response = await this.apiCall('/order/my-orders');
      
      if (response.success) {
        console.log(` [OrderAPI] Đã lấy được đơn hàng từ backend:`, response.data);
        
        // Transform orders to ensure consistent structure
        const transformedOrders = response.data.map(order => ({
          ...order,
          id: order.order_id || order.id, // Ensure id is set
          order_id: order.order_id || order.id, // Ensure order_id is set
          items: (order.items || []).map(item => ({
            book_id: item.book_id,
            title: item.book_title || item.title || 'Unknown Book',
            book_title: item.book_title || item.title || 'Unknown Book',
            quantity: item.quantity || 1,
            price: item.price_at_order || item.price || 0,
            price_at_order: item.price_at_order || item.price || 0
          }))
        }));
        
        console.log(` [OrderAPI] Đã chuyển đổi đơn hàng thành công:`, transformedOrders);
        
        return {
          success: true,
          data: transformedOrders
        };
      } else {
        console.error(` [OrderAPI] Backend trả về lỗi:`, response.error);
        throw new Error(response.error || 'Failed to get orders from backend');
      }
    } catch (error) {
      console.error(` [OrderAPI] Lỗi khi lấy đơn hàng của người dùng:`, error);
      throw error; // Re-throw error instead of fallback
    }
  }

  async cancelMyOrder(orderId) {
    return await this.apiCall(`/order/cancel/${orderId}`, {
      method: 'PUT'
    });
  }

  async getMyOrderById(orderId) {
    try {
      console.log('Getting order by ID from backend:', orderId);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${this.baseURL}/order/confirmation/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend order response:', result);
      
      if (result.success && result.data) {
        const order = result.data;
        
        console.log('Raw order data from backend:', order);
        console.log('Order total_price from backend:', order.total_price);
        console.log('Order items from backend:', order.items);
        
        // Parse address string into components
        const parseAddress = (addressString) => {
          if (!addressString || addressString === 'N/A') {
            return { address: '', ward: '', district: '', city: '' };
          }
          
          const parts = addressString.split(',').map(p => p.trim());
          
          // Handle different address formats
          if (parts.length >= 4) {
            // Check if first parts look like name and phone (old format)
            if (parts.length > 4 && (parts[1].match(/^\d+$/) || parts[1].includes('@'))) {
              // Old format: "name, phone, address, ward, district, city"
              return {
                address: parts[2] || '',
                ward: parts[3] || '',
                district: parts[4] || '',
                city: parts[5] || ''
              };
            } else {
              // New format: "address, ward, district, city"
              return {
                address: parts[0] || '',
                ward: parts[1] || '',
                district: parts[2] || '',
                city: parts[3] || ''
              };
            }
          }
          
          // Fallback for shorter addresses
          return {
            address: parts[0] || '',
            ward: parts[1] || '',
            district: parts[2] || '',
            city: parts[3] || ''
          };
        };
        
        const addressParts = parseAddress(order.shipping_address);
        
        // Transform backend data to match frontend expectations
        const items = (order.items || []).map(item => ({
          book_id: item.book_id,
          title: item.book_title || item.title || 'Unknown Book',
          book_title: item.book_title || item.title || 'Unknown Book',
          quantity: item.quantity || 1,
          price: item.price_at_order || item.price || 0,
          price_at_order: item.price_at_order || item.price || 0
        }));
        
        // Tính lại total_price nếu nó bằng 0 nhưng có items
        let calculatedTotal = order.total_price || 0;
        if (calculatedTotal === 0 && items.length > 0) {
          calculatedTotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
          console.log('Tính lại total_price trong frontend:', calculatedTotal);
        }
        
        const transformedOrder = {
          id: order.order_id,
          order_id: order.order_id,
          items: items,
          shippingInfo: {
            fullName: order.user_name || 'N/A',
            email: order.user_email || 'N/A',
            phone: order.user_phone || 'N/A',
            address: addressParts.address,
            ward: addressParts.ward,
            district: addressParts.district,
            city: addressParts.city
          },
          total: calculatedTotal,
          total_price: calculatedTotal,
          status: order.status || 'pending',
          createdAt: order.created_at,
          created_at: order.created_at,
          orderType: order.order_type || 'buy-now'
        };
        
        console.log('Transformed order for frontend:', transformedOrder);
        
        return {
          success: true,
          data: transformedOrder
        };
      } else {
        return {
          success: false,
          data: null,
          message: result.error || 'Order not found'
        };
      }
    } catch (error) {
      console.error('Error getting order by ID:', error);
      
      // Fallback to localStorage if backend fails
      console.log('Falling back to localStorage for order:', orderId);
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const userOrdersKey = user ? `myOrders_${user.user_id}` : 'myOrders';
      const localOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
      
      const order = localOrders.find(o => o.id === orderId || o.order_id === orderId);
      
      if (order) {
        // Get user info from localStorage to fill missing data
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        
        const transformedOrder = {
          id: order.id || order.order_id,
          order_id: order.order_id || order.id,
          items: order.items || [],
          shippingInfo: {
            fullName: order.shippingInfo?.fullName || user?.name || 'N/A',
            email: order.shippingInfo?.email || user?.email || 'N/A',
            phone: order.shippingInfo?.phone || user?.phone || 'N/A',
            address: order.shippingInfo?.address,
            ward: order.shippingInfo?.ward,
            district: order.shippingInfo?.district,
            city: order.shippingInfo?.city
          },
          total: order.total || order.total_price || 0,
          total_price: order.total_price || order.total || 0,
          status: order.status || 'pending',
          createdAt: order.createdAt || order.created_at,
          created_at: order.created_at || order.createdAt,
          orderType: order.orderType || 'buy-now'
        };
        
        return {
          success: true,
          data: transformedOrder
        };
      }
      
      return {
        success: false,
        data: null,
        message: 'Failed to get order'
      };
    }
  }

  async saveMyOrder(orderData) {
    try {
      // Get current user to create user-specific localStorage key
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user) {
        throw new Error('User not found');
      }
      
      const userOrdersKey = `myOrders_${user.user_id}`;
      const existingOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
      existingOrders.push(orderData);
      localStorage.setItem(userOrdersKey, JSON.stringify(existingOrders));
      
      return {
        success: true,
        data: orderData,
        message: 'Order saved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to save order'
      };
    }
  }

  // API tính tổng doanh thu từ các đơn hàng
  async getTotalRevenue() {
    try {
      console.log('Calculating total revenue from localStorage orders...');
      
      // For user revenue calculation, we'll use localStorage since there's no dedicated user revenue API
      // The /order/pending API is admin-only and requires admin permissions
      const localOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
      console.log('Orders for revenue calculation:', localOrders);
      
      // Tính tổng doanh thu từ các đơn hàng
      const totalRevenue = localOrders.reduce((sum, order) => {
        const orderTotal = parseFloat(order.total || order.total_price) || 0;
        return sum + orderTotal;
      }, 0);
      
      console.log(`Total revenue calculated: ${totalRevenue} ₫`);
      
      return {
        success: true,
        data: {
          totalRevenue: totalRevenue,
          orderCount: localOrders.length,
          orders: localOrders
        },
        message: 'Revenue calculated successfully'
      };
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      return {
        success: false,
        data: {
          totalRevenue: 0,
          orderCount: 0,
          orders: []
        },
        message: 'Failed to calculate revenue'
      };
    }
  }

  // API lấy thống kê doanh thu chi tiết
  async getRevenueStats() {
    try {
      console.log('Getting detailed revenue statistics from localStorage...');
      
      // For user revenue stats, we'll use localStorage since there's no dedicated user revenue API
      // The /order/pending API is admin-only and requires admin permissions
      const localOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
      console.log('Orders for stats calculation:', localOrders);
        
        // Tính toán các thống kê
        const stats = {
          totalRevenue: 0,
          totalOrders: localOrders.length,
          averageOrderValue: 0,
          revenueByStatus: {},
          topCustomers: [],
          recentOrders: []
        };
        
        // Tính tổng doanh thu và thống kê theo trạng thái
        localOrders.forEach(order => {
          const orderTotal = parseFloat(order.total || order.total_price) || 0;
          stats.totalRevenue += orderTotal;
          
          // Thống kê theo trạng thái
          if (!stats.revenueByStatus[order.status]) {
            stats.revenueByStatus[order.status] = {
              count: 0,
              revenue: 0
            };
          }
          stats.revenueByStatus[order.status].count++;
          stats.revenueByStatus[order.status].revenue += orderTotal;
        });
        
        // Tính giá trị đơn hàng trung bình
        stats.averageOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;
        
        // Sắp xếp đơn hàng theo ngày tạo (mới nhất trước)
        stats.recentOrders = localOrders
          .sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0))
          .slice(0, 10); // Top 10 đơn hàng gần nhất
        
        console.log('Revenue stats calculated:', stats);
        
        return {
          success: true,
          data: stats,
          message: 'Revenue statistics calculated successfully'
        };
    } catch (error) {
      console.error('Error getting revenue statistics:', error);
      return {
        success: false,
        data: {
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          revenueByStatus: {},
          topCustomers: [],
          recentOrders: []
        },
        message: 'Failed to calculate revenue statistics'
      };
    }
  }

  async getAllOrders(params = {}) {
    // This method is for admin use only
    // Regular users should not call this method
    if (!params.suppressWarning) {
      console.warn('getAllOrders() is admin-only. Use getMyOrders() for user orders.');
    }
    return await this.apiCall('/order/all');
  }

  async updateOrderStatus(orderId, status) {
    return await this.apiCall(`/order/update/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async deleteOrder(orderId) {
    return await this.apiCall(`/order/delete/${orderId}`, {
      method: 'DELETE'
    });
  }

  async getOrderConfirmation(orderId) {
    return await this.apiCall(`/order/confirmation/${orderId}`);
  }

  async getAdminOrderDetails(orderId) {
    return await this.apiCall(`/order/admin-details/${orderId}`);
  }

  async confirmOrder(orderId) {
    return await this.apiCall(`/order/confirmation/${orderId}`, {
      method: 'POST'
    });
  }

  // ==================== ORDER STATISTICS ====================
  async getRevenueStats(type, date) {
    const queryParams = new URLSearchParams();
    if (type) queryParams.append('type', type);
    if (date) queryParams.append('date', date);
    
    const queryString = queryParams.toString();
    return await this.apiCall(`/order/stats/revenue?${queryString}`);
  }

  async getProductStats(type, date) {
    const queryParams = new URLSearchParams();
    if (type) queryParams.append('type', type);
    if (date) queryParams.append('date', date);
    
    const queryString = queryParams.toString();
    return await this.apiCall(`/order/stats/products?${queryString}`);
  }

  async getDailyRevenueOfMonth(month) {
    const queryParams = new URLSearchParams();
    if (month) queryParams.append('month', month);
    
    const queryString = queryParams.toString();
    return await this.apiCall(`/order/stats/daily-revenue?${queryString}`);
  }

  async getMonthlyRevenueOfYear(year) {
    const queryParams = new URLSearchParams();
    if (year) queryParams.append('year', year);
    
    const queryString = queryParams.toString();
    return await this.apiCall(`/order/stats/monthly-revenue?${queryString}`);
  }

  async getOrderSummary() {
    return await this.apiCall('/order/stats/summary');
  }
}

export default new OrderApiService();
