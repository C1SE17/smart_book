// API Services

// Base API configuration
const API_BASE_URL = 'http://localhost:3306/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// User Service
export const userService = {
  login: async (credentials) => {
    return apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  register: async (userData) => {
    return apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  getProfile: async (token) => {
    return apiRequest('/users/users/1', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  updateProfile: async (userData, token) => {
    return apiRequest('/users/update', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
  },

  changePassword: async (passwordData, token) => {
    return apiRequest('/users/change-password', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(passwordData)
    });
  },

  getOrders: async (token) => {
    return apiRequest('/order', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  getNotifications: async (token) => {
    return apiRequest('/users/notifications', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  markNotificationRead: async (notificationId, token) => {
    return apiRequest(`/users/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Book Service
export const bookService = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/books?${queryString}` : '/books';
    return apiRequest(endpoint);
  },

  getById: async (id) => {
    return apiRequest(`/books/${id}`);
  },

  getByCategory: async (categoryId) => {
    return apiRequest(`/books/category/${categoryId}`);
  },

  getByAuthor: async (authorId) => {
    return apiRequest(`/books/author/${authorId}`);
  },

  search: async (query) => {
    return apiRequest(`/books/search?q=${encodeURIComponent(query)}`);
  },

  create: async (bookData, token) => {
    return apiRequest('/books', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });
  },

  update: async (id, bookData, token) => {
    return apiRequest(`/books/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });
  },

  delete: async (id, token) => {
    return apiRequest(`/books/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Category Service
export const categoryService = {
  getAll: async () => {
    return apiRequest('/categories');
  },

  getById: async (id) => {
    return apiRequest(`/categories/${id}`);
  },

  create: async (categoryData, token) => {
    return apiRequest('/categories', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
  },

  update: async (id, categoryData, token) => {
    return apiRequest(`/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
  },

  delete: async (id, token) => {
    return apiRequest(`/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Author Service
export const authorService = {
  getAll: async () => {
    return apiRequest('/authors');
  },

  getById: async (id) => {
    return apiRequest(`/authors/${id}`);
  },

  create: async (authorData, token) => {
    return apiRequest('/authors', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(authorData)
    });
  },

  update: async (id, authorData, token) => {
    return apiRequest(`/authors/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(authorData)
    });
  },

  delete: async (id, token) => {
    return apiRequest(`/authors/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Publisher Service
export const publisherService = {
  getAll: async () => {
    return apiRequest('/publishers');
  },

  getById: async (id) => {
    return apiRequest(`/publishers/${id}`);
  },

  create: async (publisherData, token) => {
    return apiRequest('/publishers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(publisherData)
    });
  },

  update: async (id, publisherData, token) => {
    return apiRequest(`/publishers/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(publisherData)
    });
  },

  delete: async (id, token) => {
    return apiRequest(`/publishers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Cart Service
export const cartService = {
  getItems: async (token) => {
    return apiRequest('/cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  addItem: async (bookId, quantity, token) => {
    return apiRequest('/cart/items', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ book_id: bookId, quantity })
    });
  },

  updateItem: async (cartItemId, quantity, token) => {
    return apiRequest(`/cart/items/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });
  },

  removeItem: async (cartItemId, token) => {
    return apiRequest(`/cart/items/${cartItemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  clearCart: async (token) => {
    return apiRequest('/cart', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// Order Service
export const orderService = {
  getAll: async (token) => {
    return apiRequest('/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  getById: async (orderId, token) => {
    return apiRequest(`/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  create: async (orderData, token) => {
    return apiRequest('/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
  },

  updateStatus: async (orderId, status, token) => {
    return apiRequest(`/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
  }
};

// Export all services as default
export default {
  userService,
  bookService,
  categoryService,
  authorService,
  publisherService,
  cartService,
  orderService
};
