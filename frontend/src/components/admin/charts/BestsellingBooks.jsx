import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const BestsellingBooks = ({ data, height = 400 }) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

    const currencyFormatter = useMemo(() => new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
    }), [locale]);

    const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);

    const formatCurrency = (amount) => currencyFormatter.format(Number(amount || 0));
    const formatNumber = (value) => numberFormatter.format(Number(value || 0));

    const getRankText = (rank) => {
        const key = `admin.dashboard.topSelling.rank.${rank}`;
        return t(key, {
            defaultValue: t('admin.dashboard.topSelling.rank.default', { rank })
        });
    };

    return (
        <div className="card border-0 shadow-sm h-100" style={{ height: `${height}px` }}>
            <div className="card-header bg-white border-0">
                <h5 className="fw-bold text-dark mb-0">
                    <i className="fas fa-trophy me-2 text-warning"></i>
                    {t('admin.dashboard.topSelling.title')}
                </h5>
            </div>
            <div className="card-body">
                <div className="list-group list-group-flush">
                    {data && data.length > 0 ? data.map((book, index) => (
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
                                    <div className="fw-medium text-dark small" style={{ lineHeight: '1.3' }}>
                                        {book.title || book.book_title || t('admin.dashboard.topSelling.placeholder', { index: index + 1 })}
                                    </div>
                                    <div className="text-muted small">
                                        {t('admin.dashboard.topSelling.salesLine', {
                                            count: formatNumber(book.sales || 0),
                                            revenue: formatCurrency(book.revenue || 0)
                                        })}
                                    </div>
                                    {/* Thêm badge thứ hạng */}
                                    <div className="mt-1">
                                        <span className={`badge ${getRankBadgeClass(book.rank || index + 1)}`}>
                                            {getRankText(book.rank || index + 1)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-muted py-4">
                            <i className="fas fa-book fa-2x mb-2"></i>
                            <div>{t('admin.dashboard.topSelling.empty')}</div>
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

// Hàm lấy class badge theo thứ hạng
const getRankBadgeClass = (rank) => {
    switch(rank) {
        case 1: return 'bg-warning text-dark';
        case 2: return 'bg-secondary';
        case 3: return 'bg-warning text-dark';
        default: return 'bg-light text-dark';
    }
};


export default BestsellingBooks;
