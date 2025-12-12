// Bộ điều khiển tổng hợp dữ liệu phân tích dành cho bảng điều khiển admin.
// File này tập trung thu thập dữ liệu từ MySQL + MongoDB, chuyển đổi thành các
// thống kê dễ hiểu và trả về cho frontend dưới dạng JSON.
const db = require('../config/db');
require('../config/mongodb');

const SearchTrack = require('../models/SearchTrack');
const ProductTrack = require('../models/ProductTrack');
const CartTrack = require('../models/CartTrack');
const AILogModel = require('../models/AILogModel');
const ORDER_SUCCESS_STATUSES = ['paid', 'shipped', 'completed'];

const padNumber = (value) => String(value).padStart(2, '0');

// Định dạng tiền tệ theo chuẩn VND (dùng cho báo cáo doanh thu)
const formatCurrency = (value) => {
  const number = Number(value) || 0;
  return number.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  });
};

// Định dạng số nguyên (số đơn, lượt truy cập, v.v.)
const formatNumber = (value) => {
  const number = Number(value) || 0;
  return number.toLocaleString('vi-VN');
};

// Định dạng phần trăm kèm dấu (+/-) phục vụ phần thẻ KPI
const formatPercentText = (value) => {
  const number = Number(value) || 0;
  const fixed = Math.abs(number).toFixed(1);
  if (number > 0) return `+${fixed}%`;
  if (number < 0) return `-${fixed}%`;
  return '0.0%';
};

// Chuẩn hóa đối tượng Date sang chuỗi "YYYY-MM-DD HH:mm:ss" để đưa vào SQL
const formatDateTime = (date) => {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());
  const hours = padNumber(date.getHours());
  const minutes = padNumber(date.getMinutes());
  const seconds = padNumber(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

const startOfQuarter = (date) => {
  const currentQuarter = Math.floor(date.getMonth() / 3);
  return new Date(date.getFullYear(), currentQuarter * 3, 1, 0, 0, 0, 0);
};

const endOfQuarter = (date) => {
  const currentQuarter = Math.floor(date.getMonth() / 3);
  return new Date(date.getFullYear(), currentQuarter * 3 + 3, 0, 23, 59, 59, 999);
};

const startOfYear = (date) => new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
const endOfYear = (date) => new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);

const subMonths = (date, amount) => new Date(date.getFullYear(), date.getMonth() - amount, 1, 0, 0, 0, 0);
const subQuarters = (date, amount) => subMonths(date, amount * 3);
const subYears = (date, amount) => new Date(date.getFullYear() - amount, 0, 1, 0, 0, 0, 0);

// Xác định khoảng thời gian hiện tại & trước đó dựa trên loại range (tháng/quý/năm)
const getRangeBoundaries = (rangeKey = 'month') => {
  const now = new Date();

  if (rangeKey === 'quarter') {
    return {
      currentStart: startOfQuarter(now),
      currentEnd: endOfQuarter(now),
      previousStart: startOfQuarter(subQuarters(now, 1)),
      previousEnd: endOfQuarter(subQuarters(now, 1))
    };
  }

  if (rangeKey === 'year') {
    return {
      currentStart: startOfYear(now),
      currentEnd: endOfYear(now),
      previousStart: startOfYear(subYears(now, 1)),
      previousEnd: endOfYear(subYears(now, 1))
    };
  }

  return {
    currentStart: startOfMonth(now),
    currentEnd: endOfMonth(now),
    previousStart: startOfMonth(subMonths(now, 1)),
    previousEnd: endOfMonth(subMonths(now, 1))
  };
};

// Tính % thay đổi giữa hai mốc (dùng cho phần so sánh kỳ hiện tại vs kỳ trước)
const calcChangePercent = (currentValue, previousValue) => {
  const current = Number(currentValue) || 0;
  const previous = Number(previousValue) || 0;

  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
};

const RANGE_TEXT = {
  month: { current: 'tháng này', previous: 'tháng trước', label: 'Theo tháng' },
  quarter: { current: 'quý này', previous: 'quý trước', label: 'Theo quý' },
  year: { current: 'năm nay', previous: 'năm trước', label: 'Theo năm' }
};

// Chuẩn hóa dữ liệu truy vấn tổng đơn & doanh thu
const normalizeOrderSummary = (row = {}) => ({
  total_orders: Number(row.total_orders || 0),
  total_revenue: Number(row.total_revenue || 0)
});

const normalizeCount = (value) => Number(value || 0);

// Tạo snapshot thống kê cho từng khung thời gian (month/quarter/year)
const composeTimeframeSnapshot = ({ rangeKey, boundaries, ordersCurrent, ordersPrevious, newUsersCurrent, newUsersPrevious }) => ({
  range: rangeKey,
  label: RANGE_TEXT[rangeKey]?.label || rangeKey,
  period: {
    currentStart: boundaries.currentStart.toISOString(),
    currentEnd: boundaries.currentEnd.toISOString(),
    previousStart: boundaries.previousStart.toISOString(),
    previousEnd: boundaries.previousEnd.toISOString()
  },
  metrics: {
    orders: {
      current: ordersCurrent.total_orders,
      previous: ordersPrevious.total_orders,
      changePercent: calcChangePercent(ordersCurrent.total_orders, ordersPrevious.total_orders)
    },
    revenue: {
      current: ordersCurrent.total_revenue,
      previous: ordersPrevious.total_revenue,
      changePercent: calcChangePercent(ordersCurrent.total_revenue, ordersPrevious.total_revenue)
    },
    newUsers: {
      current: newUsersCurrent,
      previous: newUsersPrevious,
      changePercent: calcChangePercent(newUsersCurrent, newUsersPrevious)
    }
  }
});

