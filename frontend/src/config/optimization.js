// Frontend optimization configuration

export const OPTIMIZATION_CONFIG = {
  // Image optimization
  IMAGES: {
    QUALITY: 80,
    FORMATS: ['webp', 'jpg', 'png'],
    SIZES: {
      THUMBNAIL: { width: 150, height: 200 },
      CARD: { width: 300, height: 400 },
      HERO: { width: 600, height: 400 },
      AVATAR: { width: 80, height: 80 }
    }
  },

  // Performance thresholds
  PERFORMANCE: {
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100,
    LAZY_LOAD_OFFSET: 100,
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    MAX_CACHE_SIZE: 50
  },

  // Bundle optimization
  BUNDLE: {
    CHUNK_SIZE_LIMIT: 250000, // 250KB
    PREFETCH_DELAY: 2000, // 2 seconds
    PRELOAD_CRITICAL: true
  },

  // API optimization
  API: {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    CACHE_RESPONSES: true
  },

  // UI optimization
  UI: {
    ANIMATION_DURATION: 300,
    TRANSITION_DURATION: 200,
    DEBOUNCE_INPUT: 500,
    VIRTUAL_SCROLL_THRESHOLD: 100
  }
};

// Environment-specific optimizations
export const getOptimizationConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    ...OPTIMIZATION_CONFIG,
    DEBUG: isDevelopment,
    MINIFY: isProduction,
    SOURCE_MAPS: isDevelopment,
    HOT_RELOAD: isDevelopment
  };
};

export default OPTIMIZATION_CONFIG;
