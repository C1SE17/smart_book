/**
 * Search Controller - Xử lý các API liên quan đến tìm kiếm
 * Sử dụng MVC pattern với Views để format responses
 */

const Book = require('../models/Book');
const { SearchView } = require('../views');

const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      const { response, statusCode } = SearchView.validationError('Query parameter "q" is required.');
      return res.status(statusCode).json(response);
    }
    const suggestions = await Book.getSearchSuggestions(q);
    const response = SearchView.suggestions(suggestions);
    res.json(response);
  } catch (error) {
    console.error('[SearchController] Lỗi khi lấy gợi ý tìm kiếm:', error);
    const { response, statusCode } = SearchView.error('Lỗi máy chủ khi lấy gợi ý tìm kiếm.', 500, error.message);
    res.status(statusCode).json(response);
  }
};

const getPopularKeywords = async (req, res) => {
  try {
    const keywords = await Book.getPopularKeywords();
    const response = SearchView.popularKeywords(keywords);
    res.json(response);
  } catch (error) {
    console.error('[SearchController] Lỗi khi lấy từ khóa phổ biến:', error);
    const { response, statusCode } = SearchView.error('Lỗi máy chủ khi lấy từ khóa phổ biến.', 500, error.message);
    res.status(statusCode).json(response);
  }
};

const advancedSearch = async (req, res) => {
  try {
    const {
      query,
      q,
      category_id,
      author_id,
      publisher_id,
      min_price,
      max_price,
      min_rating,
      min_year,
      max_year,
      sort,
      order,
      page,
      limit
    } = req.query;

    const textQuery = query ?? q ?? undefined;

    const result = await Book.advancedSearch({
      query: textQuery,
      category_id,
      author_id,
      publisher_id,
      min_price,
      max_price,
      min_rating,
      min_year,
      max_year,
      sort,
      order,
      page,
      limit
    });
    const response = SearchView.advancedSearch(result.books, result.pagination);
    res.json(response);
  } catch (error) {
    console.error('[SearchController] Lỗi khi tìm kiếm nâng cao:', error);
    const { response, statusCode } = SearchView.error('Lỗi máy chủ khi tìm kiếm nâng cao.', 500, error.message);
    res.status(statusCode).json(response);
  }
};

module.exports = {
  getSearchSuggestions,
  getPopularKeywords,
  advancedSearch
};
