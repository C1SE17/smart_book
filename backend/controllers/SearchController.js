/**
 * Search Controller - Xử lý các API liên quan đến tìm kiếm
 */

const Book = require('../models/Book');

const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Query parameter "q" is required.' });
    }
    const suggestions = await Book.getSearchSuggestions(q);
    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('[SearchController] Lỗi khi lấy gợi ý tìm kiếm:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy gợi ý tìm kiếm.' });
  }
};

const getPopularKeywords = async (req, res) => {
  try {
    const keywords = await Book.getPopularKeywords();
    res.json({ success: true, data: keywords });
  } catch (error) {
    console.error('[SearchController] Lỗi khi lấy từ khóa phổ biến:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy từ khóa phổ biến.' });
  }
};

const advancedSearch = async (req, res) => {
  try {
    const { query, category_id, author_id, publisher_id, min_price, max_price, min_rating, sort, order, page, limit } = req.query;
    const result = await Book.advancedSearch({
      query, category_id, author_id, publisher_id, min_price, max_price, min_rating, sort, order, page, limit
    });
    res.json({ success: true, data: result.books, pagination: result.pagination });
  } catch (error) {
    console.error('[SearchController] Lỗi khi tìm kiếm nâng cao:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tìm kiếm nâng cao.' });
  }
};

module.exports = {
  getSearchSuggestions,
  getPopularKeywords,
  advancedSearch
};
