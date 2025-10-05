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
      console.log('Making API request to:', url, 'with config:', config);
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
          console.error('Error response data:', errorData);
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API response data:', data);
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      console.error('Request URL:', url);
      console.error('Request config:', config);
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.');
      }
      
      throw error;
    }
  }

  // Authentication APIs
  async register(userData) {
    const { name, email, password, phone, address } = userData;
    
    // Clear any cached data before registering
    console.log('Clearing cache before registration...');
    
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

    console.log('Registration response from backend:', response);

    // Sử dụng dữ liệu từ backend response
    return {
      user: response.user || {
        user_id: response.user_id,
        name: name,
        email: email,
        phone: phone || '',
        address: address || '',
        role: email.includes('admin') ? 'admin' : 'customer',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      token: response.token,
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

    // Lấy thông tin user từ backend API
    let userData = {};
    try {
      console.log('Fetching user data for userId:', userId);
      userData = await this.request(`/users/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${response.token}`
        }
      });
      console.log('User data from backend API:', userData);
    } catch (error) {
      console.warn('Không thể lấy thông tin user từ API, sử dụng thông tin cơ bản');
      // Fallback với thông tin cơ bản, không tạo từ email
      userData = {
        user_id: userId,
        name: 'User', // Không tạo từ email
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
    return await this.request(`/users/users/${id}`);
  }

  async getAllUsers() {
    return await this.request('/users/users');
  }

  async deleteUser(id) {
    return await this.request(`/users/users/${id}`, {
      method: 'DELETE'
    });
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

  async getAllReviews() {
    try {
      // Gọi API admin endpoint để lấy tất cả 5000 reviews
      console.log('🔄 Fetching all reviews from admin endpoint /reviews/admin/all...');
      const allReviews = await this.request('/reviews/admin/all');
      console.log(`✅ Successfully fetched ${allReviews.length} reviews from database`);
      
      if (allReviews.length < 5000) {
        console.warn(`⚠️ Expected 5000 reviews but got ${allReviews.length}. This might be correct if some reviews were deleted.`);
      }
      
      return allReviews;
    } catch (error) {
      console.error('❌ Error fetching all reviews from admin endpoint:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      
      // Kiểm tra nếu lỗi là do authentication
      if (error.status === 401 || error.status === 403) {
        console.error('🔐 Authentication error - user might not be admin or not logged in');
        throw new Error('Bạn cần đăng nhập với tài khoản admin để xem tất cả đánh giá');
      }
      
      // Fallback: lấy reviews từ một số sách mẫu nếu admin endpoint không hoạt động
      console.warn('🔄 Admin reviews endpoint failed, trying fallback method...');
      try {
        const allReviews = [];
        
        // Lấy reviews từ nhiều sách hơn (book_id 1-200) để có nhiều dữ liệu hơn
        console.log('🔄 Fetching reviews from individual books (1-200)...');
        for (let bookId = 1; bookId <= 200; bookId++) {
          try {
            const reviews = await this.getReviewsByBookId(bookId);
            if (reviews && reviews.length > 0) {
              allReviews.push(...reviews);
              if (bookId % 50 === 0) {
                console.log(`📚 Processed ${bookId} books, found ${allReviews.length} reviews so far...`);
              }
            }
          } catch (bookError) {
            // Không log warning cho mỗi book không có reviews
          }
        }
        
        console.log(`✅ Fallback method fetched ${allReviews.length} reviews from individual books`);
        return allReviews;
      } catch (fallbackError) {
        console.error('❌ Error in fallback method:', fallbackError);
        return [];
      }
    }
  }

  async deleteReview(reviewId) {
    return await this.request(`/reviews/admin/${reviewId}`, {
      method: 'DELETE'
    });
  }

  async getAverageRating(bookId) {
    return await this.request(`/reviews/book/${bookId}/average`);
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
