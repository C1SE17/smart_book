/**
 * Book Routes
 * Presentation layer - defines API endpoints
 */
const express = require('express');
const router = express.Router();

// Dependency injection setup
const BookRepository = require('../../../infrastructure/database/mysql/repositories/BookRepository');
const GetAllBooksUseCase = require('../../../application/use-cases/book/GetAllBooksUseCase');
const GetBookByIdUseCase = require('../../../application/use-cases/book/GetBookByIdUseCase');
const BookController = require('../controllers/BookController');

// Initialize dependencies
const bookRepository = new BookRepository();
const getAllBooksUseCase = new GetAllBooksUseCase(bookRepository);
const getBookByIdUseCase = new GetBookByIdUseCase(bookRepository);
const bookController = new BookController(getAllBooksUseCase, getBookByIdUseCase);

// Define routes
router.get('/', (req, res) => bookController.getAllBooks(req, res));
router.get('/search', (req, res) => bookController.searchBooks(req, res));
router.get('/:id', (req, res) => bookController.getBookById(req, res));

module.exports = router;

module.exports = router;

