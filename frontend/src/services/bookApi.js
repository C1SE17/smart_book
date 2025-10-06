/**
 * Real API Service - Gọi API backend thật
 * Thay thế mock API bằng real API calls
 */

const API_BASE_URL = 'http://localhost:3306/api';

// Helper function để gọi API
const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`API Error: ${endpoint}`, error);
        throw error;
    }
};

// Books API
export const bookApi = {
    // Lấy tất cả sách
    getAllBooks: async (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value);
            }
        });

        const queryString = queryParams.toString();
        const endpoint = `/books${queryString ? `?${queryString}` : ''}`;

        const data = await apiCall(endpoint);
        return {
            success: true,
            data: data,
            message: 'Lấy danh sách sách thành công'
        };
    },

    // Lấy sách theo ID
    getBookById: async (id) => {
        const data = await apiCall(`/books/${id}`);
        return {
            success: true,
            data: data,
            message: 'Lấy thông tin sách thành công'
        };
    },

    // Tạo sách mới
    createBook: async (bookData) => {
        const data = await apiCall('/books', {
            method: 'POST',
            body: JSON.stringify(bookData)
        });
        return {
            success: true,
            data: data,
            message: 'Thêm sách thành công'
        };
    },

    // Cập nhật sách
    updateBook: async (id, bookData) => {
        const data = await apiCall(`/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify(bookData)
        });
        return {
            success: true,
            data: data,
            message: 'Cập nhật sách thành công'
        };
    },

    // Xóa sách
    deleteBook: async (id) => {
        await apiCall(`/books/${id}`, {
            method: 'DELETE'
        });
        return {
            success: true,
            data: { id },
            message: 'Xóa sách thành công'
        };
    },

    // Tìm kiếm sách
    searchBooks: async (query) => {
        const data = await apiCall(`/books?search=${encodeURIComponent(query)}`);
        return {
            success: true,
            data: data,
            message: `Tìm thấy ${data.length} sách`
        };
    }
};

// Categories API
export const categoryApi = {
    getAllCategories: async () => {
        const data = await apiCall('/categories');
        return {
            success: true,
            data: data,
            message: 'Lấy danh sách danh mục thành công'
        };
    },

    getCategoryById: async (id) => {
        const data = await apiCall(`/categories/${id}`);
        return {
            success: true,
            data: data,
            message: 'Lấy thông tin danh mục thành công'
        };
    },

    createCategory: async (categoryData) => {
        const data = await apiCall('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData)
        });
        return {
            success: true,
            data: data,
            message: 'Thêm danh mục thành công'
        };
    },

    updateCategory: async (id, categoryData) => {
        const data = await apiCall(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData)
        });
        return {
            success: true,
            data: data,
            message: 'Cập nhật danh mục thành công'
        };
    },

    deleteCategory: async (id) => {
        await apiCall(`/categories/${id}`, {
            method: 'DELETE'
        });
        return {
            success: true,
            data: { id },
            message: 'Xóa danh mục thành công'
        };
    }
};

// Authors API
export const authorApi = {
    getAllAuthors: async () => {
        const data = await apiCall('/authors');
        return {
            success: true,
            data: data,
            message: 'Lấy danh sách tác giả thành công'
        };
    }
};

// Publishers API
export const publisherApi = {
    getAllPublishers: async () => {
        const data = await apiCall('/publishers');
        return {
            success: true,
            data: data,
            message: 'Lấy danh sách nhà xuất bản thành công'
        };
    }
};

// Utility functions
export const apiUtils = {
    // Test API connection
    testConnection: async () => {
        try {
            await apiCall('/books?limit=1');
            return { success: true, message: 'API connection successful' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};
