import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrash, faSearch, faEdit, faEye, faEyeSlash, faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { useUserManagement } from '../../hooks/useUserManagement';
import { useTranslation } from 'react-i18next';

const UserManagement = () => {
    const { users, loading, error, pagination, deleteUser, refreshData, loadUsersOnly } = useUserManagement();
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

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
    const [deleteConfirmation, setDeleteConfirmation] = useState(''); // State cho input xác nhận xóa

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
            // Validate: phải nhập đúng tên account
            if (!deleteConfirmation || deleteConfirmation.trim() !== selectedUser.name) {
                setFormErrors({
                    deleteConfirmation: t('userManagement.modal.confirmation.error', { name: selectedUser.name })
                });
                return;
            }

            // Clear errors
            setFormErrors({});

            try {
                console.log('Deleting user:', selectedUser.user_id);

                await deleteUser(selectedUser.user_id);

                // Refresh the current page to get updated data
                await loadUsersOnly(currentPage, itemsPerPage, searchTerm, sortBy, sortOrder);
                setShowModal(false);
                setDeleteConfirmation(''); // Reset confirmation input

                if (window.showToast) {
                    window.showToast(t('userManagement.messages.deleteSuccess'), 'success');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                if (window.showToast) {
                    window.showToast(t('userManagement.messages.deleteError'), 'error');
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
        setDeleteConfirmation(''); // Reset confirmation input
    };
    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return t('userManagement.table.notAvailable');
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return t('userManagement.table.notAvailable');
            return date.toLocaleDateString(locale);
        } catch (error) {
            console.error('Error formatting date:', error);
            return t('userManagement.table.notAvailable');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('userManagement.loading.aria')}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            {/* CSS để fix cột không bị lệch và smooth transitions */}
            <style jsx="true">{`
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
                    /* Hover effects removed */
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
                        {t('userManagement.title')}
                    </h2>
                    <p className="text-muted mb-0">{t('userManagement.subtitle')}</p>
                </div>
                <div className="d-flex align-items-center">
                    <span className="badge bg-primary">
                        {t('userManagement.badge.total', { count: pagination.totalItems || 0 })}
                    </span>
                </div>
            </div>

            {/* Search and Sort Controls */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label">{t('userManagement.filters.search.label')}</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t('userManagement.filters.search.placeholder')}
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
                            <label className="form-label">{t('userManagement.filters.sortBy.label')}</label>
                            <select
                                className="form-select"
                                value={sortBy}
                                onChange={(e) => handleSort(e.target.value)}
                            >
                                <option value="created_at">{t('userManagement.filters.sortBy.options.createdAt')}</option>
                                <option value="name">{t('userManagement.filters.sortBy.options.name')}</option>
                                <option value="email">{t('userManagement.filters.sortBy.options.email')}</option>
                                <option value="user_id">{t('userManagement.filters.sortBy.options.userId')}</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">{t('userManagement.filters.sortOrder.label')}</label>
                            <select
                                className="form-select"
                                value={sortOrder}
                                onChange={(e) => {
                                    setSortOrder(e.target.value);
                                    handleSort(sortBy);
                                }}
                            >
                                <option value="DESC">{t('userManagement.filters.sortOrder.options.desc')}</option>
                                <option value="ASC">{t('userManagement.filters.sortOrder.options.asc')}</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">{t('userManagement.filters.itemsPerPage.label')}</label>
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
                                    {t('userManagement.filters.reset')}
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
                                            {t('userManagement.table.headers.info')}
                                            <FontAwesomeIcon icon={getSortIcon('name')} className="ms-1" />
                                        </button>
                                    </th>
                                    <th style={{ width: "40%" }} className="py-3 fw-semibold text-secondary">
                                        <button
                                            className="btn btn-link p-0 text-decoration-none text-secondary fw-semibold"
                                            onClick={() => handleSort('email')}
                                        >
                                            {t('userManagement.table.headers.contact')}
                                            <FontAwesomeIcon icon={getSortIcon('email')} className="ms-1" />
                                        </button>
                                    </th>
                                    <th style={{ width: "20%" }} className="py-3 fw-semibold text-secondary text-center">
                                        {t('userManagement.table.headers.actions')}
                                    </th>
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
                                                <div className="small text-muted">{user.phone || t('userManagement.table.notProvided')}</div>
                                                <div className="small text-muted">{user.address || t('userManagement.table.notProvided')}</div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <button
                                                    className="btn btn-outline-info btn-sm"
                                                    onClick={() => handleModalAction(user, 'view')}
                                                    title={t('userManagement.table.actions.viewTooltip')}
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => handleModalAction(user, 'delete')}
                                                    title={t('userManagement.table.actions.deleteTooltip')}
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
                            <p className="text-muted">{t('userManagement.table.empty')}</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <div className="d-flex align-items-center">
                                <span className="text-muted me-3">
                                    {t('userManagement.pagination.summary', {
                                        start: ((pagination.currentPage - 1) * pagination.itemsPerPage) + 1,
                                        end: Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems),
                                        total: pagination.totalItems
                                    })}
                                </span>
                            </div>

                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${!pagination.hasPrevPage || false ? 'disabled' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(1)}
                                            disabled={!pagination.hasPrevPage || false}
                                            title={t('userManagement.pagination.first')}
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
                                            title={t('userManagement.pagination.previous')}
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
                                            title={t('userManagement.pagination.next')}
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
                                            title={t('userManagement.pagination.last')}
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
                                    {actionType === 'view' && t('userManagement.modal.title.view')}
                                    {actionType === 'edit' && t('userManagement.modal.title.edit')}
                                    {actionType === 'delete' && t('userManagement.modal.title.delete')}
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
                                                <h6>{t('userManagement.modal.sections.personal')}</h6>
                                                <p><strong>{t('userManagement.modal.labels.name')}</strong> {selectedUser?.name}</p>
                                                <p><strong>{t('userManagement.modal.labels.email')}</strong> {selectedUser?.email}</p>
                                                <p><strong>{t('userManagement.modal.labels.phone')}</strong> {selectedUser?.phone || t('userManagement.table.notProvided')}</p>
                                                <p><strong>{t('userManagement.modal.labels.address')}</strong> {selectedUser?.address || t('userManagement.table.notProvided')}</p>
                                                <p><strong>{t('userManagement.modal.labels.role')}</strong>
                                                    <span className={`badge ms-2 ${selectedUser?.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                                        {selectedUser?.role === 'admin' ? t('userManagement.roles.admin') : t('userManagement.roles.customer')}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="col-md-6">
                                                <h6>{t('userManagement.modal.sections.account')}</h6>
                                                <p><strong>{t('userManagement.modal.labels.createdAt')}</strong> {formatDate(selectedUser?.created_at)}</p>
                                                <p><strong>{t('userManagement.modal.labels.updatedAt')}</strong> {formatDate(selectedUser?.updated_at)}</p>
                                            </div>
                                        </div>
                                    )}

                                    {actionType === 'delete' && (
                                        <div className="alert alert-warning">
                                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                                            <strong>{t('userManagement.modal.deleteWarning.title')}</strong> {t('userManagement.modal.deleteWarning.description')}
                                        </div>
                                    )}

                                    {actionType === 'delete' && (
                                        <div className="mb-3">
                                            <label className="form-label">{t('userManagement.modal.confirmation.label')}</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.deleteConfirmation ? 'is-invalid' : ''}`}
                                                placeholder={t('userManagement.modal.confirmation.placeholder', { name: selectedUser?.name })}
                                                value={deleteConfirmation}
                                                onChange={(e) => {
                                                    setDeleteConfirmation(e.target.value);
                                                    // Clear error khi user bắt đầu nhập
                                                    if (formErrors.deleteConfirmation) {
                                                        setFormErrors({});
                                                    }
                                                }}
                                                required
                                            />
                                            {formErrors.deleteConfirmation && (
                                                <div className="invalid-feedback">
                                                    {formErrors.deleteConfirmation}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeModal}
                                    >
                                        {t('userManagement.modal.buttons.cancel')}
                                    </button>
                                    {actionType !== 'view' && (
                                        <button
                                            type="submit"
                                            className={`btn ${actionType === 'delete' ? 'btn-danger' : 'btn-primary'
                                                }`}
                                        >
                                            {actionType === 'delete' && t('userManagement.modal.buttons.delete')}
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
