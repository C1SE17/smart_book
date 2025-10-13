import React, { useState, useEffect } from 'react';
import authorApi from '../../../services/authorApi.js';

const Authors = ({ onNavigateTo, onNavigateToAuthorDetail }) => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAuthors();
    }, []);

    const loadAuthors = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔄 [Authors] Bắt đầu load authors...');
            
            const response = await authorApi.getAllAuthors();
            console.log('📊 [Authors] Response:', response);
            
            if (response && response.success) {
                setAuthors(response.data);
                console.log('✅ [Authors] Load thành công', response.data.length, 'tác giả');
            } else {
                const errorMsg = response?.message || 'Không thể tải danh sách tác giả';
                setError(errorMsg);
                console.error('❌ [Authors] Load thất bại:', errorMsg);
            }
        } catch (err) {
            console.error('💥 [Authors] Error loading authors:', err);
            setError(`Lỗi kết nối: ${err.message}. Vui lòng kiểm tra backend có đang chạy không.`);
        } finally {
            setLoading(false);
        }
    };

    const filteredAuthors = authors.filter(author =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    <h5 className="alert-heading">
                        <i className="fas fa-exclamation-triangle me-2"></i>
                        Lỗi tải dữ liệu
                    </h5>
                    <p className="mb-3">{error}</p>
                    <hr />
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={loadAuthors}
                        >
                            <i className="fas fa-redo me-1"></i>
                            Thử lại
                        </button>
                        <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => window.location.reload()}
                        >
                            <i className="fas fa-refresh me-1"></i>
                            Tải lại trang
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">Tác giả</h2>
                        <div className="col-md-4">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm kiếm tác giả..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <span className="input-group-text">
                                    <i className="fas fa-search"></i>
                                </span>
                            </div>
                        </div>
                    </div>

                    {filteredAuthors.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-user-slash fa-3x text-muted mb-3"></i>
                            <p className="text-muted">Không tìm thấy tác giả nào</p>
                        </div>
                    ) : (
                        <div className="row">
                            {filteredAuthors.map((author) => (
                                <div key={author.author_id} className="col-md-6 col-lg-4 mb-4">
                                    <div className="card h-100 shadow-sm author-card">
                                        <div className="card-body d-flex flex-column">
                                            <div className="text-center mb-3">
                                                <div className="author-avatar mx-auto mb-3">
                                                    <i className="fas fa-user-circle fa-4x text-primary"></i>
                                                </div>
                                                <h5 className="card-title mb-2">{author.name}</h5>
                                                {author.bio && (
                                                    <p className="text-muted small mb-3 author-bio">
                                                        {author.bio.length > 120 
                                                            ? `${author.bio.substring(0, 120)}...` 
                                                            : author.bio
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                            
                                            <div className="mt-auto">
                                                <button
                                                    className="btn btn-outline-primary w-100"
                                                    onClick={() => onNavigateToAuthorDetail(author.author_id)}
                                                >
                                                    <i className="fas fa-eye me-2"></i>
                                                    Xem chi tiết
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .author-card {
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                    border: none;
                }
                
                .author-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
                }
                
                .author-avatar {
                    width: 80px;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .author-bio {
                    line-height: 1.5;
                    min-height: 60px;
                }
            `}</style>
        </div>
    );
};

export default Authors;
