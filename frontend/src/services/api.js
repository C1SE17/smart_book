// Real API Service - sử dụng backend thật
const API_BASE_URL = 'http://localhost:3306/api';

class ApiService {
  // Helper method để gọi API
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Thêm token nếu có
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication APIs
  async register(userData) {
    const { name, email, password, phone, address } = userData;
    
    const response = await this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        phone: phone || '',
        address: address || '',
        role: email.includes('admin') ? 'admin' : 'customer'
      })
    });

    // Tạo user object cho frontend
    const newUser = {
      user_id: Date.now(), // Tạm thời dùng timestamp
      name: name,
      email: email,
      phone: phone || '',
      address: address || '',
      role: email.includes('admin') ? 'admin' : 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Generate mock token (backend sẽ trả về token thật sau khi login)
    const token = `temp_token_${newUser.user_id}_${Date.now()}`;

    return {
      user: newUser,
      token: token,
      message: response.message || 'Đăng ký thành công'
    };
  }

  async login(credentials) {
    const { email, password } = credentials;
    
    const response = await this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    // Decode JWT token để lấy thông tin user
    let userRole = 'customer';
    let userId = null;
    
    if (response.token) {
      try {
        const payload = JSON.parse(atob(response.token.split('.')[1]));
        userRole = payload.role || 'customer';
        userId = payload.userId;
        console.log('Decoded JWT payload:', payload);
      } catch (error) {
        console.warn('Không thể decode token:', error);
      }
    }

    // Override role cho admin emails (tạm thời fix)
    if (email.includes('admin')) {
      userRole = 'admin';
      console.log('Overriding role to admin for email:', email);
    }

    // Lấy thông tin user từ backend
    let userData = {};
    try {
      userData = await this.request(`/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${response.token}`
        }
      });
    } catch (error) {
      console.warn('Không thể lấy thông tin user, sử dụng thông tin mặc định');
      userData = {
        user_id: userId,
        name: email.split('@')[0],
        email: email,
        phone: '',
        address: '',
        role: userRole,
        status: 'active'
      };
    }

    // Lưu token vào localStorage
    if (response.token) {
      localStorage.setItem('userToken', response.token);
    }

    return {
      user: {
        user_id: userData.user_id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        address: userData.address || '',
        role: userRole,
        status: userData.status || 'active',
        created_at: userData.created_at,
        updated_at: userData.updated_at
      },
      token: response.token,
      message: response.message || 'Đăng nhập thành công'
    };
  }

  async getUserById(id) {
    return await this.request(`/users/${id}`);
  }

  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
  }

  async updateUser(id, userData) {
    return await this.request(`/users/update`, {
      method: 'PUT',
      body: JSON.stringify({ user_id: id, ...userData })
    });
  }

  async logout() {
    return await this.request('/users/logout', {
      method: 'POST'
    });
  }

  // Books API
  async getBooks(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await this.request(`/books${queryParams ? `?${queryParams}` : ''}`);
  }

  async getBookById(id) {
    return await this.request(`/books/${id}`);
  }

  // Categories API
  async getCategories() {
    return await this.request('/categories');
  }

  async getCategoryById(id) {
    return await this.request(`/categories/${id}`);
  }

  // Authors API
  async getAuthors() {
    return await this.request('/authors');
  }

  async getAuthorById(id) {
    return await this.request(`/authors/${id}`);
  }

  // Publishers API
  async getPublishers() {
    return await this.request('/publishers');
  }

  async getPublisherById(id) {
    return await this.request(`/publishers/${id}`);
  }

  // Reviews API
  async getReviewsByBookId(bookId) {
    return await this.request(`/reviews/book/${bookId}`);
  }

  async addReview(reviewData) {
    return await this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  // Cart API
  async getCartByUserId(userId) {
    return await this.request(`/cart/user/${userId}`);
  }

  async addToCart(userId, bookId, quantity = 1) {
    return await this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, book_id: bookId, quantity })
    });
  }

  async removeFromCart(userId, bookId) {
    return await this.request('/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ user_id: userId, book_id: bookId })
    });
  }

  async updateCartItemQuantity(userId, bookId, quantity) {
    return await this.request('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ user_id: userId, book_id: bookId, quantity })
    });
  }

  // Orders API
  async getOrdersByUserId(userId) {
    return await this.request(`/order/user/${userId}`);
  }

  async getOrderById(orderId) {
    return await this.request(`/order/${orderId}`);
  }

  async createOrder(orderData) {
    return await this.request('/order', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  // Forgot Password API (sẽ implement sau)
  async sendResetEmail(email) {
    // TODO: Implement forgot password endpoint in backend
    throw new Error('Forgot password chưa được implement trong backend');
  }

  async verifyResetCode(email, code) {
    // TODO: Implement verify reset code endpoint in backend
    throw new Error('Verify reset code chưa được implement trong backend');
  }

  async resetPassword(email, newPassword, resetToken) {
    // TODO: Implement reset password endpoint in backend
    throw new Error('Reset password chưa được implement trong backend');
  }
}

// Tạo instance duy nhất
const apiService = new ApiService();

export default apiService;
