/**
 * Error Handler Middleware
 * Centralized error handling for API
 */
const AppError = require('../../../shared/utils/errors/AppError');
const DomainError = require('../../../shared/errors/DomainError');

const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Handle known error types
  if (err instanceof DomainError || err instanceof AppError) {
    return res.status(err.statusCode || 500).json({
      success: false,
      error: {
        code: err.code || 'ERROR',
        message: err.message,
        ...(err.field && { field: err.field }),
      },
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
      },
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      },
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;

