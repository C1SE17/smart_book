import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash, faSearch, faEdit, faEye, faEyeSlash, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { useUserManagement } from '../../hooks/useUserManagement';

const UserManagement = () => {
    const { users, loading, error, pagination, deleteUser, refreshData, loadUsersOnly } = useUserManagement();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
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
    
    // Pagination and sort state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('DESC');
    const searchTimeoutRef = useRef(null);

    // Debounced search
    const handleSearch = useCallback(async (searchValue) => {
        setSearchTerm(searchValue);
        setCurrentPage(1);
        
        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        // Set new timeout for debounced search
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                await loadUsersOnly(1, itemsPerPage, searchValue, sortBy, sortOrder, false);
            } catch (error) {
                console.error('Error in debounced search:', error);
            }
        }, 300);
    }, [itemsPerPage, sortBy, sortOrder, loadUsersOnly]);

    // Cleanup debounce timeout
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Handle sort
    const handleSort = useCallback(async (field) => {
        let newSortOrder = 'ASC';
        if (sortBy === field && sortOrder === 'ASC') {
            newSortOrder = 'DESC';
        }
        
        setSortBy(field);
        setSortOrder(newSortOrder);
        setCurrentPage(1);
        
        try {
            await loadUsersOnly(1, itemsPerPage, searchTerm, field, newSortOrder, false);
        } catch (error) {
            console.error('Error in sort:', error);
        }
    }, [sortBy, sortOrder, itemsPerPage, searchTerm, loadUsersOnly]);

    // Get sort icon
    const getSortIcon = (field) => {
        if (sortBy !== field) return faSort;
        return sortOrder === 'ASC' ? faSortUp : faSortDown;
    };

    // Handle filter changes
    const handleFilterChange = (type, value) => {
        if (type === 'role') {
            setFilterRole(value);
        }
    };

    // Handle page change
    const handlePageChange = async (page) => {
        if (page === currentPage) return;
        
        setCurrentPage(page);
        await loadUsersOnly(page, itemsPerPage, searchTerm, sortBy, sortOrder, false);
    };

    // Handle items per page change
    const handleItemsPerPageChange = async (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
        
        try {
            await loadUsersOnly(1, newItemsPerPage, searchTerm, sortBy, sortOrder);
        } catch (error) {
            console.error('Error changing items per page:', error);
        }
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
                    
                    await deleteUser(selectedUser.user_id);

                    // Refresh the current page to get updated data
                    await loadUsersOnly(currentPage, itemsPerPage, searchTerm, sortBy, sortOrder);
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
            {/* CSS để fix cột không bị lệch và smooth transitions */}
            <style jsx>{`
                .table-responsive {
                    scrollbar-width: thin;
                    scrollbar-color: #dee2e6 #f8f9fa;
                }
                .table-responsive::-webkit-scrollbar {
                    height: 8px;
                }
                .table-responsive::-webkit-scrollbar-track {
                    background: #f8f9fa;
                }
                .table-responsive::-webkit-scrollbar-thumb {
                    background: #dee2e6;
                    border-radius: 4px;
                }
                .table-responsive::-webkit-scrollbar-thumb:hover {
                    background: #adb5bd;
                }
                .table-fixed {
                    table-layout: fixed !important;
                    width: 100% !important;
                }
                .table-fixed th,
                .table-fixed td {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .table-fixed th:first-child,
                .table-fixed td:first-child {
                    white-space: normal;
                    word-wrap: break-word;
                }
                
                /* Smooth transitions for table rows */
                .table tbody tr {
                    transition: all 0.3s ease-in-out;
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .table tbody tr.fade-out {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                
                .table tbody tr.fade-in {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                
                /* Smooth button transitions */
                .page-link {
                    transition: all 0.2s ease-in-out !important;
                }
                
                .page-link:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .page-item.active .page-link {
                    transform: scale(1.05);
                }
                
                /* Loading spinner animation */
                .pagination-spinner {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                /* Table content fade animation */
                .table-content {
                    transition: opacity 0.3s ease-in-out;
                }
                
                .table-content.loading {
                    opacity: 0.6;
                }
            `}</style>
            
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
                        Tổng: {pagination.totalItems || 0} người dùng
                    </span>
                </div>
            </div>

            {/* Search and Sort Controls */}
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
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                {searchTerm && (
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary" 
                                        onClick={() => handleSearch('')}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Sắp xếp theo</label>
                            <select
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => handleSort(e.target.value)}
                            >
                                <option value="created_at">Ngày tạo</option>
                                <option value="name">Tên</option>
                                <option value="email">Email</option>
                                <option value="user_id">ID</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Thứ tự</label>
                            <select
                                className="form-select"
                                value={sortOrder}
                                onChange={(e) => {
                                    setSortOrder(e.target.value);
                                    handleSort(sortBy);
                                }}
                            >
                                <option value="DESC">Mới nhất</option>
                                <option value="ASC">Cũ nhất</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Hiển thị</label>
                            <select
                                className="form-select"
                                value={itemsPerPage}
                                onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
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
                                        setSortBy('created_at');
                                        setSortOrder('DESC');
                                        handleSearch('');
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
                    
                    <div className="table-responsive" style={{ minHeight: '400px' }}>
                        <table 
                            className="table table-hover table-fixed" 
                            style={{ 
                                tableLayout: "fixed",
                                width: "100%"
                            }}
                        >
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: "40%" }} className="py-3 fw-semibold text-secondary">
                                        <button 
                                            className="btn btn-link p-0 text-decoration-none text-secondary fw-semibold"
                                            onClick={() => handleSort('name')}
                                        >
                                            Thông tin
                                            <FontAwesomeIcon icon={getSortIcon('name')} className="ms-1" />
                                        </button>
                                    </th>
                                    <th style={{ width: "40%" }} className="py-3 fw-semibold text-secondary">
                                        <button 
                                            className="btn btn-link p-0 text-decoration-none text-secondary fw-semibold"
                                            onClick={() => handleSort('email')}
                                        >
                                            Liên hệ
                                            <FontAwesomeIcon icon={getSortIcon('email')} className="ms-1" />
                                        </button>
                                    </th>
                                    <th style={{ width: "20%" }} className="py-3 fw-semibold text-secondary text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="table-content">
                                {users.map((user, index) => (
                                    <tr key={user.user_id} className="fade-in" style={{ animationDelay: `${index * 50}ms` }}>
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

                    {users.length === 0 && !loading && (
                        <div className="text-center py-4">
                            <FontAwesomeIcon icon={faUser} size="3x" className="text-muted mb-3" />
                            <p className="text-muted">Không tìm thấy người dùng nào</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="d-flex align-items-center">
                                <span className="text-muted me-3">
                                    Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trong {pagination.totalItems} kết quả
                                </span>
                            </div>
                            
                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${!pagination.hasPrevPage || false ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(1)}
                                            disabled={!pagination.hasPrevPage || false}
                                            title="Trang đầu"
                                            style={{ transition: 'all 0.2s ease' }}
                                        >
                                            <i className="fas fa-angle-double-left"></i>
                                        </button>
                                    </li>
                                    <li className={`page-item ${!pagination.hasPrevPage || false ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                                            disabled={!pagination.hasPrevPage || false}
                                            title="Trang trước"
                                            style={{ transition: 'all 0.2s ease' }}
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                    </li>
                                    
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else {
                                            const startPage = Math.max(1, pagination.currentPage - 2);
                                            const endPage = Math.min(pagination.totalPages, startPage + 4);
                                            pageNum = startPage + i;
                                            if (pageNum > endPage) return null;
                                        }
                                        
                                        return (
                                            <li key={pageNum} className={`page-item ${pagination.currentPage === pageNum ? 'active' : ''} ${false ? 'disabled' : ''}`}>
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => handlePageChange(pageNum)}
                                                    disabled={false}
                                                    style={{ transition: 'all 0.2s ease' }}
                                                >
                                                    {pageNum}
                                                </button>
                                            </li>
                                        );
                                    })}
                                    
                                    <li className={`page-item ${!pagination.hasNextPage || false ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                                            disabled={!pagination.hasNextPage || false}
                                            title="Trang sau"
                                            style={{ transition: 'all 0.2s ease' }}
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                    </li>
                                    <li className={`page-item ${!pagination.hasNextPage || false ? 'disabled' : ''}`}>
                                        <button 
                                            className="page-link" 
                                            onClick={() => handlePageChange(pagination.totalPages)}
                                            disabled={!pagination.hasNextPage || false}
                                            title="Trang cuối"
                                            style={{ transition: 'all 0.2s ease' }}
                                        >
                                            <i className="fas fa-angle-double-right"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
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