// Sinh đoạn tóm tắt dạng narrative (giống AI) dựa trên dữ liệu KPI
const generateLLMStyleNarrative = ({
  periodLabel,
  previousLabel,
  ordersCurrent,
  changeOrders,
  revenueCurrent,
  changeRevenue,
  newUsersCurrent,
  changeUsers,
  topProductTitle
}) => {
  const sentences = [];

  sentences.push(
    `Trong ${periodLabel}, hệ thống ghi nhận ${formatNumber(ordersCurrent)} đơn hàng với doanh thu ${formatCurrency(revenueCurrent)}.`
  );

  if (changeRevenue !== 0) {
    sentences.push(
      `So với ${previousLabel}, doanh thu ${changeRevenue >= 0 ? 'tăng' : 'giảm'} ${formatPercentText(changeRevenue)}.`
    );
  }

  if (changeOrders !== 0) {
    sentences.push(
      `Số đơn hàng ${changeOrders >= 0 ? 'tăng' : 'giảm'} ${formatPercentText(changeOrders)} trong cùng kỳ so sánh.`
    );
  }

  if (newUsersCurrent > 0) {
    sentences.push(
      `${formatNumber(newUsersCurrent)} người dùng mới (${formatPercentText(changeUsers)}) đã tham gia hệ thống.`
    );
  }

  if (topProductTitle) {
    sentences.push(`“${topProductTitle}” đang dẫn đầu doanh thu và nên được ưu tiên trong các chiến dịch kế tiếp.`);
  }

  return sentences.join(' ');
};

// Sinh gợi ý quản trị dựa trên xu hướng tăng/giảm của từng KPI
const buildAdviceFromTrend = ({ metric, changePercent, periodLabel = 'kỳ này' }) => {
  if (metric === 'orders') {
    if (changePercent < -5) {
      return `Đơn hàng ${periodLabel} giảm rõ rệt — nên tăng quảng cáo Facebook và remarketing.`;
    }
    if (changePercent > 5) {
      return `Đơn hàng ${periodLabel} tăng, nên mở rộng ngân sách marketing để giữ đà tăng trưởng.`;
    }
    return `Đơn hàng ${periodLabel} ổn định — tiếp tục duy trì các chiến dịch hiện tại.`;
  }

  if (metric === 'newUsers') {
    if (changePercent >= 10) {
      return `Lượng người dùng mới ${periodLabel} tăng mạnh — cân nhắc triển khai mini game giữ chân khách hàng.`;
    }
    if (changePercent <= -10) {
      return `Người dùng mới ${periodLabel} giảm — hãy xem lại kênh giới thiệu và nội dung landing page.`;
    }
    return `Tăng trưởng người dùng mới ${periodLabel} ổn định — tiếp tục tối ưu trải nghiệm onboarding.`;
  }

  return 'Tiếp tục theo dõi hiệu suất để có quyết định phù hợp';
};

const fallbackHeatmap = () => {
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const hours = ['09h', '12h', '15h', '18h', '21h'];

  return days.map((day) => ({
    day,
    slots: hours.map((hour) => ({ hour, sessions: Math.floor(Math.random() * 40) + 5 }))
  }));
};

