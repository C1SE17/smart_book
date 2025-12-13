/**
 * Translation Routes
 */
const express = require('express');
const router = express.Router();

const TranslationService = require('../../../infrastructure/ai/services/TranslationService');
const TranslateTextUseCase = require('../../../application/use-cases/translation/TranslateTextUseCase');
const TranslationController = require('../controllers/TranslationController');

// Initialize dependencies
const translationService = new TranslationService();
const translateTextUseCase = new TranslateTextUseCase(translationService);
const translationController = new TranslationController(translateTextUseCase);

// Define routes
router.post('/translate', (req, res) => translationController.translate(req, res));

module.exports = router;

