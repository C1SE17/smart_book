/**
 * Infrastructure Configuration
 * Centralized configuration management
 */
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    apiPrefix: '/api',
  },

  // Database configuration
  database: {
    mysql: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'smart_book',
      port: Number(process.env.DB_PORT) || 3306,
    },
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/customer_tracking',
    },
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  // AI/ML configuration
  ai: {
    translation: {
      glossaryPath: path.join(__dirname, '../../../ai/resources/book_glossary.json'),
      corpusPath: path.join(__dirname, '../../../ai/resources/book_parallel.json'),
      defaultModel: process.env.TRANSLATION_MODEL || 'Helsinki-NLP/opus-mt-vi-en',
      embeddingModel: process.env.EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2',
    },
    analytics: {
      modelDir: path.join(__dirname, '../../../ai/models'),
    },
  },

  // CORS configuration
  cors: {
    origins: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
    ],
  },
};

module.exports = config;