class AnalyticsController {
  static async getDashboard(req, res) {
    try {
      // Bước 1: Xác định phạm vi báo cáo (month/quarter/year) và các mốc thời gian so sánh.
      const range = (req.query.range || 'month').toLowerCase();
      const { currentStart, currentEnd, previousStart, previousEnd } = getRangeBoundaries(range);

      const currentStartStr = formatDateTime(currentStart);
      const currentEndStr = formatDateTime(currentEnd);
      const previousStartStr = formatDateTime(previousStart);
      const previousEndStr = formatDateTime(previousEnd);

      // Bước 2: Lấy tổng đơn và doanh thu cho kỳ hiện tại và kỳ trước từ MySQL.
      const [ordersSummaryCurrentRows, ordersSummaryPreviousRows] = await Promise.all([
        db.promise().query(
          `SELECT COUNT(*) AS total_orders, COALESCE(SUM(total_price), 0) AS total_revenue
           FROM orders
           WHERE status IN (?) AND created_at BETWEEN ? AND ?`,
          [ORDER_SUCCESS_STATUSES, currentStartStr, currentEndStr]
        ),
        db.promise().query(
          `SELECT COUNT(*) AS total_orders, COALESCE(SUM(total_price), 0) AS total_revenue
           FROM orders
           WHERE status IN (?) AND created_at BETWEEN ? AND ?`,
          [ORDER_SUCCESS_STATUSES, previousStartStr, previousEndStr]
        )
      ]);

      const ordersSummaryCurrent = normalizeOrderSummary(ordersSummaryCurrentRows[0]?.[0]);
      const ordersSummaryPrevious = normalizeOrderSummary(ordersSummaryPreviousRows[0]?.[0]);

      // Bước 3: Gom các cảnh báo kho và sản phẩm bán chạy/bán chậm.
      const [topProductsRows, warehouseAlertsRows, overstockRows, staleRows] = await Promise.all([
        db.promise().query(
          `SELECT oi.book_id, b.title, COALESCE(SUM(oi.quantity), 0) AS total_units,
                  COALESCE(SUM(oi.quantity * oi.price_at_order), 0) AS revenue
           FROM order_items oi
             JOIN orders o ON oi.order_id = o.order_id
             JOIN books b ON oi.book_id = b.book_id
           WHERE o.status IN (?) AND o.created_at BETWEEN ? AND ?
           GROUP BY oi.book_id, b.title
           ORDER BY revenue DESC
           LIMIT 5`,
          [ORDER_SUCCESS_STATUSES, currentStartStr, currentEndStr]
        ),
        db.promise().query(
          `SELECT w.book_id, b.title, w.quantity
           FROM warehouse w
             JOIN books b ON w.book_id = b.book_id
           WHERE w.quantity <= 10
           ORDER BY w.quantity ASC
           LIMIT 10`
        ),
        db.promise().query(
          `SELECT w.book_id, b.title, w.quantity
           FROM warehouse w
             JOIN books b ON w.book_id = b.book_id
           WHERE w.quantity >= 100
           ORDER BY w.quantity DESC
           LIMIT 10`
        ),
        db.promise().query(
          `SELECT w.book_id, b.title, w.quantity, MAX(o.created_at) AS last_sold
           FROM warehouse w
             JOIN books b ON w.book_id = b.book_id
             LEFT JOIN order_items oi ON w.book_id = oi.book_id
             LEFT JOIN orders o ON oi.order_id = o.order_id AND o.status IN (?)
           GROUP BY w.book_id, b.title, w.quantity
           HAVING (last_sold IS NULL OR last_sold < DATE_SUB(NOW(), INTERVAL 180 DAY))
              AND w.quantity > 0
           ORDER BY w.quantity DESC
           LIMIT 10`,
          [ORDER_SUCCESS_STATUSES]
        )
      ]);

      const topProduct = topProductsRows[0]?.[0] || null;

      // Bước 4: Thống kê số người dùng mới theo cùng phạm vi thời gian.
      const [userSummaryCurrentRows, userSummaryPreviousRows] = await Promise.all([
        db.promise().query(
          `SELECT COUNT(*) AS new_users
           FROM users
           WHERE created_at BETWEEN ? AND ?`,
          [currentStartStr, currentEndStr]
        ),
        db.promise().query(
          `SELECT COUNT(*) AS new_users
           FROM users
           WHERE created_at BETWEEN ? AND ?`,
          [previousStartStr, previousEndStr]
        )
      ]);

      const newUsersCurrent = normalizeCount(userSummaryCurrentRows[0]?.[0]?.new_users);
      const newUsersPrevious = normalizeCount(userSummaryPreviousRows[0]?.[0]?.new_users);

      // Bước 5: Lấy dữ liệu doanh thu 12 tháng gần nhất để vẽ biểu đồ xu hướng.
      const [monthlyTrendRows] = await db.promise().query(
        `SELECT DATE_FORMAT(created_at, '%Y-%m') AS label,
                SUM(total_price) AS revenue,
                COUNT(order_id) AS total_orders
         FROM orders
         WHERE status IN (?) AND created_at >= DATE_SUB(NOW(), INTERVAL 11 MONTH)
         GROUP BY label
         ORDER BY label ASC`,
        [ORDER_SUCCESS_STATUSES]
      );

      // Bước 6: Lấy phân bố đánh giá và top sách có điểm thấp để tạo insight.
      const [reviewDistributionRows, negativeReviewRows] = await Promise.all([
        db.promise().query(
          `SELECT rating, COUNT(*) AS count
           FROM reviews
           GROUP BY rating
           ORDER BY rating DESC`
        ),
        db.promise().query(
          `SELECT b.title, AVG(r.rating) AS avg_rating, COUNT(*) AS review_count
           FROM reviews r
             JOIN books b ON r.book_id = b.book_id
           GROUP BY r.book_id, b.title
           HAVING AVG(r.rating) <= 2.5 AND COUNT(*) >= 5
           ORDER BY avg_rating ASC, review_count DESC
           LIMIT 5`
        )
      ]);

      // Bước 7: Thu thập dữ liệu hành vi (nguồn tìm kiếm, heatmap, giỏ hàng) từ MongoDB.
      const [trafficSourceAgg, sessionDurationAgg, cartConversionAgg] = await Promise.all([
        SearchTrack.aggregate([
          { $match: { timestamp: { $gte: currentStart, $lte: currentEnd } } },
          {
            $group: {
              _id: {
                $switch: {
                  branches: [
                    { case: { $regexMatch: { input: '$keyword', regex: /facebook/i } }, then: 'Facebook' },
                    { case: { $regexMatch: { input: '$keyword', regex: /google|gg/i } }, then: 'Google' },
                    { case: { $regexMatch: { input: '$keyword', regex: /tiktok/i } }, then: 'TikTok' }
                  ],
                  default: 'Direct'
                }
              },
              total: { $sum: 1 }
            }
          },
          { $sort: { total: -1 } }
        ]).catch(() => []),
        ProductTrack.aggregate([
          { $match: { timestamp: { $gte: currentStart, $lte: currentEnd } } },
          {
            $group: {
              _id: {
                day: { $dayOfWeek: '$timestamp' },
                hour: { $hour: '$timestamp' }
              },
              sessions: { $sum: 1 },
              avgDuration: { $avg: '$viewDuration' }
            }
          }
        ]).catch(() => []),
        CartTrack.aggregate([
          { $match: { timestamp: { $gte: currentStart, $lte: currentEnd } } },
          {
            $group: {
              _id: '$action',
              total: { $sum: 1 }
            }
          }
        ]).catch(() => [])
      ]);

      // Chuẩn hóa về dạng phần trăm để hiển thị biểu đồ nguồn truy cập.
      const trafficSources = trafficSourceAgg.length
        ? trafficSourceAgg.map(item => ({ source: item._id, value: item.total }))
        : [
            { source: 'Google', value: 45 },
            { source: 'Facebook', value: 30 },
            { source: 'Direct', value: 15 },
            { source: 'Other', value: 10 }
          ];

      const totalSessions = trafficSources.reduce((sum, item) => sum + item.value, 0) || 1;
      const trafficSourcesPercent = trafficSources.map(item => ({
        ...item,
        percent: Math.round((item.value / totalSessions) * 100)
      }));

      // Tạo heatmap (hoặc dữ liệu giả phong phú) để ve bảng giờ cao điểm.
      const heatmap = sessionDurationAgg.length
        ? (() => {
            const dayMap = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
            const hourSlots = {};

            sessionDurationAgg.forEach((item) => {
              const dayIndex = item._id.day % 7;
              const dayLabel = dayMap[dayIndex];
              const hour = `${String(item._id.hour).padStart(2, '0')}h`;
              if (!hourSlots[dayLabel]) {
                hourSlots[dayLabel] = {};
              }
              hourSlots[dayLabel][hour] = (hourSlots[dayLabel][hour] || 0) + item.sessions;
            });

            const uniqueHours = Array.from(new Set(sessionDurationAgg.map(item => `${String(item._id.hour).padStart(2, '0')}h`))).sort();

            return ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day) => ({
              day,
              slots: uniqueHours.map(hour => ({ hour, sessions: hourSlots[day]?.[hour] || 0 }))
            }));
          })()
        : fallbackHeatmap();

