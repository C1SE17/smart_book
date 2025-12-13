import { useState, useEffect, useCallback } from 'react';
import apiService from '../services';

/**
 * Custom hook cho quản lý kho với Real API
 * Sử dụng backend API thật với phân trang
 */
export const useWarehouseManagement = () => {
    const [warehouseItems, setWarehouseItems] = useState([]);
    const [books, setBooks] = useState([]);
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
    const [summary, setSummary] = useState({
        totalProducts: 0,
        totalQuantity: 0,
        lowStock: 0,
        outOfStock: 0,
        totalQuantityRaw: 0
    });

    // Load dữ liệu ban đầu (bao gồm cả books)
    const loadInitialData = useCallback(async (page = 1, limit = 10, search = '') => {
        try {
            setLoading(true);
            setError(null);

            const [warehouseRes, booksRes] = await Promise.all([
                apiService.getWarehouseItems({ page, limit, search }),
                apiService.getBooks({ limit: 1000 }) // Load tất cả books cho dropdown
            ]);

            if (warehouseRes.success) {
                setWarehouseItems(warehouseRes.data);
                if (warehouseRes.pagination) {
                    setPagination(warehouseRes.pagination);
                }
                if (warehouseRes.summary) {
                    setSummary({
                        totalProducts: warehouseRes.summary.totalProducts ?? 0,
                        totalQuantity: warehouseRes.summary.totalQuantity ?? warehouseRes.summary.totalQuantityRaw ?? 0,
                        lowStock: warehouseRes.summary.lowStock ?? 0,
                        outOfStock: warehouseRes.summary.outOfStock ?? 0,
                        totalQuantityRaw: warehouseRes.summary.totalQuantityRaw ?? 0
                    });
                }
            } else {
                throw new Error(warehouseRes.message);
            }

            if (booksRes.success) {
                setBooks(booksRes.data);
                console.log('Books loaded for warehouse:', booksRes.data.length);
            }

            console.log(' Warehouse data loaded successfully from real API!');
        } catch (err) {
            console.error('Error loading warehouse data from real API:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load chỉ dữ liệu warehouse (cho phân trang, không reload books)
    const loadWarehouseOnly = useCallback(async (page = 1, limit = 10, search = '', showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }
            setError(null);

            const warehouseRes = await apiService.getWarehouseItems({ page, limit, search });

            if (warehouseRes.success) {
                setWarehouseItems(warehouseRes.data);
                if (warehouseRes.pagination) {
                    setPagination(warehouseRes.pagination);
                }
                if (warehouseRes.summary) {
                    setSummary({
                        totalProducts: warehouseRes.summary.totalProducts ?? 0,
                        totalQuantity: warehouseRes.summary.totalQuantity ?? warehouseRes.summary.totalQuantityRaw ?? 0,
                        lowStock: warehouseRes.summary.lowStock ?? 0,
                        outOfStock: warehouseRes.summary.outOfStock ?? 0,
                        totalQuantityRaw: warehouseRes.summary.totalQuantityRaw ?? 0
                    });
                }
                console.log('Warehouse items loaded for pagination:', warehouseRes.data.length);
            } else {
                throw new Error(warehouseRes.message);
            }
        } catch (err) {
            console.error('Error loading warehouse items for pagination:', err);
            setError(err.message);
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    }, []);

    // Tạo warehouse item mới
    const createWarehouseItem = useCallback(async (warehouseData) => {
        try {
            console.log('Creating warehouse item:', warehouseData);
            setLoading(true);
            setError(null);

            const response = await apiService.createWarehouseItem(warehouseData);

            if (response.success) {
                console.log('Warehouse item created successfully:', response.data);
                // Reload data to get updated list
                await loadInitialData(1, 10, ''); // Reset to first page after creating
                return { success: true, data: response.data, message: response.message };
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error('Error creating warehouse item:', err);
            setError(err.message);
            return { success: false, data: null, message: err.message };
        } finally {
            setLoading(false);
        }
    }, [loadInitialData]);

    // Cập nhật warehouse item
    const updateWarehouseItem = useCallback(async (bookId, warehouseData) => {
        try {
            console.log(' Updating warehouse item:', bookId, warehouseData);
            setLoading(true);
            setError(null);

            const response = await apiService.updateWarehouseItem(bookId, warehouseData);

            if (response.success) {
                console.log('Warehouse item updated successfully:', response.data);
                // Reload data to get updated list
                await loadInitialData(1, 10, ''); // Reset to first page after updating
                return { success: true, data: response.data, message: response.message };
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error('Error updating warehouse item:', err);
            setError(err.message);
            return { success: false, data: null, message: err.message };
        } finally {
            setLoading(false);
        }
    }, [loadInitialData]);

    // Xóa warehouse item
    const deleteWarehouseItem = useCallback(async (bookId) => {
        try {
            console.log(' Deleting warehouse item:', bookId);
            setLoading(true);
            setError(null);

            const response = await apiService.deleteWarehouseItem(bookId);

            if (response.success) {
                console.log('Warehouse item deleted successfully');
                // Reload data to get updated list
                await loadInitialData(1, 10, ''); // Reset to first page after deleting
                return { success: true, data: response.data, message: response.message };
            } else {
                throw new Error(response.message);
            }
        } catch (err) {
            console.error('Error deleting warehouse item:', err);
            setError(err.message);
            return { success: false, data: null, message: err.message };
        } finally {
            setLoading(false);
        }
    }, [loadInitialData]);

    // Tìm kiếm warehouse items
    const searchWarehouseItems = useCallback(async (query, page = 1, limit = 10) => {
        try {
            console.log(' Searching warehouse items:', query);
            setLoading(true);
            setError(null);

            const response = await apiService.getWarehouseItems({ page, limit, search: query });

            if (response.success) {
                console.log('Search completed:', response.data);
                setWarehouseItems(response.data);
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
            console.error('Error searching warehouse items:', err);
            setError(err.message);
            return { success: false, data: null, message: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    // Refresh dữ liệu (chỉ warehouse, không reload books)
    const refreshData = useCallback(async (page = 1, limit = 10, search = '') => {
        console.log(' Refreshing warehouse data...');
        await loadWarehouseOnly(page, limit, search);
    }, [loadWarehouseOnly]);

    // Load dữ liệu khi component mount
    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    return {
        // State
        warehouseItems,
        books,
        loading,
        error,
        pagination,
        summary,

        // Actions
        createWarehouseItem,
        updateWarehouseItem,
        deleteWarehouseItem,
        searchWarehouseItems,
        refreshData,
        loadInitialData,
        loadWarehouseOnly
    };
};
