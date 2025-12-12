/**
 * Search Routes - Định nghĩa các route cho tìm kiếm
 */

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/SearchController');

router.get('/suggestions', searchController.getSearchSuggestions);
router.get('/popular-keywords', searchController.getPopularKeywords);
router.get('/advanced', searchController.advancedSearch);

module.exports = router;