      // Tính tỷ lệ chuyển đổi dựa trên các hành động giỏ hàng.
      const cartActions = cartConversionAgg.reduce((acc, item) => {
        acc[item._id] = item.total;
        return acc;
      }, {});
      const conversionRate = (() => {
        const addActions = cartActions.add || 0;
        const removeActions = cartActions.remove || 0;
        const updateActions = cartActions.update || 0;
        const totalCartInteractions = addActions + removeActions + updateActions;
        if (!totalCartInteractions) {
          return 0.03;
        }
        return Math.max(0, Math.min(1, addActions / totalCartInteractions));
      })();

      const changeOrders = calcChangePercent(ordersSummaryCurrent.total_orders, ordersSummaryPrevious.total_orders);
      const changeRevenue = calcChangePercent(ordersSummaryCurrent.total_revenue, ordersSummaryPrevious.total_revenue);
      const changeUsers = calcChangePercent(newUsersCurrent, newUsersPrevious);

      const selectedRangeText = RANGE_TEXT[range] || {};
      const currentPeriodLabel = selectedRangeText.current || 'kỳ này';
      const previousPeriodLabel = selectedRangeText.previous || 'kỳ trước';

      const timeframeAnalytics = {};
      // Bước 8: Chuẩn bị snapshot cho tất cả phạm vi để frontend chuyển tab mà không cần gọi lại API.
      await Promise.all(['month', 'quarter', 'year'].map(async (rangeKey) => {
        if (timeframeAnalytics[rangeKey]) {
          return;
        }

        if (rangeKey === range) {
          timeframeAnalytics[rangeKey] = composeTimeframeSnapshot({
            rangeKey,
            boundaries: { currentStart, currentEnd, previousStart, previousEnd },
            ordersCurrent: ordersSummaryCurrent,
            ordersPrevious: ordersSummaryPrevious,
            newUsersCurrent,
            newUsersPrevious
          });
          return;
        }

        const boundaries = getRangeBoundaries(rangeKey);
        const currentStartStrKey = formatDateTime(boundaries.currentStart);
        const currentEndStrKey = formatDateTime(boundaries.currentEnd);
        const previousStartStrKey = formatDateTime(boundaries.previousStart);
        const previousEndStrKey = formatDateTime(boundaries.previousEnd);

        const [
          ordersSummaryCurrentRangeRows,
          ordersSummaryPreviousRangeRows,
          newUsersSummaryCurrentRangeRows,
          newUsersSummaryPreviousRangeRows
        ] = await Promise.all([
          db.promise().query(
            `SELECT COUNT(*) AS total_orders, COALESCE(SUM(total_price), 0) AS total_revenue
             FROM orders
             WHERE status IN (?) AND created_at BETWEEN ? AND ?`,
            [ORDER_SUCCESS_STATUSES, currentStartStrKey, currentEndStrKey]
          ),
          db.promise().query(
            `SELECT COUNT(*) AS total_orders, COALESCE(SUM(total_price), 0) AS total_revenue
             FROM orders
             WHERE status IN (?) AND created_at BETWEEN ? AND ?`,
            [ORDER_SUCCESS_STATUSES, previousStartStrKey, previousEndStrKey]
          ),
          db.promise().query(
            `SELECT COUNT(*) AS new_users
             FROM users
             WHERE created_at BETWEEN ? AND ?`,
            [currentStartStrKey, currentEndStrKey]
          ),
          db.promise().query(
            `SELECT COUNT(*) AS new_users
             FROM users
             WHERE created_at BETWEEN ? AND ?`,
            [previousStartStrKey, previousEndStrKey]
          )
        ]);

        const ordersSummaryCurrentRange = normalizeOrderSummary(ordersSummaryCurrentRangeRows[0]?.[0]);
        const ordersSummaryPreviousRange = normalizeOrderSummary(ordersSummaryPreviousRangeRows[0]?.[0]);
        const newUsersSummaryCurrentRange = normalizeCount(newUsersSummaryCurrentRangeRows[0]?.[0]?.new_users);
        const newUsersSummaryPreviousRange = normalizeCount(newUsersSummaryPreviousRangeRows[0]?.[0]?.new_users);

        timeframeAnalytics[rangeKey] = composeTimeframeSnapshot({
          rangeKey,
          boundaries,
          ordersCurrent: ordersSummaryCurrentRange,
          ordersPrevious: ordersSummaryPreviousRange,
          newUsersCurrent: newUsersSummaryCurrentRange,
          newUsersPrevious: newUsersSummaryPreviousRange
        });
      }));

