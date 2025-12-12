import { useState, useEffect, useCallback } from 'react';
import apiService from '../services';

/**
 * Custom hook cho quản lý sách với Real API
 * Sử dụng backend API thật thay vì mock API
 */
export const useBookManagement = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false
    });

    // Load dữ liệu ban đầu (bao gồm cả categories, authors, publishers)
    const loadInitialData = useCallback(async (page = 1, limit = 10, search = '') => {
        try {
            setLoading(true);
            setError(null);

            const [booksRes, categoriesRes, authorsRes, publishersRes] = await Promise.all([
                apiService.getBooks({ page, limit, search }), // Sử dụng phân trang
                apiService.getCategories(),
                apiService.getAllAuthors(),
                apiService.getPublishers()
            ]);

            if (booksRes.success) {
                setBooks(booksRes.data);
                if (booksRes.pagination) {
                    setPagination(booksRes.pagination);
                }
            } else {
                throw new Error(booksRes.message);
            }

            if (categoriesRes.success) {
                setCategories(categoriesRes.data);
                console.log('Categories loaded:', categoriesRes.data);
            }

            if (authorsRes.success) {
                setAuthors(authorsRes.data);
                console.log('Authors loaded:', authorsRes.data);
            }

            if (publishersRes.success) {
                setPublishers(publishersRes.data);
                console.log('Publishers loaded:', publishersRes.data);
            }

            console.log(' All data loaded successfully from real API!');
        } catch (err) {
            console.error('Error loading data from real API:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load chỉ dữ liệu sách (cho phân trang, không reload categories/authors/publishers)
    const loadBooksOnly = useCallback(async (page = 1, limit = 10, search = '', showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }
            setError(null);

            const booksRes = await apiService.getBooks({ page, limit, search });

            if (booksRes.success) {
                setBooks(booksRes.data);
                if (booksRes.pagination) {
                    setPagination(booksRes.pagination);
                }
                console.log('Books loaded for pagination:', booksRes.data.length);
            } else {
                throw new Error(booksRes.message);
            }
        } catch (err) {
            console.error('Error loading books for pagination:', err);
            setError(err.message);
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    }, []);

    // Tạo sách mới
    const createBook = useCallback(async (bookData) => {
        try {
            console.log('Creating book:', bookData);
            setLoading(true);
            setError(null);

            const response = await apiService.createBook(bookData);

            if (response.success) {
                console.log('Book created successfully:', response.data);
                // Reload data to get updated list
                await loadInitialData(1, 10, ''); // Reset to first page after creating
                return { success: true, data: response.data, message: response.message };
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error('Error creating book:', err);
            setError(err.message);
            return { success: false, data: null, message: err.message };
        } finally {
            setLoading(false);
        }
    }, [loadInitialData]);

    // Cập nhật sách
    const updateBook = useCallback(async (id, bookData) => {
        try {
            console.log(' Updating book:', id, bookData);
            setLoading(true);
            setError(null);

            const response = await apiService.updateBook(id, bookData);

            if (response.success) {
                console.log('Book updated successfully:', response.data);
                // Reload data to get updated list
                await loadInitialData(1, 10, ''); // Reset to first page after updating
                return { success: true, data: response.data, message: response.message };
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error('Error updating book:', err);
            setError(err.message);
            return { success: false, data: null, message: err.message };
        } finally {
            setLoading(false);
        }
    }, [loadInitialData]);

    // Xóa sách
    const deleteBook = useCallback(async (id) => {
        try {
            console.log(' Deleting book:', id);
            setLoading(true);
            setError(null);

            const response = await apiService.deleteBook(id);

            if (response.success) {
                console.log('Book deleted successfully');
                // Reload data to get updated list
                await loadInitialData(1, 10, ''); // Reset to first page after deleting
                return { success: true, data: response.data, message: response.message };
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error('Error deleting book:', err);
            setError(err.message);
            return { success: false, data: null, message: err.message };
        } finally {
            setLoading(false);
        }
    }, [loadInitialData]);

    // Tìm kiếm sách
    const searchBooks = useCallback(async (query, page = 1, limit = 10) => {
        try {
            console.log(' Searching books:', query);
            setLoading(true);
            setError(null);

            // Sử dụng API searchBooks với tham số q
            const response = await apiService.searchBooks(query, page, limit);

            if (response.success) {
                console.log('Search completed:', response.data);
                setBooks(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
                return { success: true, data: response.data, message: response.message };
            } else {
                console.error('Search failed:', response.message);
                setError(response.message);
                return { success: false, data: null, message: response.message };
            }
        } catch (err) {
            console.error('Error searching books:', err);
            setError(err.message);
            return { success: false, data: null, message: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Refresh dữ liệu (chỉ sách, không reload categories/authors/publishers)
    const refreshData = useCallback(async (page = 1, limit = 10, search = '') => {
        console.log(' Refreshing books data...');
        await loadBooksOnly(page, limit, search);
    }, [loadBooksOnly]);

    // Load dữ liệu khi component mount
    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    return {
        // State
        books,
        categories,
        authors,
        publishers,
        loading,
        error,
        pagination,

        // Actions
        createBook,
        updateBook,
        deleteBook,
        searchBooks,
        refreshData,
        loadInitialData,
        loadBooksOnly
    };
};
