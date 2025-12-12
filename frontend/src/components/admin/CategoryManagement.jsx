import React, { useState, useEffect, useCallback, useMemo } from 'react';
import apiService from '../../services';
import { useTranslation } from 'react-i18next';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent_category_id: null
    });

    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
    const formatNumber = useCallback((value) => numberFormatter.format(Number(value || 0)), [numberFormatter]);

    // Fetch categories from real API
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.getCategories();

            if (response.success) {
                setCategories(response.data);
            } else {
                setError(response.message || '');
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError(error.message || '');
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Filter categories based on search term (client-side filtering like UserManagement)
    const filteredCategories = categories.filter(category => {
        const name = category.name || '';
        const description = category.description || '';

        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    // Validation function
    const validateForm = (data) => {
        const errors = {};

        // Regex to allow only letters (including Vietnamese characters) and spaces
        const lettersOnlyRegex = /^[a-zA-ZÀ-ỹĂăÂâĐđÊêÔôƠơƯư\s]+$/;
        // Regex to check if contains numbers
        const containsNumberRegex = /\d/;

        if (!data.name.trim()) {
            errors.name = 'Category name cannot be empty';
        } else if (data.name.length < 2) {
            errors.name = t('categoryManagement.form.errors.nameMin');
        } else if (!lettersOnlyRegex.test(data.name.trim())) {
            errors.name = 'Category name cannot contain numbers or special characters';
        }

        if (!data.description.trim()) {
            errors.description = 'Description cannot be empty';
        } else if (containsNumberRegex.test(data.description.trim())) {
            errors.description = 'Description cannot contain numbers';
        }

        return errors;
    };

    const handleAddCategory = () => {
        setEditingCategory(null);
        setFormData({ name: '', description: '', parent_category_id: null });
        setFormErrors({});
        setShowModal(true);
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description,
            parent_category_id: category.parent_category_id
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm(t('categoryManagement.confirm.delete'))) {
            try {
                const response = await apiService.deleteCategory(categoryId);
                if (response.success) {
                    setCategories(categories.filter(cat => cat.category_id !== categoryId));
                    if (window.showToast) {
                        window.showToast(response.message || t('categoryManagement.messages.deleteSuccess'), 'success');
                    }
                } else {
                    if (window.showToast) {
                        window.showToast(response.message || t('categoryManagement.messages.deleteError'), 'error');
                    }
                }
            } catch (error) {
                console.error('Error deleting category:', error);
                if (window.showToast) {
                    window.showToast(t('categoryManagement.messages.deleteError'), 'error');
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (editingCategory) {
                // Update category
                const response = await apiService.updateCategory(editingCategory.category_id, formData);
                if (response.success) {
                    setShowModal(false);
                    setFormData({ name: '', description: '', parent_category_id: null });
                    setFormErrors({});
                    // Refresh categories list to ensure all categories are displayed
                    await fetchCategories();
                    if (window.showToast) {
                        window.showToast(response.message || 'Category updated successfully', 'success');
                    }
                } else {
                    if (window.showToast) {
                        window.showToast(response.message || t('categoryManagement.messages.updateError'), 'error');
                    }
                }
            } else {
                // Add new category
                const response = await apiService.createCategory(formData);
                if (response.success) {
                    const newCategory = {
                        category_id: response.data.id || response.data.category_id || Math.max(...categories.map(c => c.category_id)) + 1,
                        ...formData,
                        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
                        created_at: new Date().toISOString().split('T')[0],
                        updated_at: new Date().toISOString().split('T')[0],
                        book_count: 0
                    };
                    setCategories([...categories, newCategory]);
                    setShowModal(false);
                    setFormData({ name: '', description: '', parent_category_id: null });
                    setFormErrors({});
                    if (window.showToast) {
                        window.showToast(response.message || 'Category created successfully', 'success');
                    }
                } else {
                    if (window.showToast) {
                        window.showToast(response.message || t('categoryManagement.messages.createError'), 'error');
                    }
                }
            }
        } catch (error) {
            console.error('Error saving category:', error);
            if (window.showToast) {
                window.showToast(t('categoryManagement.messages.saveError', { message: error.message || '' }), 'error');
            }
        }
    };

    const getParentCategoryName = (parentId) => {
        if (!parentId) return t('categoryManagement.parent.root');
        const parent = categories.find(cat => cat.category_id === parentId);
        return parent ? parent.name : t('categoryManagement.parent.unknown');
    };

    const getIndentLevel = (category) => {
        return category.parent_category_id ? 'ps-4' : '';
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">{t('categoryManagement.table.loading')}</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center py-5" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {t('categoryManagement.messages.fetchError', { message: error })}
                <p className="mt-2">{t('categoryManagement.messages.backendHint')}</p>
                <button className="btn btn-outline-danger" onClick={fetchCategories}>
                    <i className="fas fa-sync-alt me-2"></i>
                    {t('categoryManagement.buttons.retry')}
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">{t('categoryManagement.title')}</h2>
                <button
                    className="btn btn-primary"
                    onClick={handleAddCategory}
                >
                    <i className="fas fa-plus me-2"></i>
                    {t('categoryManagement.addButton')}
                </button>
            </div>

            {/* Search Bar */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder={t('categoryManagement.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchTerm('')}>
                                <i className="fas fa-times" aria-hidden="true"></i>
                                <span className="visually-hidden">{t('categoryManagement.buttons.clearSearch')}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Categories Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t('categoryManagement.table.headers.name')}</th>
                                    <th>{t('categoryManagement.table.headers.description')}</th>
                                    <th>{t('categoryManagement.table.headers.parent')}</th>
                                    <th>{t('categoryManagement.table.headers.bookCount')}</th>
                                    <th>{t('categoryManagement.table.headers.createdAt')}</th>
                                    <th className="text-center">{t('categoryManagement.table.headers.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((category) => (
                                    <tr key={category.category_id}>
                                        <td>
                                            <div className={`fw-medium ${getIndentLevel(category)}`}>
                                                {category.parent_category_id && <i className="fas fa-level-down-alt me-2 text-muted"></i>}
                                                {category.name}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="text-muted small" style={{ maxWidth: '200px' }}>
                                                {category.description}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge bg-light text-dark">
                                                {getParentCategoryName(category.parent_category_id)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-primary">
                                                {t('categoryManagement.badges.bookCount', {
                                                    count: formatNumber(category.book_count ?? 0)
                                                })}
                                            </span>
                                        </td>
                                        <td className="text-muted small">
                                            {category.created_at
                                                ? new Date(category.created_at).toLocaleDateString(locale)
                                                : '—'}
                                        </td>
                                        <td className="text-center">
                                            <div className="btn-group btn-group-sm">
                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => handleEditCategory(category)}
                                                    title={t('categoryManagement.actions.edit')}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => handleDeleteCategory(category.category_id)}
                                                    title={t('categoryManagement.actions.delete')}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingCategory ? t('categoryManagement.form.titleEdit') : t('categoryManagement.form.titleAdd')}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">{t('categoryManagement.form.labels.name')}</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                            {formErrors.name && (
                                                <div className="invalid-feedback">{formErrors.name}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">{t('categoryManagement.form.labels.parent')}</label>
                                            <select
                                                className="form-select"
                                                value={formData.parent_category_id || ''}
                                                onChange={(e) => setFormData({ ...formData, parent_category_id: e.target.value ? parseInt(e.target.value) : null })}
                                            >
                                                <option value="">Select a category</option>
                                                {categories
                                                    .filter(cat => cat.name && cat.name.trim() !== '')
                                                    .map(cat => (
                                                        <option 
                                                            key={cat.category_id} 
                                                            value={cat.category_id}
                                                        >
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">{t('categoryManagement.form.labels.description')}</label>
                                        <textarea
                                            className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                        {formErrors.description && (
                                            <div className="invalid-feedback">{formErrors.description}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        {t('categoryManagement.form.buttons.cancel')}
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingCategory
                                            ? t('categoryManagement.form.buttons.update')
                                            : t('categoryManagement.form.buttons.create')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