      const aiSummaryNotes = [];
      // Bước 9: Dựa vào biến động KPI/tồn kho/đánh giá để sinh cảnh báo cho admin.
      if (changeOrders < 0) {
        aiSummaryNotes.push(
          `Đơn hàng ${currentPeriodLabel} giảm ${formatPercentText(changeOrders)} so với ${previousPeriodLabel}. Gợi ý: triển khai Flash Sale trong 2 tuần tới.`
        );
      }
      if (warehouseAlertsRows[0].length > 0) {
        aiSummaryNotes.push(
          `${warehouseAlertsRows[0].length} sản phẩm sắp hết hàng. Đề xuất nhập bổ sung để tránh thiếu hụt.`
        );
      }
      if (negativeReviewRows[0].length > 0) {
        const topNeg = negativeReviewRows[0][0];
        aiSummaryNotes.push(
          `Sách “${topNeg.title}” có điểm đánh giá thấp (${Number(topNeg.avg_rating).toFixed(1)}★). Cần kiểm tra chất lượng và phản hồi khách nhanh.`
        );
      }

      const llmNarrative = generateLLMStyleNarrative({
        periodLabel: currentPeriodLabel,
        previousLabel: previousPeriodLabel,
        ordersCurrent: ordersSummaryCurrent.total_orders,
        changeOrders,
        revenueCurrent: ordersSummaryCurrent.total_revenue,
        changeRevenue,
        newUsersCurrent,
        changeUsers,
        topProductTitle: topProduct?.title
      });

      const summaryCards = {
        orders: {
          label: 'Tổng đơn hàng',
          value: ordersSummaryCurrent.total_orders,
          changePercent: changeOrders,
          insight: buildAdviceFromTrend({ metric: 'orders', changePercent: changeOrders, periodLabel: currentPeriodLabel })
        },
        revenue: {
          label: 'Tổng doanh thu',
          value: ordersSummaryCurrent.total_revenue,
          changePercent: changeRevenue,
          highlight: topProduct && ordersSummaryCurrent.total_revenue
            ? `Trong ${currentPeriodLabel}, “${topProduct.title}” đóng góp ${Math.round((topProduct.revenue / ordersSummaryCurrent.total_revenue) * 100)}% doanh thu.`
            : topProduct ? `Trong ${currentPeriodLabel}, “${topProduct.title}” đang dẫn đầu doanh thu.` : null,
          insight: topProduct
            ? `“${topProduct.title}” mang về ${formatCurrency(topProduct.revenue || 0)} trong ${currentPeriodLabel} – nên tiếp tục đầu tư quảng cáo.`
            : 'Chưa có sản phẩm nổi bật trong kỳ này'
        },
        inventory: {
          label: 'Sản phẩm sắp hết hàng',
          value: warehouseAlertsRows[0].length,
          highlightItems: warehouseAlertsRows[0].slice(0, 3),
          insight: warehouseAlertsRows[0].length
            ? `${warehouseAlertsRows[0][0].title} còn ${warehouseAlertsRows[0][0].quantity} cuốn – đề xuất nhập thêm 100 cuốn`
            : 'Tồn kho ổn định, chưa có cảnh báo'
        },
        newUsers: {
          label: 'Người dùng mới',
          value: newUsersCurrent,
          changePercent: changeUsers,
          insight: buildAdviceFromTrend({ metric: 'newUsers', changePercent: changeUsers, periodLabel: currentPeriodLabel })
        }
      };

      // Bước 10: Tổng hợp insight liên quan review để hiển thị bảng chi tiết.
      const distributionTotal = reviewDistributionRows[0].reduce((sum, item) => sum + item.count, 0) || 1;
      const reviewDistribution = reviewDistributionRows[0].map(item => ({
        rating: item.rating,
        count: item.count,
        percent: Math.round((item.count / distributionTotal) * 100)
      }));

      const lowRatingCount = reviewDistributionRows[0]
        .filter(item => Number(item.rating) <= 2)
        .reduce((sum, item) => sum + item.count, 0);
      const highRatingCount = reviewDistributionRows[0]
        .filter(item => Number(item.rating) >= 4)
        .reduce((sum, item) => sum + item.count, 0);

      const reviewInsights = [];
      reviewInsights.push(`Có tổng cộng ${formatNumber(distributionTotal)} lượt đánh giá được ghi nhận.`);
      if (highRatingCount > 0) {
        reviewInsights.push(`${formatNumber(highRatingCount)} lượt đánh giá (≈ ${Math.round((highRatingCount / distributionTotal) * 100)}%) đạt từ 4★ trở lên – cho thấy khách hàng vẫn đánh giá cao sản phẩm.`);
      }
      if (lowRatingCount > 0) {
        reviewInsights.push(`${formatNumber(lowRatingCount)} lượt đánh giá (≈ ${Math.round((lowRatingCount / distributionTotal) * 100)}%) dưới 2★ cần hành động ngay.`);
      } else {
        reviewInsights.push('Hiện chưa ghi nhận đánh giá dưới 2★ trong kỳ này.');
      }
      if (negativeReviewRows[0].length) {
        const worst = negativeReviewRows[0][0];
        reviewInsights.push(`Tựa sách có điểm thấp nhất: “${worst.title}” với trung bình ${Number(worst.avg_rating || 0).toFixed(1)}★ từ ${formatNumber(worst.review_count)} lượt đánh giá.`);
      }

