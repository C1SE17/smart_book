import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../../services';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent_category_id: null
    });

    // Fetch categories from real API
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiService.getCategories();

            if (response.success) {
                setCategories(response.data);
            } else {
                setError(response.message);
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Không thể tải danh sách danh mục: ' + error.message);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Validation function
    const validateForm = (data) => {
        const errors = {};

        if (!data.name.trim()) {
            errors.name = 'Tên danh mục là bắt buộc';
        } else if (data.name.length < 2) {
            errors.name = 'Tên danh mục phải có ít nhất 2 ký tự';
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
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            try {
                const response = await apiService.deleteCategory(categoryId);
                if (response.success) {
                    setCategories(categories.filter(cat => cat.category_id !== categoryId));
                    alert('Xóa danh mục thành công!');
                } else {
                    alert('Lỗi khi xóa danh mục: ' + response.message);
                }
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Lỗi khi xóa danh mục: ' + error.message);
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
                    setCategories(categories.map(cat =>
                        cat.category_id === editingCategory.category_id
                            ? { ...cat, ...formData, updated_at: new Date().toISOString().split('T')[0] }
                            : cat
                    ));
                    alert('Cập nhật danh mục thành công!');
                } else {
                    alert('Lỗi khi cập nhật danh mục: ' + response.message);
                }
            } else {
                // Add new category
                const response = await apiService.createCategory(formData);
                if (response.success) {
                    const newCategory = {
                        category_id: response.data.category_id || Math.max(...categories.map(c => c.category_id)) + 1,
                        ...formData,
                        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
                        created_at: new Date().toISOString().split('T')[0],
                        updated_at: new Date().toISOString().split('T')[0],
                        book_count: 0
                    };
                    setCategories([...categories, newCategory]);
                    alert('Thêm danh mục thành công!');
                } else {
                    alert('Lỗi khi thêm danh mục: ' + response.message);
                }
            }

            setShowModal(false);
            setFormData({ name: '', description: '', parent_category_id: null });
            setFormErrors({});
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Lỗi khi lưu danh mục: ' + error.message);
        }
    };

    const getParentCategoryName = (parentId) => {
        if (!parentId) return 'Danh mục gốc';
        const parent = categories.find(cat => cat.category_id === parentId);
        return parent ? parent.name : 'Không xác định';
    };

    const getIndentLevel = (category) => {
        return category.parent_category_id ? 'ps-4' : '';
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center py-5" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
                <p className="mt-2">Vui lòng đảm bảo backend đang chạy và kết nối database.</p>
                <button className="btn btn-outline-danger" onClick={fetchCategories}>
                    <i className="fas fa-sync-alt me-2"></i>
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-dark">Quản lý danh mục</h2>
                <button
                    className="btn btn-primary"
                    onClick={handleAddCategory}
                >
                    <i className="fas fa-plus me-2"></i>
                    Thêm danh mục
                </button>
            </div>

            {/* Categories Table */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Tên danh mục</th>
                                    <th>Mô tả</th>
                                    <th>Danh mục cha</th>
                                    <th>Số sách</th>
                                    <th>Ngày tạo</th>
                                    <th className="text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
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
                                                {category.book_count} sách
                                            </span>
                                        </td>
                                        <td className="text-muted small">
                                            {new Date(category.created_at).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="text-center">
                                            <div className="btn-group btn-group-sm">
                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() => handleEditCategory(category)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => handleDeleteCategory(category.category_id)}
                                                    title="Xóa"
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
                                    {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
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
                                            <label className="form-label">Tên danh mục *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                            {formErrors.name && (
                                                <div className="invalid-feedback">{formErrors.name}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Danh mục cha</label>
                                            <select
                                                className="form-select"
                                                value={formData.parent_category_id || ''}
                                                onChange={(e) => setFormData({ ...formData, parent_category_id: e.target.value ? parseInt(e.target.value) : null })}
                                            >
                                                <option value="">Danh mục gốc</option>
                                                {categories
                                                    .filter(cat => !cat.parent_category_id)
                                                    .map(cat => (
                                                        <option key={cat.category_id} value={cat.category_id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Mô tả</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingCategory ? 'Cập nhật' : 'Thêm mới'}
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
