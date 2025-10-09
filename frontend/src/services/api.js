/**
 * Main API Service - Kết nối trực tiếp với MySQL Database
 * Lấy dữ liệu thật từ backend API
 */

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:3306/api';
  }

  // Utility method để delay (giả lập network delay)
  async delay(ms = 100) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generic method để gọi API
  async apiCall(endpoint, options = {}) {
    try {
      await this.delay();
      
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 403) {
          throw new Error(`HTTP error! status: ${response.status} - Forbidden: Bạn không có quyền truy cập`);
        } else if (response.status === 401) {
          throw new Error(`HTTP error! status: ${response.status} - Unauthorized: Vui lòng đăng nhập lại`);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      
      // Return the data as-is if it already has success field, otherwise wrap it
      if (data && typeof data === 'object' && 'success' in data) {
        return data;
      } else {
        return {
          success: true,
          data: data,
          message: 'Success'
        };
      }
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  // ==================== BOOKS ====================
  async getBooks(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.category_id) queryParams.append('category_id', params.category_id);
    if (params.author_id) queryParams.append('author_id', params.author_id);
    if (params.publisher_id) queryParams.append('publisher_id', params.publisher_id);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    if (params.min_price) queryParams.append('min_price', params.min_price);
    if (params.max_price) queryParams.append('max_price', params.max_price);

    const queryString = queryParams.toString();
    const endpoint = `/books${queryString ? `?${queryString}` : ''}`;
    
    return await this.apiCall(endpoint);
  }

  async getBookById(id) {
    return await this.apiCall(`/books/${id}`);
  }

  async createBook(bookData) {
    return await this.apiCall('/books', {
      method: 'POST',
      body: JSON.stringify(bookData)
    });
  }

  async updateBook(id, bookData) {
    return await this.apiCall(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData)
    });
  }

  async deleteBook(id) {
    return await this.apiCall(`/books/${id}`, {
      method: 'DELETE'
    });
  }

  async searchBooks(query, params = {}) {
    const searchParams = new URLSearchParams({ q: query });
    
    Object.keys(params).forEach(key => {
      if (params[key]) searchParams.append(key, params[key]);
    });

    return await this.apiCall(`/books/search?${searchParams.toString()}`);
  }

  // ==================== CATEGORIES ====================
  async getCategories() {
    return await this.apiCall('/categories');
  }

  async getCategoryById(id) {
    return await this.apiCall(`/categories/${id}`);
  }

  async createCategory(categoryData) {
    return await this.apiCall('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  async updateCategory(id, categoryData) {
    return await this.apiCall(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  }

  async deleteCategory(id) {
    return await this.apiCall(`/categories/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== AUTHORS ====================
  async getAuthors() {
    return await this.apiCall('/authors');
  }

  async getAuthorById(id) {
    return await this.apiCall(`/authors/${id}`);
  }

  async createAuthor(authorData) {
    return await this.apiCall('/authors', {
      method: 'POST',
      body: JSON.stringify(authorData)
    });
  }

  async updateAuthor(id, authorData) {
    return await this.apiCall(`/authors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(authorData)
    });
  }

  async deleteAuthor(id) {
    return await this.apiCall(`/authors/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== PUBLISHERS ====================
  async getPublishers() {
    return await this.apiCall('/publishers');
  }

  async getPublisherById(id) {
    return await this.apiCall(`/publishers/${id}`);
  }

  async createPublisher(publisherData) {
    return await this.apiCall('/publishers', {
      method: 'POST',
      body: JSON.stringify(publisherData)
    });
  }

  async updatePublisher(id, publisherData) {
    return await this.apiCall(`/publishers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(publisherData)
    });
  }

  async deletePublisher(id) {
    return await this.apiCall(`/publishers/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== USERS ====================
  async getUsers() {
    return await this.apiCall('/users');
  }

  async getAllUsers(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    // Sử dụng endpoint chính thức với auth
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.apiCall(endpoint);
    
    // Backend trả về format {users: [...], total: ..., page: ..., limit: ..., totalPages: ...}
    // Cần convert thành format {success: true, data: [...]}
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.users || response.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        totalPages: response.data.totalPages,
        message: 'Success'
      };
    }
    
    return response;
  }

  async getUserById(id) {
    return await this.apiCall(`/users/${id}`);
  }

  async createUser(userData) {
    return await this.apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(id, userData) {
    return await this.apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id) {
    return await this.apiCall(`/users/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== AUTH ====================
  async login(credentials) {
    return await this.apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData) {
    return await this.apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async logout() {
    return await this.apiCall('/auth/logout', {
      method: 'POST'
    });
  }

  async refreshToken() {
    return await this.apiCall('/auth/refresh', {
      method: 'POST'
    });
  }

  // ==================== REVIEWS ====================
  async getReviews(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.book_id) queryParams.append('book_id', params.book_id);
    if (params.user_id) queryParams.append('user_id', params.user_id);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const endpoint = `/reviews${queryString ? `?${queryString}` : ''}`;
    
    return await this.apiCall(endpoint);
  }

  async getReviewById(id) {
    return await this.apiCall(`/reviews/${id}`);
  }

  async createReview(reviewData) {
    return await this.apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  async updateReview(id, reviewData) {
    return await this.apiCall(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData)
    });
  }

  async deleteReview(id) {
    return await this.apiCall(`/reviews/${id}`, {
      method: 'DELETE'
    });
  }

  // ==================== ORDERS ====================
  async getOrders(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.user_id) queryParams.append('user_id', params.user_id);
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const endpoint = `/order${queryString ? `?${queryString}` : ''}`;
    
    return await this.apiCall(endpoint);
  }

  async getOrderById(id) {
    return await this.apiCall(`/order/${id}`);
  }

  async createOrder(orderData) {
    return await this.apiCall('/order/checkout', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async purchase(orderData) {
    return await this.apiCall('/order/purchase', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
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
      console.log('Getting user orders from backend API...');
      
      // Use backend API to get user's orders
      const response = await this.apiCall('/order/my-orders');
      
      if (response.success) {
        console.log('Retrieved orders from backend:', response.data);
        return response;
      } else {
        // Fallback to localStorage if backend fails
        console.log('Backend failed, falling back to localStorage...');
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const userOrdersKey = user ? `myOrders_${user.user_id}` : 'myOrders';
        const localOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
        console.log('Retrieved orders from localStorage:', localOrders);
        
        // Transform localStorage data to ensure consistency
        const transformedOrders = localOrders.map(order => ({
          id: order.id || order.order_id,
          order_id: order.order_id || order.id,
          items: order.items || [],
          shippingInfo: order.shippingInfo || {
            fullName: 'N/A',
            email: 'N/A',
            phone: 'N/A',
            address: 'N/A'
          },
          total: order.total || order.total_price || 0,
          total_price: order.total_price || order.total || 0,
          status: order.status || 'pending',
          createdAt: order.createdAt || order.created_at,
          created_at: order.created_at || order.createdAt,
          orderType: order.orderType || 'buy-now'
        }));
        
        console.log('Transformed orders for frontend:', transformedOrders);
        
        return {
          success: true,
          data: transformedOrders,
          message: 'Orders loaded from local storage'
        };
      }
    } catch (error) {
      console.error('Error getting user orders:', error);
      // Fallback to localStorage on error
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const userOrdersKey = user ? `myOrders_${user.user_id}` : 'myOrders';
        const localOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
        const transformedOrders = localOrders.map(order => ({
          id: order.id || order.order_id,
          order_id: order.order_id || order.id,
          items: order.items || [],
          shippingInfo: order.shippingInfo || {
            fullName: 'N/A',
            email: 'N/A',
            phone: 'N/A',
            address: 'N/A'
          },
          total: order.total || order.total_price || 0,
          total_price: order.total_price || order.total || 0,
          status: order.status || 'pending',
          createdAt: order.createdAt || order.created_at,
          created_at: order.created_at || order.createdAt,
          orderType: order.orderType || 'buy-now'
        }));
        
        return {
          success: true,
          data: transformedOrders,
          message: 'Orders loaded from local storage'
        };
      } catch (localError) {
        console.error('Error with localStorage fallback:', localError);
        return {
          success: false,
          data: [],
          message: 'No orders found'
        };
      }
    }
  }

  async getMyOrderById(orderId) {
    try {
      console.log('Getting order by ID from localStorage:', orderId);
      
      // For user orders, we'll use localStorage since there's no dedicated user orders API
      // The /order/confirmation API might require admin permissions
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const userOrdersKey = user ? `myOrders_${user.user_id}` : 'myOrders';
      const localOrders = JSON.parse(localStorage.getItem(userOrdersKey) || '[]');
      console.log('Searching in localStorage orders:', localOrders);
      
      const order = localOrders.find(o => o.id === orderId || o.order_id === orderId);
      console.log('Found order in localStorage:', order);
      
      if (order) {
        console.log('Order shipping info from localStorage:', order.shippingInfo);
        console.log('Shipping info type:', typeof order.shippingInfo);
        console.log('Shipping info keys:', order.shippingInfo ? Object.keys(order.shippingInfo) : 'null');
        
        // Transform localStorage data to ensure consistency
        const transformedOrder = {
          id: order.id || order.order_id,
          order_id: order.order_id || order.id,
          items: order.items || [],
          shippingInfo: order.shippingInfo || {
            fullName: 'N/A',
            email: 'N/A',
            phone: 'N/A',
            address: 'N/A'
          },
          total: order.total || order.total_price || 0,
          total_price: order.total_price || order.total || 0,
          status: order.status || 'pending',
          createdAt: order.createdAt || order.created_at,
          created_at: order.created_at || order.createdAt,
          orderType: order.orderType || 'buy-now'
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
          message: 'Order not found'
        };
      }
    } catch (error) {
      console.error('Error getting order by ID:', error);
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
        console.log(`Order ${order.id || order.order_id}: total = ${order.total}, total_price = ${order.total_price}, parsed = ${orderTotal} ₫`);
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
    console.warn('getAllOrders() is admin-only. Use getMyOrders() for user orders.');
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

  // ==================== CART ====================
  async getCart(userId) {
    return await this.apiCall(`/cart/${userId}`);
  }

  async addToCart(cartData) {
    return await this.apiCall('/cart/add', {
      method: 'POST',
      body: JSON.stringify(cartData)
    });
  }

  async updateCartItem(cartItemId, quantity) {
    return await this.apiCall(`/cart/items/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  async removeFromCart(cartItemId) {
    return await this.apiCall(`/cart/items/${cartItemId}`, {
      method: 'DELETE'
    });
  }

  async clearCart(userId) {
    return await this.apiCall(`/cart/${userId}`, {
      method: 'DELETE'
    });
  }

  // ==================== WAREHOUSE ====================
  async getWarehouseItems() {
    return await this.apiCall('/warehouse');
  }

  async getWarehouseItemByBookId(bookId) {
    return await this.apiCall(`/warehouse/${bookId}`);
  }

  async createWarehouseItem(warehouseData) {
    return await this.apiCall('/warehouse', {
      method: 'POST',
      body: JSON.stringify(warehouseData)
    });
  }

  async updateWarehouseItem(bookId, warehouseData) {
    return await this.apiCall(`/warehouse/${bookId}`, {
      method: 'PUT',
      body: JSON.stringify(warehouseData)
    });
  }

  async deleteWarehouseItem(bookId) {
    return await this.apiCall(`/warehouse/${bookId}`, {
      method: 'DELETE'
    });
  }

  // ==================== HEALTH CHECK ====================
  async healthCheck() {
    try {
      return await this.apiCall('/health');
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}

export default new ApiService();