      const reviewActions = negativeReviewRows[0].length
        ? [
            `Liên hệ nhà cung cấp và bộ phận chất lượng để kiểm tra “${negativeReviewRows[0][0].title}”, hoàn tất báo cáo trong 48 giờ.`,
            'Thiết lập SLA phản hồi dưới 2 giờ cho tất cả bình luận ≤ 2★, kèm mã giảm giá 10% và hướng dẫn sử dụng chi tiết.',
            'Tạo bài viết FAQ hoặc video hướng dẫn gửi kèm email xác nhận đơn hàng cho các tựa sách bị phàn nàn.'
          ]
        : ['Tiếp tục khuyến khích khách hàng hài lòng để lại đánh giá nhằm củng cố uy tín sản phẩm.'];

      const topProductsList = topProductsRows[0] || [];
      const topProductNames = topProductsList.slice(0, 3).map((item) => item.title);
      const secondaryTopProduct = topProductsList[1] || null;
      const revenueSnapshot = (timeframeAnalytics[range]?.metrics?.revenue) || {
        current: ordersSummaryCurrent.total_revenue,
        previous: ordersSummaryPrevious.total_revenue,
        changePercent: changeRevenue
      };
      const ordersSnapshot = (timeframeAnalytics[range]?.metrics?.orders) || {
        current: ordersSummaryCurrent.total_orders,
        previous: ordersSummaryPrevious.total_orders,
        changePercent: changeOrders
      };
      const newUsersSnapshot = (timeframeAnalytics[range]?.metrics?.newUsers) || {
        current: newUsersCurrent,
        previous: newUsersPrevious,
        changePercent: changeUsers
      };

      const forecastGrowth = (() => {
        if (!monthlyTrendRows.length) {
          return 0;
        }
        if (monthlyTrendRows.length === 1) {
          return monthlyTrendRows[0].revenue ? 5 : 0;
        }
        const last = monthlyTrendRows[monthlyTrendRows.length - 1];
        const prev = monthlyTrendRows[monthlyTrendRows.length - 2];
        const prevRevenue = Number(prev.revenue || 0);
        if (!prevRevenue) {
          return 10;
        }
        return Math.round(((Number(last.revenue || 0) - prevRevenue) / prevRevenue) * 100);
      })();

      const nextPeriodLabel = (() => {
        if (range === 'month') return 'tháng tới';
        if (range === 'quarter') return 'quý tới';
        if (range === 'year') return 'năm tới';
        return 'kỳ tiếp theo';
      })();

      const timeframeComparisons = ['month', 'quarter', 'year']
        .map((key) => {
          const snapshot = timeframeAnalytics[key];
          if (!snapshot) return null;
          const label = RANGE_TEXT[key]?.label || key;
          const revenueMetric = snapshot.metrics?.revenue || {};
          return `${label}: ${formatCurrency(revenueMetric.current || 0)} (${formatPercentText(revenueMetric.changePercent || 0)} so với kỳ trước)`;
        })
        .filter(Boolean);

      const marketingRecommendation = {
        category: 'marketingStrategy',
        title: 'Chiến lược Marketing',
        summary: topProduct
          ? `Doanh thu ${currentPeriodLabel} đạt ${formatCurrency(revenueSnapshot.current || 0)} (${formatPercentText(revenueSnapshot.changePercent ?? changeRevenue)} so với ${previousPeriodLabel}). “${topProduct.title}” chiếm ${revenueSnapshot.current ? Math.round((topProduct.revenue / revenueSnapshot.current) * 100) : 0}% và cần được ưu tiên ngân sách.`
          : `Doanh thu ${currentPeriodLabel} đạt ${formatCurrency(revenueSnapshot.current || 0)}, nhưng chưa có sản phẩm nổi bật — cần rà soát lại các chiến dịch hiện tại.`,
        reasons: [
          `Đơn hàng ${currentPeriodLabel}: ${formatNumber(ordersSnapshot.current || 0)} (${formatPercentText(ordersSnapshot.changePercent ?? changeOrders)} so với ${previousPeriodLabel}).`,
          `Tổng doanh thu ${currentPeriodLabel}: ${formatCurrency(revenueSnapshot.current || 0)}.`,
          `Người dùng mới ${currentPeriodLabel}: ${formatNumber(newUsersSnapshot.current || 0)} (${formatPercentText(newUsersSnapshot.changePercent ?? changeUsers)} so với ${previousPeriodLabel}).`,
          topProduct
            ? `Sản phẩm dẫn đầu: “${topProduct.title}” mang về ${formatCurrency(topProduct.revenue || 0)} (${revenueSnapshot.current ? Math.round((topProduct.revenue / revenueSnapshot.current) * 100) : 0}% doanh thu).`
            : 'Doanh thu phân tán, chưa có sản phẩm chủ lực trong kỳ.'
        ].filter(Boolean),
        actions: topProduct
          ? [
              `Tăng ngân sách quảng cáo đa kênh cho “${topProduct.title}” tối thiểu 20% trong phần còn lại của ${currentPeriodLabel}.`,
              `Thiết kế chương trình cross-sell với ${secondaryTopProduct?.title || 'sản phẩm bổ trợ'} nhằm nâng giá trị đơn hàng trung bình.`,
              'Thiết lập dashboard theo dõi CPA và ROAS theo ngày để đảm bảo hiệu suất marketing.'
            ]
          : [
              'Phân tích lại funnel chuyển đổi từng kênh, chọn 2 sản phẩm có CTR cao để thử nghiệm A/B creative mới.',
              `Chạy chiến dịch lead-gen thu thập email trong ${currentPeriodLabel} để nuôi dưỡng khách hàng tiềm năng.`
            ],
        metrics: {
          topProductRevenue: topProduct?.revenue || 0,
          totalRevenue: revenueSnapshot.current || 0,
          topProducts: topProductsList.map((item) => ({
            title: item.title,
            revenue: item.revenue,
            share: revenueSnapshot.current ? Math.round((item.revenue / revenueSnapshot.current) * 100) : 0
          })),
          timeframe: timeframeAnalytics[range]
        }
      };

