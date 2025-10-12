import React from 'react';

const TopRatedBooks = ({ data, height = 400 }) => {
    return (
        <div className="card border-0 shadow-sm h-100" style={{ height: `${height}px` }}>
            <div className="card-header bg-white border-0">
                <h5 className="fw-bold text-dark mb-0">
                    <i className="fas fa-star me-2 text-warning"></i>
                    Top 3 sách đánh giá 5 sao
                </h5>
            </div>
            <div className="card-body">
                <div className="list-group list-group-flush">
                    {data && data.length > 0 ? data.slice(0, 3).map((book, index) => (
                        <div key={book.id || index} className="list-group-item border-0 px-0 py-3">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0">
                                    {/* Thay đổi màu sắc theo thứ hạng */}
                                    <div className={`text-white rounded-circle d-flex align-items-center justify-content-center fw-bold`}
                                         style={{ 
                                             width: '32px', 
                                             height: '32px',
                                             backgroundColor: getRankColor(book.rank || index + 1)
                                         }}>
                                        {book.rank || index + 1}
                                    </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <div className="fw-bold text-dark" style={{ lineHeight: '1.3', fontSize: '16px' }}>
                                        {book.title || book.book_title || `Sách ${index + 1}`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-muted py-4">
                            <i className="fas fa-star fa-2x mb-2 text-warning"></i>
                            <div>Chưa có dữ liệu đánh giá sách</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Hàm lấy màu sắc theo thứ hạng
const getRankColor = (rank) => {
    switch(rank) {
        case 1: return '#FFD700'; // Vàng cho hạng 1
        case 2: return '#C0C0C0'; // Bạc cho hạng 2
        case 3: return '#CD7F32'; // Đồng cho hạng 3
        default: return '#6c757d'; // Xám cho các hạng khác
    }
};

export default TopRatedBooks;


