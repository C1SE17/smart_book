import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash, faSearch, faEdit, faEye, faEyeSlash, faCircle, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import apiService from '../../services';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState(''); // 'view', 'edit', 'delete'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: 'customer'
    });
    const [formErrors, setFormErrors] = useState({});
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(50);
    const [isPageChanging, setIsPageChanging] = useState(false);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch users from Backend API with pagination
    const fetchUsers = async (page = currentPage, limit = itemsPerPage) => {
        setLoading(true);
        try {
            console.log(`🔄 Fetching users from backend API - Page: ${page}, Limit: ${limit}...`);
            console.log('🔧 API Service:', apiService);
            console.log('🔧 API Service methods:', Object.keys(apiService));
            
            // Check token
            const token = localStorage.getItem('token');
            console.log('🔑 Token:', token ? token.substring(0, 20) + '...' : 'No token');
            
            // Sử dụng apiService để lấy danh sách users với phân trang
            const response = await apiService.getAllUsers({ page, limit });
            console.log('📡 Fetched users data from backend:', response);
            
            // Check if response is successful
            if (!response.success) {
                throw new Error(response.message || 'API call failed');
            }
            
            // Extract users array from response object
            const usersData = response.data || response.users || response;
            console.log('Users array:', usersData);
            
            // Check if usersData is an array
            if (!Array.isArray(usersData)) {
                throw new Error('Invalid response format: expected array');
            }
            
            // Add default values for missing fields (hiển thị tất cả users bao gồm admin)
            const processedUsers = usersData.map(user => ({
                ...user,
                last_login: user.updated_at || user.created_at,
                // Tạo trạng thái online/offline ảo random
                isOnline: Math.random() > 0.3, // 70% chance online
                lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() // Random trong 24h qua
            }));

            console.log('Processed users:', processedUsers);
            setUsers(processedUsers);
            
            // Update pagination info from backend response
            if (response.total !== undefined) {
                setTotalUsers(response.total);
                setTotalPages(response.totalPages || Math.ceil(response.total / limit));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            
            // Hiển thị thông báo lỗi chi tiết
            let errorMessage = 'Không thể tải danh sách người dùng';
            if (error.message.includes('fetch')) {
                errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.';
            } else if (error.message.includes('401')) {
                errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            } else if (error.message.includes('403')) {
                errorMessage = 'Bạn không có quyền truy cập trang này.';
            } else if (error.message.includes('404')) {
                errorMessage = 'API endpoint không tồn tại.';
            } else if (error.message.includes('500')) {
                errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
            }
            
            // Hiển thị thông báo lỗi
            if (window.showToast) {
                window.showToast(errorMessage, 'error');
            } else {
                alert(errorMessage);
            }
            
            // Fallback to empty array on error
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users based on search term, role, and status
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        
        const matchesStatus = filterStatus === 'all' || 
                            (filterStatus === 'online' && user.isOnline) ||
                            (filterStatus === 'offline' && !user.isOnline);
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    const currentUsers = filteredUsers;

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterRole, filterStatus, itemsPerPage]);

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle filter changes
    const handleFilterChange = (type, value) => {
        if (type === 'role') {
            setFilterRole(value);
        }
    };

    // Pagination handlers
    const handlePageChange = (page) => {
        if (page === currentPage) return;
        
        setIsPageChanging(true);
        setCurrentPage(page);
        
        // Fetch new page data
        fetchUsers(page, itemsPerPage).finally(() => {
            setIsPageChanging(false);
        });
    };

    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page
        
        // Fetch data with new items per page
        fetchUsers(1, newItemsPerPage);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                    pages.push('...');
                }
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    // Handle modal actions
    const handleModalAction = (user, action) => {
        setSelectedUser(user);
        setActionType(action);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role
        });
        setShowModal(true);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (actionType === 'delete') {
            if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản ${selectedUser.name}?`)) {
                try {
                    console.log('Deleting user:', selectedUser.user_id);
                    
                    // Sử dụng apiService để xóa user
                    await apiService.deleteUser(selectedUser.user_id);

                    // Refresh the current page to get updated data
                    fetchUsers(currentPage, itemsPerPage);
                    setShowModal(false);
                    
                    if (window.showToast) {
                        window.showToast('Tài khoản đã được xóa thành công!', 'success');
                    }
                } catch (error) {
                    console.error('Error deleting user:', error);
                    if (window.showToast) {
                        window.showToast('Có lỗi xảy ra khi xóa tài khoản!', 'error');
                    }
                }
            }
        }
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
        setActionType('');
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            role: 'customer'
        });
        setFormErrors({});
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Format last seen time
    const formatLastSeen = (lastSeen) => {
        const now = new Date();
        const lastSeenDate = new Date(lastSeen);
        const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} giờ trước`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} ngày trước`;
        
        return lastSeenDate.toLocaleDateString('vi-VN');
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            return date.toLocaleDateString('vi-VN');
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'N/A';
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="mb-1">
                        <FontAwesomeIcon icon={faUser} className="me-2 text-primary" />
                        Quản lý người dùng
                    </h2>
                    <p className="text-muted mb-0">Quản lý tài khoản khách hàng</p>
                </div>
                <div className="d-flex align-items-center">
                    <span className="badge bg-primary">
                        Tổng: {totalUsers} người dùng
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">Tìm kiếm</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm theo tên, email, số điện thoại..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Vai trò</label>
                            <select
                                className="form-select"
                                value={filterRole}
                                onChange={(e) => handleFilterChange('role', e.target.value)}
                            >
                                <option value="all">Tất cả vai trò</option>
                                <option value="customer">Khách hàng</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Trạng thái</label>
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">Tất cả</option>
                                <option value="online">Online</option>
                                <option value="offline">Offline</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">&nbsp;</label>
                            <div className="d-grid">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilterRole('all');
                                        setFilterStatus('all');
                                    }}
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card">
                <div className="card-body position-relative">
                    {/* Loading overlay for page changes */}
                    {isPageChanging && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
                             style={{ 
                                 backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                                 zIndex: 10,
                                 borderRadius: '0.375rem'
                             }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Đang chuyển trang...</span>
                            </div>
                        </div>
                    )}
                    
                    <div className="table-responsive" style={{ minHeight: '400px' }}>
                        <table 
                            className="table table-hover" 
                            style={{ 
                                transition: 'opacity 0.2s ease-in-out',
                                opacity: isPageChanging ? 0.7 : 1
                            }}
                        >
                            <thead className="table-light">
                                <tr>
                                    <th>Thông tin</th>
                                    <th>Trạng thái</th>
                                    <th>Liên hệ</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user.user_id}>
                                        <td>
                                            <div>
                                                <div className="fw-bold">
                                                    {user.name}
                                                </div>
                                                <small className="text-muted">
                                                    ID: {user.user_id} | {formatDate(user.created_at)}
                                                </small>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div className="d-flex align-items-center mb-1">
                                                    <span className={`badge ${user.isOnline ? 'bg-success' : 'bg-secondary'} me-2`}>
                                                        {user.isOnline ? 'Online' : 'Offline'}
                                                    </span>
                                                    {user.isOnline ? (
                                                        <>
                                                            <FontAwesomeIcon icon={faCircleCheck} className="text-success me-1" />
                                                            <span className="small text-muted">Đang hoạt động</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FontAwesomeIcon icon={faCircle} className="text-danger me-1" />
                                                            <span className="small text-muted">{formatLastSeen(user.lastSeen)}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div className="small">{user.email}</div>
                                                <div className="small text-muted">{user.phone || 'Chưa cập nhật'}</div>
                                                <div className="small text-muted">{user.address || 'Chưa cập nhật'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button
                                                    className="btn btn-outline-info btn-sm"
                                                    onClick={() => handleModalAction(user, 'view')}
                                                    title="Xem chi tiết"
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleModalAction(user, 'delete')}
                                                    title="Xóa tài khoản"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {currentUsers.length === 0 && (
                        <div className="text-center py-4">
                            <FontAwesomeIcon icon={faUser} size="3x" className="text-muted mb-3" />
                            <p className="text-muted">Không tìm thấy người dùng nào</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {currentUsers.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="d-flex align-items-center">
                                <span className="text-muted me-3">
                                    Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalUsers)} trong {totalUsers} kết quả
                                </span>
                                <div className="d-flex align-items-center">
                                    <label className="form-label me-2 mb-0">Hiển thị:</label>
                                    <select 
                                        className="form-select form-select-sm" 
                                        style={{width: 'auto'}}
                                        value={itemsPerPage} 
                                        onChange={handleItemsPerPageChange}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                            </div>
                            
                            {totalPages > 1 && (
                                <nav>
                                    <ul className="pagination pagination-sm mb-0">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1 || isPageChanging}
                                                style={{ transition: 'all 0.2s ease' }}
                                            >
                                                Trước
                                            </button>
                                        </li>
                                        
                                        {getPageNumbers().map((page, index) => (
                                            <li key={index} className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}>
                                                {page === '...' ? (
                                                    <span className="page-link">...</span>
                                                ) : (
                                                    <button 
                                                        className="page-link" 
                                                        onClick={() => handlePageChange(page)}
                                                        disabled={isPageChanging}
                                                        style={{ transition: 'all 0.2s ease' }}
                                                    >
                                                        {page}
                                                    </button>
                                                )}
                                            </li>
                                        ))}
                                        
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button 
                                                className="page-link" 
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages || isPageChanging}
                                                style={{ transition: 'all 0.2s ease' }}
                                            >
                                                Sau
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {actionType === 'view' && 'Chi tiết người dùng'}
                                    {actionType === 'edit' && 'Chỉnh sửa người dùng'}
                                    {actionType === 'delete' && 'Xóa tài khoản'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {actionType === 'view' && (
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h6>Thông tin cá nhân</h6>
                                                <p><strong>Tên:</strong> {selectedUser?.name}</p>
                                                <p><strong>Email:</strong> {selectedUser?.email}</p>
                                                <p><strong>Số điện thoại:</strong> {selectedUser?.phone || 'Chưa cập nhật'}</p>
                                                <p><strong>Địa chỉ:</strong> {selectedUser?.address || 'Chưa cập nhật'}</p>
                                                <p><strong>Vai trò:</strong> 
                                                    <span className={`badge ms-2 ${selectedUser?.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                                        {selectedUser?.role === 'admin' ? 'Admin' : 'Khách hàng'}
                                                    </span>
                                                </p>
                                                <p><strong>Trạng thái:</strong> 
                                                    <span className={`badge ms-2 ${selectedUser?.isOnline ? 'bg-success' : 'bg-secondary'}`}>
                                                        {selectedUser?.isOnline ? 'Online' : 'Offline'}
                                                    </span>
                                                </p>
                                                <p><strong>Hoạt động cuối:</strong> 
                                                    {selectedUser?.isOnline ? (
                                                        <>
                                                            <FontAwesomeIcon icon={faCircleCheck} className="text-success me-1" />
                                                            Đang hoạt động
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FontAwesomeIcon icon={faCircle} className="text-danger me-1" />
                                                            {formatLastSeen(selectedUser?.lastSeen)}
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <h6>Thông tin tài khoản</h6>
                                                <p><strong>Ngày tạo:</strong> {formatDate(selectedUser?.created_at)}</p>
                                                <p><strong>Cập nhật cuối:</strong> {formatDate(selectedUser?.updated_at)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {actionType === 'delete' && (
                                        <div className="alert alert-warning">
                                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                                            <strong>Cảnh báo:</strong> Bạn sắp xóa vĩnh viễn tài khoản này. Hành động này không thể hoàn tác!
                                        </div>
                                    )}

                                    {actionType === 'delete' && (
                                        <div className="mb-3">
                                            <label className="form-label">Xác nhận xóa tài khoản:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder={`Nhập "${selectedUser?.name}" để xác nhận`}
                                                required
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeModal}
                                    >
                                        Hủy
                                    </button>
                                    {actionType !== 'view' && (
                                        <button
                                            type="submit"
                                            className={`btn ${
                                                actionType === 'delete' ? 'btn-danger' : 'btn-primary'
                                            }`}
                                        >
                                            {actionType === 'delete' && 'Xóa tài khoản'}
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