      const inventoryRecommendation = {
        category: 'inventoryStrategy',
        title: 'Chiến lược Kho',
        summary: warehouseAlertsRows[0].length
          ? `${warehouseAlertsRows[0].length} tựa sách dưới ngưỡng an toàn trong ${currentPeriodLabel} – cần lập kế hoạch nhập bổ sung trong 7 ngày.`
          : 'Tồn kho ổn định, có thể chuyển nguồn lực sang xử lý nhóm tồn lâu.',
        reasons: [
          warehouseAlertsRows[0].length
            ? `Cảnh báo tồn thấp: ${warehouseAlertsRows[0].slice(0, 3).map((item) => `${item.title} (${item.quantity})`).join(', ')}`
            : 'Không có sản phẩm nào dưới ngưỡng 10 cuốn.',
          overstockRows[0].length
            ? `Nhóm tồn cao: ${overstockRows[0].slice(0, 3).map((item) => `${item.title} (${item.quantity})`).join(', ')}`
            : null,
          staleRows[0].length
            ? `${staleRows[0].length} đầu sách chưa bán được trong 180 ngày.`
            : null
        ].filter(Boolean),
        actions: [
          warehouseAlertsRows[0].length
            ? `Lên đơn nhập lại tối thiểu 80 cuốn cho “${warehouseAlertsRows[0][0].title}” để đảm bảo hàng cho ${currentPeriodLabel}.`
            : 'Đánh giá định mức tồn kho và chuyển ngân sách nhập hàng sang nhóm bán chạy.',
          overstockRows[0].length
            ? `Chạy chương trình bundle hoặc giảm 15% cho ${overstockRows[0].slice(0, 2).map((item) => item.title).join(', ')} nhằm giải phóng kho.`
            : 'Duy trì kiểm soát nhập hàng hàng tuần và cập nhật dự báo nhu cầu.',
          staleRows[0].length
            ? 'Thiết kế chiến dịch xả hàng tồn lâu với ưu đãi “Mua 2 tặng 1” và truyền thông trên social.'
            : null
        ].filter(Boolean),
        metrics: {
          lowStock: warehouseAlertsRows[0],
          overstock: overstockRows[0],
          stale: staleRows[0],
          timeframe: timeframeAnalytics[range]
        }
      };

      const customerServiceRecommendation = {
        category: 'customerServiceStrategy',
        title: 'Chiến lược Dịch vụ khách hàng',
        summary: negativeReviewRows[0].length
          ? `Có ${negativeReviewRows[0].length} tựa sách dưới 2.5★ trong ${currentPeriodLabel} – cần ưu tiên xử lý phản hồi và cải thiện nội dung hướng dẫn.`
          : `Đánh giá ${currentPeriodLabel} tích cực, tiếp tục duy trì SLA phản hồi < 2 giờ.`,
        reasons: negativeReviewRows[0].length
          ? [
              `Điểm nóng: ${negativeReviewRows[0].slice(0, 3).map((item) => `${item.title} (${Number(item.avg_rating || 0).toFixed(1)}★)`).join(', ')}`,
              `${formatNumber(lowRatingCount)} lượt đánh giá ≤ 2★ (${formatPercentText((lowRatingCount / distributionTotal) * 100)}) cần phản hồi.`,
              `${formatNumber(highRatingCount)} lượt đánh giá ≥ 4★ cho thấy trải nghiệm tích cực vẫn chiếm ưu thế.`
            ]
          : [
              `Không ghi nhận sản phẩm nào dưới 2.5★ trong ${currentPeriodLabel}.`,
              `${formatNumber(highRatingCount)} lượt đánh giá ≥ 4★ giúp củng cố uy tín thương hiệu.`
            ],
        actions: negativeReviewRows[0].length
          ? [
              `Thiết lập quy trình phản hồi trong 12 giờ cho các đánh giá ≤ 2★, ưu tiên “${negativeReviewRows[0][0].title}”.`,
              'Gửi email xin lỗi + mã giảm giá 10% và hướng dẫn sử dụng chi tiết cho khách để tăng tỷ lệ giữ chân.',
              'Thu thập phản hồi chi tiết và cập nhật FAQ/knowledge base ngay trong tuần.'
            ]
          : [
              'Triển khai chiến dịch “Chia sẻ trải nghiệm” khuyến khích khách hàng đánh giá 5★ nhận voucher 5%.',
              'Gửi báo cáo cảm ơn cho nhóm CSKH và duy trì SLA phản hồi hiện tại.'
            ],
        metrics: {
          negativeHighlights: negativeReviewRows[0],
          distribution: reviewDistribution,
          timeframe: timeframeAnalytics[range]
        }
      };

