const express = require('express');
const BookTranslationController = require('../controllers/BookTranslationController');

const router = express.Router();

router.post('/', BookTranslationController.translate);

module.exports = router;


