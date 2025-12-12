import { useState, useEffect, useCallback } from 'react';
import apiService from '../services';

export const useUserManagement = () => {
    const [users, setUsers] = useState([]);
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

    // Load initial data
    const loadInitialData = useCallback(async (page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'DESC') => {
        try {
            setLoading(true);
            setError(null);

            console.log(` [useUserManagement] Loading users - Page: ${page}, Limit: ${limit}, Search: "${search}", Sort: ${sortBy} ${sortOrder}`);

            const response = await apiService.getAllUsers({ 
                page, 
                limit, 
                search, 
                sortBy, 
                sortOrder 
            });

            if (response.success) {
                setUsers(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
                console.log(` [useUserManagement] Loaded ${response.data.length} users, Total: ${response.pagination?.totalItems || 0}`);
            } else {
                throw new Error(response.message || 'Failed to load users');
            }
        } catch (err) {
            console.error('Error loading users:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Load only users (for pagination, search, sort)
    const loadUsersOnly = useCallback(async (page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'DESC', showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            setError(null);

            console.log(` [useUserManagement] Loading users for pagination - Page: ${page}, Limit: ${limit}, Search: "${search}", Sort: ${sortBy} ${sortOrder}`);

            const response = await apiService.getAllUsers({ 
                page, 
                limit, 
                search, 
                sortBy, 
                sortOrder 
            });

            if (response.success) {
                setUsers(response.data);
                if (response.pagination) {
                    setPagination(response.pagination);
                }
                console.log(` [useUserManagement] Loaded ${response.data.length} users for pagination`);
            } else {
                throw new Error(response.message || 'Failed to load users');
            }
        } catch (err) {
            console.error('Error loading users for pagination:', err);
            setError(err.message);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, []);

    // Delete user
    const deleteUser = useCallback(async (userId) => {
        try {
            console.log(` [useUserManagement] Deleting user ID: ${userId}`);
            const response = await apiService.deleteUser(userId);
            
            if (response.success || response.message) {
                console.log(` [useUserManagement] User deleted successfully`);
                return { success: true, message: response.message || 'User deleted successfully' };
            } else {
                throw new Error(response.error || 'Failed to delete user');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            throw err;
        }
    }, []);

    // Refresh data (uses loadUsersOnly)
    const refreshData = useCallback(async (page = 1, limit = 10, search = '', sortBy = 'created_at', sortOrder = 'DESC') => {
        await loadUsersOnly(page, limit, search, sortBy, sortOrder);
    }, [loadUsersOnly]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    return {
        users,
        loading,
        error,
        pagination,
        deleteUser,
        refreshData,
        loadInitialData,
        loadUsersOnly
    };
};