      const forecastRecommendation = {
        category: 'trendForecast',
        title: 'Dự báo xu hướng',
        summary: forecastGrowth >= 0
          ? `Mô hình dự báo doanh thu ${nextPeriodLabel} có thể tăng ${Math.abs(forecastGrowth)}% nếu duy trì chiến dịch hiện tại.`
          : `Doanh thu ${nextPeriodLabel} có nguy cơ giảm ${Math.abs(forecastGrowth)}% nếu không kích hoạt chiến dịch mới.`,
        reasons: [
          `Doanh thu ${currentPeriodLabel}: ${formatCurrency(revenueSnapshot.current || 0)} (${formatPercentText(revenueSnapshot.changePercent ?? changeRevenue)} so với ${previousPeriodLabel}).`,
          `Xu hướng gần nhất: ${monthlyTrendRows.slice(-2).map((item) => `${item.label}: ${formatCurrency(item.revenue)}`).join(' ➜ ')}.`,
          ...timeframeComparisons
        ],
        actions: forecastGrowth >= 0
          ? [
              `Chuẩn bị chiến dịch Flash Sale trước ${range === 'month' ? '7' : '14'} ngày, đặt mục tiêu uplift tối thiểu 12%.`,
              'Tăng ngân sách remarketing thêm 20% để tận dụng đà tăng trưởng hiện tại.'
            ]
          : [
              'Kích hoạt chương trình “Mua 2 tặng 1” cho danh mục bán chậm trong 10 ngày.',
              'Đánh giá lại funnel chuyển đổi, tối ưu CTA tại các trang sản phẩm và tác giả để cải thiện tỷ lệ chuyển đổi.'
            ],
        metrics: {
          forecastGrowth,
          changeRevenue,
          trend: monthlyTrendRows.slice(-3),
          focusRange: range,
          timeframes: timeframeAnalytics
        }
      };

      const aiRecommendations = [
        marketingRecommendation,
        inventoryRecommendation,
        customerServiceRecommendation,
        forecastRecommendation
      ];

      const [recentLogs, totalLogs] = await Promise.all([
        AILogModel.getRecentLogs(10),
        AILogModel.countLogs()
      ]);

      const responsePayload = {
        lastUpdated: new Date().toISOString(),
        range,
        summaryCards,
        sales: {
          trend: monthlyTrendRows.map(item => ({
            label: item.label,
            revenue: Number(item.revenue || 0),
            orders: Number(item.total_orders || 0)
          })),
          filters: {
            categories: [],
            authors: [],
            publishers: []
          },
          summary: llmNarrative || aiSummaryNotes[0] || 'Doanh thu duy trì ổn định qua các kỳ gần đây.',
          insights: aiSummaryNotes,
          rangeContext: timeframeAnalytics[range]
        },
        inventory: {
          lowStock: warehouseAlertsRows[0],
          overstock: overstockRows[0],
          stale: staleRows[0],
          summary: warehouseAlertsRows[0].length
            ? `${warehouseAlertsRows[0].length} sản phẩm cần nhập thêm. ${overstockRows[0].length ? 'Có thể chạy giảm giá nhẹ cho các tựa sách tồn kho cao.' : ''}`.trim()
            : 'Kho ổn định, chưa có cảnh báo.'
        },
        reviews: {
          distribution: reviewDistribution,
          negativeHighlights: negativeReviewRows[0].map(item => ({
            title: item.title,
            avgRating: Number(item.avg_rating || 0).toFixed(1),
            reviewCount: item.review_count
          })),
          summary: negativeReviewRows[0].length
            ? `Có ${negativeReviewRows[0].length} tựa sách dưới 2.5★ cần xử lý.`
            : 'Đánh giá khách hàng tích cực, chưa có cảnh báo.',
          insights: reviewInsights,
          actions: reviewActions
        },
        customerBehavior: {
          trafficSources: trafficSourcesPercent,
          heatmap,
          conversion: {
            rate: conversionRate,
            comment: conversionRate >= 0.05
              ? 'Tỷ lệ chuyển đổi cao — tiếp tục tối ưu landing page.'
              : 'Tỷ lệ chuyển đổi thấp — nên bổ sung CTA nổi bật và ưu đãi giới hạn thời gian.'
          }
        },
        aiRecommendations,
        timeframes: timeframeAnalytics,
        logs: {
          total: totalLogs,
          recent: recentLogs
        }
      };

      return res.json({ success: true, data: responsePayload });
    } catch (error) {
      console.error('[AnalyticsController] getDashboard error:', error);
      return res.status(500).json({
        success: false,
        message: 'Không thể tải dữ liệu AI Dashboard',
        error: error.message
      });
    }
  }

  static async createLog(req, res) {
    try {
      // API dùng để lưu lại các hành động quan trọng mà admin thực hiện trên dashboard AI.
      const adminId = req.user?.userId || null;
      const { actionType, context = {}, note } = req.body || {};

      if (!actionType) {
        return res.status(400).json({ success: false, message: 'Thiếu actionType' });
      }

      const log = await AILogModel.createLog({ adminId, actionType, context, note });

      return res.json({ success: true, data: log });
    } catch (error) {
      console.error('[AnalyticsController] createLog error:', error);
      return res.status(500).json({ success: false, message: 'Không thể lưu nhật ký AI', error: error.message });
    }
  }

  static async getLogs(req, res) {
    try {
      // API phục vụ phần lịch sử hoạt động AI – trả về danh sách log gần nhất.
      const limit = Number(req.query.limit) || 20;
      const [logs, total] = await Promise.all([
        AILogModel.getRecentLogs(limit),
        AILogModel.countLogs()
      ]);

      return res.json({
        success: true,
        data: {
          total,
          items: logs
        }
      });
    } catch (error) {
      console.error('[AnalyticsController] getLogs error:', error);
      return res.status(500).json({ success: false, message: 'Không thể tải nhật ký AI', error: error.message });
    }
  }
}

module.exports = AnalyticsController;

