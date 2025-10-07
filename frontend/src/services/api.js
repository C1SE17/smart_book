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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Format response để tương thích với existing code
      return {
        success: true,
        data: data,
        message: 'Success'
      };
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
    return await this.apiCall('/auth/login', {
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
    return await this.apiCall('/order', {
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
