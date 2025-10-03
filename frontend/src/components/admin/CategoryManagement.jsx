import React, { useState, useEffect } from 'react';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        parent_category_id: null
    });

    // Mock data - trong thực tế sẽ fetch từ API
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setTimeout(() => {
                setCategories([
                    {
                        category_id: 1,
                        name: 'Văn học',
                        description: 'Các tác phẩm văn học trong nước và quốc tế',
                        parent_category_id: null,
                        slug: 'van-hoc',
                        created_at: '2024-01-01',
                        updated_at: '2024-01-15',
                        book_count: 45
                    },
                    {
                        category_id: 2,
                        name: 'Tiểu thuyết',
                        description: 'Tiểu thuyết văn học',
                        parent_category_id: 1,
                        slug: 'tieu-thuyet',
                        created_at: '2024-01-01',
                        updated_at: '2024-01-15',
                        book_count: 23
                    },
                    {
                        category_id: 3,
                        name: 'Thơ ca',
                        description: 'Tập thơ và thơ ca',
                        parent_category_id: 1,
                        slug: 'tho-ca',
                        created_at: '2024-01-01',
                        updated_at: '2024-01-15',
                        book_count: 12
                    },
                    {
                        category_id: 4,
                        name: 'Khoa học',
                        description: 'Sách khoa học và công nghệ',
                        parent_category_id: null,
                        slug: 'khoa-hoc',
                        created_at: '2024-01-01',
                        updated_at: '2024-01-15',
                        book_count: 67
                    },
                    {
                        category_id: 5,
                        name: 'Lịch sử',
                        description: 'Sách lịch sử và văn hóa',
                        parent_category_id: null,
                        slug: 'lich-su',
                        created_at: '2024-01-01',
                        updated_at: '2024-01-15',
                        book_count: 34
                    },
                    {
                        category_id: 6,
                        name: 'Manga/Comic',
                        description: 'Truyện tranh và manga',
                        parent_category_id: null,
                        slug: 'manga-comic',
                        created_at: '2024-01-01',
                        updated_at: '2024-01-15',
                        book_count: 156
                    }
                ]);
                setLoading(false);
            }, 1000);
        };

        fetchCategories();
    }, []);

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

    const handleDeleteCategory = (categoryId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
            setCategories(categories.filter(cat => cat.category_id !== categoryId));
        }
    };

    const handleSubmit = (e) => {
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
                setCategories(categories.map(cat =>
                    cat.category_id === editingCategory.category_id
                        ? { ...cat, ...formData, updated_at: new Date().toISOString().split('T')[0] }
                        : cat
                ));
            } else {
                // Add new category
                const newCategory = {
                    category_id: Math.max(...categories.map(c => c.category_id)) + 1,
                    ...formData,
                    slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
                    created_at: new Date().toISOString().split('T')[0],
                    updated_at: new Date().toISOString().split('T')[0],
                    book_count: 0
                };
                setCategories([...categories, newCategory]);
            }

            setShowModal(false);
            setFormData({ name: '', description: '', parent_category_id: null });
            setFormErrors({});
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Có lỗi xảy ra khi lưu danh mục. Vui lòng thử lại.');
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
