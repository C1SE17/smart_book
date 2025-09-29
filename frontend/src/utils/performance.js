// Performance optimization utilities

// Debounce function for search and input handling
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for scroll and resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Memoization helper for expensive calculations
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// Image optimization helper
export const optimizeImage = (src, width, height, quality = 80) => {
  if (src.includes('unsplash.com')) {
    return `${src}&w=${width}&h=${height}&q=${quality}&fit=crop`;
  }
  return src;
};

// Memory cleanup utility
export const cleanup = (refs) => {
  refs.forEach(ref => {
    if (ref.current) {
      ref.current = null;
    }
  });
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
  return result;
};

// Virtual scrolling helper for large lists
export const getVisibleItems = (items, containerHeight, itemHeight, scrollTop) => {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  return items.slice(startIndex, endIndex);
};

export default {
  debounce,
  throttle,
  memoize,
  optimizeImage,
  cleanup,
  measurePerformance,
  getVisibleItems
};