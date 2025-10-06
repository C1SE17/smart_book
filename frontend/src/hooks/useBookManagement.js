import { useState, useEffect, useCallback } from 'react';
import { bookApi, categoryApi, authorApi, publisherApi } from '../services/bookApi';

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

    // Load dữ liệu ban đầu
    const loadInitialData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [booksRes, categoriesRes, authorsRes, publishersRes] = await Promise.all([
                bookApi.getAllBooks({ limit: 1000 }), // Lấy tối đa 1000 sách
                categoryApi.getAllCategories(),
                authorApi.getAllAuthors(),
                publisherApi.getAllPublishers()
            ]);

            if (booksRes.success) {
                setBooks(booksRes.data);
            } else {
                throw new Error(booksRes.message);
            }

            if (categoriesRes.success) {
                setCategories(categoriesRes.data);
                console.log('✅ Categories loaded:', categoriesRes.data);
            }

            if (authorsRes.success) {
                setAuthors(authorsRes.data);
                console.log('✅ Authors loaded:', authorsRes.data);
            }

            if (publishersRes.success) {
                setPublishers(publishersRes.data);
                console.log('✅ Publishers loaded:', publishersRes.data);
            }

            console.log('🎉 All data loaded successfully from real API!');
        } catch (err) {
            console.error('❌ Error loading data from real API:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Tạo sách mới
    const createBook = useCallback(async (bookData) => {
        try {
            console.log('📝 Creating book:', bookData);
            setLoading(true);
            setError(null);

            const response = await bookApi.createBook(bookData);

            if (response.success) {
                console.log('✅ Book created successfully:', response.data);
                // Reload data to get updated list
                await loadInitialData();
                return { success: true, data: response.data, message: response.message };
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error('❌ Error creating book:', err);
            setError(err.message);
            return { success: false, data: null, message: err.message };
        } finally {
            setLoading(false);
        }
    }, [loadInitialData]);

    // Cập nhật sách
    const updateBook = useCallback(async (id, bookData) => {
        try {
            console.log('✏️ Updating book:', id, bookData);
            setLoading(true);
            setError(null);

            const response = await bookApi.updateBook(id, bookData);

            if (response.success) {
                console.log('✅ Book updated successfully:', response.data);
                // Reload data to get updated list
                await loadInitialData();
                return { success: true, data: response.data, message: response.message };
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error('❌ Error updating book:', err);
            setError(err.message);
            return { success: false, data: null, message: err.message };
        } finally {
            setLoading(false);
        }
    }, [loadInitialData]);

    // Xóa sách
    const deleteBook = useCallback(async (id) => {
        try {
            console.log('🗑️ Deleting book:', id);
            setLoading(true);
            setError(null);

            const response = await bookApi.deleteBook(id);

            if (response.success) {
                console.log('✅ Book deleted successfully');
                // Reload data to get updated list
                await loadInitialData();
                return { success: true, data: response.data, message: response.message };
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error('❌ Error deleting book:', err);
            setError(err.message);
            return { success: false, data: null, message: err.message };
        } finally {
            setLoading(false);
        }
    }, [loadInitialData]);

    // Tìm kiếm sách
    const searchBooks = useCallback(async (query) => {
        try {
            console.log('🔍 Searching books:', query);
            setLoading(true);
            setError(null);

            const response = await bookApi.searchBooks(query);

            if (response.success) {
                console.log('✅ Search completed:', response.data);
                setBooks(response.data);
                return { success: true, data: response.data, message: response.message };
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error('❌ Error searching books:', err);
            setError(err.message);
            return { success: false, data: null, message: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Refresh dữ liệu
    const refreshData = useCallback(async () => {
        console.log('🔄 Refreshing data...');
        await loadInitialData();
    }, [loadInitialData]);

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

        // Actions
        createBook,
        updateBook,
        deleteBook,
        searchBooks,
        refreshData,
        loadInitialData
    };
};
