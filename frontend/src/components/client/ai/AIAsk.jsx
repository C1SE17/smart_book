import React, { useState, useEffect, useMemo, useCallback } from 'react';
import searchApi from '../../../services/searchApi';
import categoryApi from '../../../services/categoryApi';
import authorApi from '../../../services/authorApi';
import publisherApi from '../../../services/publisherApi';
import recommendationApi from '../../../services/recommendationApi';
import bookApi from '../../../services/bookApi';
import { useLanguage } from '../../../contexts/LanguageContext';
import './AIAsk.css';

// 📘 Thành phần AIAsk: màn hình “AI Ask” giúp người dùng tìm sách thông minh bằng cách kết hợp bộ lọc + dữ liệu hành vi từ backend.

//  Bộ giá trị mặc định cho các bộ lọc nhanh
const INITIAL_FILTERS = (currentYear) => ({
  categories: [],
  authors: [],
  publishers: [],
  price: [0, 500000],
  years: [2000, currentYear],
  languages: [],
  status: 'in_stock',
  minRating: 4,
  tags: []
});

//  Từ điển đồng nghĩa (ví dụ: kiếm hiệp ↔ wuxia)
const CATEGORY_SYNONYMS = {
  'Kiếm hiệp': ['Wuxia', 'Võ hiệp'],
  Wuxia: ['Kiếm hiệp'],
  'Light novel': ['LN']
};

const AIAsk = ({ onNavigateTo, onSearch }) => {
  const { t, language } = useLanguage();
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const locale = useMemo(() => (language?.startsWith('vi') ? 'vi-VN' : 'en-US'), [language]);
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }),
    [locale]
  );
  const formatCurrency = useCallback(
    (value = 0) => {
      try {
        return currencyFormatter.format(value);
      } catch (error) {
        return value?.toString() || '0';
      }
    },
    [currencyFormatter]
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [popularKeywords, setPopularKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState({ books: [], authors: [], categories: [] });
  const [metaOptions, setMetaOptions] = useState({ categories: [], authors: [], publishers: [] });
  const [filters, setFilters] = useState(() => INITIAL_FILTERS(new Date().getFullYear()));
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [messageState, setMessageState] = useState({ key: 'aiAsk.messages.initial', params: {} });
  const [insights, setInsights] = useState([]); // Ghi chú phân tích gợi ý để hiển thị cho người dùng
  const showMessage = useCallback((key, params = {}) => {
    setMessageState({ key, params });
  }, []);

  const languageOptions = useMemo(
    () => t('aiAsk.languageOptions', { returnObjects: true }) || [],
    [t]
  );
  const languageLabelMap = useMemo(() => {
    const map = new Map();
    languageOptions.forEach((option) => map.set(option.value, option.label));
    return map;
  }, [languageOptions]);

  const statusOptions = useMemo(
    () => t('aiAsk.statusOptions', { returnObjects: true }) || [],
    [t]
  );

  const tagOptions = useMemo(() => t('aiAsk.tagLibrary', { returnObjects: true }) || [], [t]);
  const tagLabelMap = useMemo(() => {
    const map = new Map();
    tagOptions.forEach((option) => map.set(option.value, option.label));
    return map;
  }, [tagOptions]);

  const MIN_AI_RESULTS = 3;
  const MAX_AI_RESULTS = 12;

  const message = useMemo(() => {
    const params = { ...(messageState.params || {}) };
    if (Array.isArray(params.dataTypeKeys)) {
      params.dataTypes = params.dataTypeKeys
        .map((typeKey) => t(`aiAsk.dataTypes.${typeKey}`))
        .join(', ');
      delete params.dataTypeKeys;
    }
    return t(messageState.key, params);
  }, [messageState, t]);

  //  Chuẩn hóa dữ liệu danh mục/tác giả/NXB để tra cứu nhanh theo id
  const categoryMap = useMemo(() => {
    const map = new Map();
    metaOptions.categories.forEach((item) => map.set(item.category_id, item.name));
    return map;
  }, [metaOptions.categories]);

  const authorMap = useMemo(() => {
    const map = new Map();
    metaOptions.authors.forEach((item) => map.set(item.author_id, item.name));
    return map;
  }, [metaOptions.authors]);

  const publisherMap = useMemo(() => {
    const map = new Map();
    metaOptions.publishers.forEach((item) => map.set(item.publisher_id, item.name));
    return map;
  }, [metaOptions.publishers]);

  const closeDropdown = useCallback(() => setOpenDropdown(null), []);

  // 👂 Lắng nghe click ngoài dropdown để đóng popup gợi ý/bộ lọc cho gọn giao diện
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.aiask-filter-control') && !event.target.closest('.aiask-suggestion-panel')) {
        closeDropdown();
      }
      if (!event.target.closest('.aiask-search-input')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [closeDropdown]);

  // ⌨️ Tải gợi ý autocomplete theo thời gian thực
  useEffect(() => {
    // 📡 Load dữ liệu danh mục/tác giả/NXB + từ khóa phổ biến ngay khi mở trang
    const fetchMeta = async () => {
      try {
        const [categoriesRes, authorsRes, publishersRes, keywordsRes] = await Promise.all([
          categoryApi.getCategories(),
          authorApi.getAllAuthors(),
          publisherApi.getPublishers(),
          searchApi.getPopularKeywords()
        ]);

        const warnings = [];

        const categories = categoriesRes?.success ? categoriesRes.data || [] : [];
        if (!categoriesRes?.success) warnings.push('categories');

        const authors = authorsRes?.success ? authorsRes.data || [] : [];
        if (!authorsRes?.success) warnings.push('authors');

        const publishers = publishersRes?.success ? publishersRes.data || [] : [];
        if (!publishersRes?.success) warnings.push('publishers');

        setMetaOptions({ categories, authors, publishers });

        setPopularKeywords(keywordsRes?.success ? keywordsRes.data || [] : []);

        if (warnings.length) {
          showMessage('aiAsk.messages.metaLoadPartial', { dataTypeKeys: warnings });
        }
      } catch (error) {
        console.error('AIAsk - Lỗi tải metadata bộ lọc:', error);
        showMessage('aiAsk.messages.metaLoadError');
      }
    };

    fetchMeta();
  }, [showMessage]);

  useEffect(() => {
    if (!searchTerm) {
      setSuggestions({ books: [], authors: [], categories: [] });
      return;
    }

    const debounce = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const response = await searchApi.getSearchSuggestions(searchTerm);
        const data = response?.data || [];

        const books = data.filter(item => item.type === 'book');
        const authors = data.filter(item => item.type === 'author');
        const categories = data.filter(item => item.type === 'category');

        setSuggestions({ books, authors, categories });
      } catch (error) {
        console.error('AIAsk - Lỗi lấy gợi ý autocomplete:', error);
        showMessage('aiAsk.messages.autocompleteError');
      } finally {
        setLoadingSuggestions(false);
      }
    }, 320);

    return () => clearTimeout(debounce);
  }, [searchTerm, showMessage]);

  const filteredQueries = useMemo(() => {
    if (!searchTerm) {
      return popularKeywords.slice(0, 6);
    }

    const normalized = searchTerm.toLowerCase();
    const matched = popularKeywords.filter(keyword => keyword.toLowerCase().includes(normalized));
    const deduped = matched.filter((value, idx, arr) => arr.indexOf(value) === idx);

    if (!deduped.find(keyword => keyword.toLowerCase() === normalized)) {
      return [searchTerm, ...deduped].slice(0, 6);
    }
    return deduped.slice(0, 6);
  }, [popularKeywords, searchTerm]);

  const updateFilters = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleMultiOption = useCallback((key, option) => {
    setFilters(prev => {
      const currentValues = prev[key];
      const exists = currentValues.some(item => item === option);
      const updated = exists ? currentValues.filter(item => item !== option) : [...currentValues, option];
      return { ...prev, [key]: updated };
    });
  }, []);

  // ➕ Thêm giá trị vào mảng bộ lọc nhưng tránh trùng lặp
  const addFilterValue = useCallback((key, value) => {
    setFilters(prev => {
      const list = prev[key];
      if (list.includes(value)) return prev;
      return { ...prev, [key]: [...list, value] };
    });
  }, []);

  // 🧠 Tóm tắt các bộ lọc đang áp dụng để hiển thị trong thông điệp AI
  const filterSummary = useMemo(() => {
    const parts = [];

    if (filters.categories.length) {
      const names = filters.categories.map(id => categoryMap.get(id)).filter(Boolean);
      if (names.length) {
        parts.push(t('aiAsk.filterSummary.categories', { names: names.join(', ') }));
      }
    }

    if (filters.authors.length) {
      const names = filters.authors.map(id => authorMap.get(id)).filter(Boolean);
      if (names.length) {
        parts.push(t('aiAsk.filterSummary.authors', { names: names.join(', ') }));
      }
    }

    if (filters.publishers.length) {
      const names = filters.publishers.map(id => publisherMap.get(id)).filter(Boolean);
      if (names.length) {
        parts.push(t('aiAsk.filterSummary.publishers', { names: names.join(', ') }));
      }
    }

    const [minPrice, maxPrice] = filters.price;
    if (minPrice > 0 || maxPrice < 500000) {
      parts.push(
        t('aiAsk.filterSummary.price', {
          min: formatCurrency(minPrice),
          max: formatCurrency(maxPrice)
        })
      );
    }

    const [minYear, maxYear] = filters.years;
    if (minYear !== 2000 || maxYear !== currentYear) {
      parts.push(t('aiAsk.filterSummary.years', { min: minYear, max: maxYear }));
    }

    if (filters.languages.length) {
      const langs = filters.languages.map(code => languageLabelMap.get(code) || code);
      parts.push(t('aiAsk.filterSummary.languages', { names: langs.join(', ') }));
    }

    if (filters.tags.length) {
      const tags = filters.tags.map(tag => `#${tagLabelMap.get(tag) || tag}`);
      parts.push(t('aiAsk.filterSummary.tags', { tags: tags.join(', ') }));
    }

    if (filters.minRating > 0) {
      parts.push(t('aiAsk.filterSummary.minRating', { value: filters.minRating.toFixed(1) }));
    }

    return parts.join(', ');
  }, [
    authorMap,
    categoryMap,
    currentYear,
    filters,
    formatCurrency,
    languageLabelMap,
    publisherMap,
    tagLabelMap,
    t
  ]);

  // 🧾 Sinh danh sách insight để hiển thị dưới phần thông điệp của AI
  const buildInsights = useCallback((books, { summary, sourceLabel, isFallback } = {}) => {
    const lines = [];

    if (summary) {
      lines.push({ key: 'aiAsk.insights.priorityFilters', params: { summary } });
    }

    if (sourceLabel) {
      lines.push({
        key: isFallback ? 'aiAsk.insights.dataSourceFallback' : 'aiAsk.insights.dataSource',
        params: { source: sourceLabel }
      });
    }

    if (books && books.length) {
      const ratingValues = books
        .map(item => Number(item.rating || item.avg_rating || 0))
        .filter(value => value > 0);

      if (ratingValues.length) {
        const avgRating = ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length;
        lines.push({
          key: 'aiAsk.insights.averageRating',
          params: { value: avgRating.toFixed(1) }
        });
      }

      const priceValues = books
        .map(item => Number(item.price))
        .filter(value => !Number.isNaN(value) && value > 0);

      if (priceValues.length) {
        const minPrice = Math.min(...priceValues);
        const maxPrice = Math.max(...priceValues);
        lines.push({
          key: 'aiAsk.insights.priceRange',
          params: { min: formatCurrency(minPrice), max: formatCurrency(maxPrice) }
        });
      }

      const categoryCounter = new Map();
      books.forEach(item => {
        if (!item.category_id) return;
        const current = categoryCounter.get(item.category_id) || 0;
        categoryCounter.set(item.category_id, current + 1);
      });
      if (categoryCounter.size) {
        const topCategoryId = [...categoryCounter.entries()].sort((a, b) => b[1] - a[1])[0][0];
        const categoryName = categoryMap.get(topCategoryId);
        if (categoryName) {
          lines.push({
            key: 'aiAsk.insights.topCategory',
            params: { category: categoryName }
          });
        }
      }
    }

    setInsights(lines);
  }, [categoryMap, formatCurrency]);

  //  Kiểm tra một cuốn sách có đáp ứng bộ lọc hiện tại hay không
  const matchesFilters = useCallback((book) => {
    if (!book) return false;

    const normalizeId = (value) => {
      if (value === null || value === undefined) return null;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? null : parsed;
    };

    const categoryId = normalizeId(book.category_id ?? book.categoryId);
    const authorId = normalizeId(book.author_id ?? book.authorId);
    const publisherId = normalizeId(book.publisher_id ?? book.publisherId);
    const ratingValue = Number(book.rating ?? book.avg_rating ?? 0);
    const bookPrice = Number(book.price ?? 0);
    const [minPrice, maxPrice] = filters.price;
    const [minYear, maxYear] = filters.years;
    const bookYear = book.published_date ? new Date(book.published_date).getFullYear() : null;

    // Category: sách chỉ cần thuộc MỘT trong các category đã chọn (không phải tất cả)
    if (filters.categories.length > 0) {
      if (!categoryId || !filters.categories.includes(categoryId)) {
      return false;
      }
    }

    // Author: sách chỉ cần thuộc MỘT trong các author đã chọn
    if (filters.authors.length > 0) {
      if (!authorId || !filters.authors.includes(authorId)) {
      return false;
      }
    }

    // Publisher: sách chỉ cần thuộc MỘT trong các publisher đã chọn
    if (filters.publishers.length > 0) {
      if (!publisherId || !filters.publishers.includes(publisherId)) {
      return false;
      }
    }

    // Rating: sách phải có rating >= minRating
    if (filters.minRating > 0 && ratingValue < filters.minRating) {
      return false;
    }

    // Price: sách phải nằm trong khoảng giá
    if (bookPrice > 0) {
      if (minPrice > 0 && bookPrice < minPrice) {
        return false;
      }
      if (maxPrice < 500000 && bookPrice > maxPrice) {
        return false;
      }
    }

    // Year: sách phải nằm trong khoảng năm
    if (bookYear !== null) {
      if (minYear > 2000 && bookYear < minYear) {
        return false;
      }
      if (maxYear < new Date().getFullYear() && bookYear > maxYear) {
        return false;
      }
    }

    // Language: sách phải có language trong danh sách đã chọn
    if (filters.languages.length > 0) {
      const bookLanguage = book.language || book.language_code;
      if (!bookLanguage || !filters.languages.includes(bookLanguage)) {
        return false;
      }
    }

    // Status: sách phải có status phù hợp
    if (filters.status && filters.status !== 'all') {
      const bookStatus = book.stock > 0 ? 'in_stock' : 'out_of_stock';
      if (filters.status === 'in_stock' && bookStatus !== 'in_stock') {
        return false;
      }
      if (filters.status === 'out_of_stock' && bookStatus !== 'out_of_stock') {
        return false;
      }
    }

    return true;
  }, [filters]);

  const handleSubmitSearch = useCallback((event) => {
    event.preventDefault();
    if (!searchTerm.trim()) {
      showMessage('aiAsk.messages.emptyQuery');
      return;
    }
    setShowSuggestions(false);
    onSearch?.(searchTerm.trim());
    onNavigateTo?.('search', { searchQuery: searchTerm.trim(), q: searchTerm.trim() });
    showMessage('aiAsk.messages.searchOpening', { query: searchTerm.trim() });
    setInsights([]);
  }, [onNavigateTo, onSearch, searchTerm, showMessage]);

  // Chuẩn hóa tham số gửi xuống API tìm kiếm nâng cao
  const buildAdvancedParams = useCallback((overrides = {}) => {
    const [minPrice, maxPrice] = filters.price;
    const [minYear, maxYear] = filters.years;

    // Nếu có nhiều category, ưu tiên category đầu tiên
    const singleCategory = filters.categories.length > 0 ? filters.categories[0] : undefined;
    const singleAuthor = filters.authors.length > 0 ? filters.authors[0] : undefined;
    const singlePublisher = filters.publishers.length > 0 ? filters.publishers[0] : undefined;

    const baseParams = {
      query: searchTerm || undefined,
      category_id: singleCategory,
      author_id: singleAuthor,
      publisher_id: singlePublisher,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      min_year: minYear || undefined,
      max_year: maxYear || undefined,
      min_rating: filters.minRating || undefined,
      language: filters.languages.join(',') || undefined,
      status: filters.status || undefined,
      tags: filters.tags.join(',') || undefined,
      limit: 9,
      sort: 'book_id',
      order: 'DESC'
    };

    return {
      ...baseParams,
      ...overrides
    };
  }, [filters, searchTerm]);

  // 🤖 Nút “Gợi ý nhanh”: kết hợp recommender + bộ lọc hiện tại
  const handleQuickRecommend = useCallback(async () => {
    setLoadingRecommendations(true);
    showMessage('aiAsk.messages.quickAnalyzing');
    setInsights([]);

    const uniqueBooks = new Map();
    const reasons = new Map();

    const pushBooks = (books = [], reason) => {
      let addedCount = 0;
      let filteredCount = 0;
      let noIdCount = 0;
      
      books.forEach((book) => {
        const id = book?.book_id || book?.id;
        if (!id) {
          noIdCount++;
          console.warn('Sách không có ID:', book);
          return;
        }
        
        if (!matchesFilters(book)) {
          filteredCount++;
          return;
        }
        
        if (!uniqueBooks.has(id)) {
          uniqueBooks.set(id, book);
          reasons.set(id, new Set());
          addedCount++;
        }
        if (reason) {
          reasons.get(id)?.add(reason);
        }
      });
      
      if (books.length > 0) {
        console.log(`PushBooks kết quả: ${addedCount} thêm, ${filteredCount} bị filter, ${noIdCount} không có ID, tổng: ${books.length}`);
      }
    };

    const gatherReasons = () => {
      const all = new Set();
      reasons.forEach((set) => set.forEach((label) => all.add(label)));
      return all.size ? Array.from(all).join(', ') : undefined;
    };

    try {
      console.log('[AIAsk] Bắt đầu handleQuickRecommend với filters:', filters);
      console.log('MIN_AI_RESULTS:', MIN_AI_RESULTS, 'MAX_AI_RESULTS:', MAX_AI_RESULTS);
      
      let isFallback = false;

      const ensureCount = async (fetchParams, reasonLabel) => {
        if (uniqueBooks.size >= MAX_AI_RESULTS) return;
        try {
          console.log('Đang gọi advancedSearch với params:', fetchParams);
          const response = await searchApi.advancedSearch(fetchParams);
          console.log('Response từ advancedSearch:', response);
          
          if (response?.success) {
            // Backend trả về: { success: true, data: result.books, pagination: ... }
            // response.data là array books
            const list = Array.isArray(response.data) ? response.data : response.data?.books || [];
            console.log('Danh sách sách nhận được:', list.length, 'cuốn');
            console.log('Chi tiết sách:', list.slice(0, 3));
            
            if (list.length > 0) {
              const beforeCount = uniqueBooks.size;
              pushBooks(list, reasonLabel);
              const afterCount = uniqueBooks.size;
              console.log(`Đã thêm ${afterCount - beforeCount} sách mới, tổng số: ${afterCount}`);
            } else {
              console.warn('Không có sách nào trong response');
            }
          } else {
            console.warn('Response không thành công:', response);
          }
        } catch (error) {
          console.error('Lỗi advancedSearch:', error);
          console.error('Chi tiết lỗi:', error.message, error.stack);
        }
      };

      // ƯU TIÊN 1: Tìm sách theo category đã chọn TRƯỚC (QUAN TRỌNG NHẤT)
      if (filters.categories.length > 0) {
        console.log('Ưu tiên 1: Tìm sách theo category đã chọn', filters.categories);
        for (const categoryId of filters.categories.slice(0, 3)) {
          const categoryParams = {
              category_id: categoryId, 
              author_id: undefined,
            publisher_id: undefined,
            query: undefined, // Bỏ query để tìm tất cả sách trong category
            min_price: filters.price[0] > 0 ? filters.price[0] : undefined,
            max_price: filters.price[1] < 500000 ? filters.price[1] : undefined,
            min_rating: filters.minRating > 0 ? filters.minRating : undefined,
            min_year: filters.years[0] > 2000 ? filters.years[0] : undefined,
            max_year: filters.years[1] < new Date().getFullYear() ? filters.years[1] : undefined,
            language: filters.languages.length > 0 ? filters.languages.join(',') : undefined,
            status: filters.status && filters.status !== 'all' ? filters.status : undefined,
            tags: filters.tags.length > 0 ? filters.tags.join(',') : undefined,
            limit: 30, // Tăng limit để có nhiều sách hơn
            sort: 'rating',
            order: 'DESC'
          };
          
          await ensureCount(
            categoryParams,
            t('aiAsk.reasons.category', { name: categoryMap.get(categoryId) || categoryId })
          );
          if (uniqueBooks.size >= MAX_AI_RESULTS) break;
        }
        console.log('Sau khi tìm theo category, có', uniqueBooks.size, 'sách');
      }

      // ƯU TIÊN 2: Tìm sách theo author đã chọn
      if (uniqueBooks.size < MAX_AI_RESULTS && filters.authors.length > 0) {
        console.log('Ưu tiên 2: Tìm sách theo author đã chọn', filters.authors);
        for (const authorId of filters.authors.slice(0, 3)) {
          await ensureCount(
            buildAdvancedParams({ 
              author_id: authorId, 
              category_id: filters.categories.length > 0 ? filters.categories[0] : undefined, // Giữ category nếu có
              limit: 20 
            }),
            t('aiAsk.reasons.author', { name: authorMap.get(authorId) || authorId })
          );
          if (uniqueBooks.size >= MAX_AI_RESULTS) break;
        }
      }

      // ƯU TIÊN 3: Dữ liệu từ hệ thống đề xuất cá nhân hóa (chỉ nếu chưa đủ)
      if (uniqueBooks.size < MAX_AI_RESULTS) {
        try {
          console.log('Ưu tiên 3: Đang lấy recommendation từ API...');
          const recoRes = await recommendationApi.getRecommendedProducts({ limit: 12 });
          console.log('Recommendation response:', recoRes);
          
          if (recoRes?.success && Array.isArray(recoRes.data?.products)) {
            const reason = recoRes.data?.fallback
              ? t('aiAsk.reasons.systemTrend')
              : t('aiAsk.reasons.personalProfile');
            if (recoRes.data?.fallback) {
              isFallback = true;
            }
            console.log('Có', recoRes.data.products.length, 'sách từ recommendation');
            pushBooks(recoRes.data.products, reason);
          } else {
            console.warn('Recommendation không thành công hoặc không có products');
          }
        } catch (error) {
          console.error('Lỗi lấy recommendation:', error);
        }
        console.log('Sau recommendation, có', uniqueBooks.size, 'sách');
      }

      // Fallback: Nếu có category được chọn, vẫn giữ category filter
      if (uniqueBooks.size < MIN_AI_RESULTS) {
        console.log('Chưa đủ sách, thử fallback với filters...');
        const fallbackParams = {
          category_id: filters.categories.length > 0 ? filters.categories[0] : undefined, // GIỮ category nếu có
          min_price: filters.price[0] || undefined,
          max_price: filters.price[1] || undefined,
          min_rating: filters.minRating > 0 ? filters.minRating : undefined,
          status: filters.status || undefined,
          language: filters.languages.length > 0 ? filters.languages.join(',') : undefined,
          limit: 20
        };
        await ensureCount(
          buildAdvancedParams(fallbackParams),
          t('aiAsk.reasons.combinedFilters')
        );
      }

      // Fallback cuối cùng - chỉ khi KHÔNG có category được chọn
      if (uniqueBooks.size < MIN_AI_RESULTS && filters.categories.length === 0) {
        console.log('Vẫn chưa đủ và không có category, thử lấy sách bất kỳ từ getBooks...');
        try {
          const fallbackBooksRes = await bookApi.getBooks({ limit: 20, sort: 'rating', order: 'DESC' });
          console.log('Fallback getBooks response:', fallbackBooksRes);
          
          if (fallbackBooksRes?.success && Array.isArray(fallbackBooksRes.data)) {
            console.log('Có', fallbackBooksRes.data.length, 'sách từ fallback getBooks');
            // Vẫn áp dụng matchesFilters
            const tempBooks = fallbackBooksRes.data.slice(0, 10);
            tempBooks.forEach((book) => {
              const id = book?.book_id || book?.id;
              if (id && !uniqueBooks.has(id) && matchesFilters(book)) {
                uniqueBooks.set(id, book);
                reasons.set(id, new Set([t('aiAsk.reasons.default')]));
              }
            });
            console.log('Sau fallback getBooks, có', uniqueBooks.size, 'sách');
          } else {
            console.warn('Fallback getBooks không thành công hoặc không có data');
          }
        } catch (error) {
          console.error('Lỗi lấy fallback getBooks:', error);
        }
      }

      let finalList = Array.from(uniqueBooks.values())
        .sort((a, b) => Number(b?.rating ?? b?.avg_rating ?? 0) - Number(a?.rating ?? a?.avg_rating ?? 0))
        .slice(0, MAX_AI_RESULTS);

      console.log('Final list có', finalList.length, 'sách');
      console.log('Final list:', finalList.map(b => ({ id: b.book_id || b.id, title: b.title, category: b.category_name || b.category_id })));

      // Nếu vẫn không có sách và CÓ category được chọn, thử tìm lại với category đó
      if (finalList.length === 0 && filters.categories.length > 0) {
        console.warn('Không có sách nào, thử tìm lại với category đã chọn...');
        try {
          const categoryId = filters.categories[0];
          const retryParams = buildAdvancedParams({
            category_id: categoryId,
            author_id: undefined,
            publisher_id: undefined,
            query: undefined,
            limit: 20
          });
          const retryResponse = await searchApi.advancedSearch(retryParams);
          if (retryResponse?.success) {
            const list = Array.isArray(retryResponse.data) ? retryResponse.data : retryResponse.data?.books || [];
            list.forEach((book) => {
              const id = book?.book_id || book?.id;
              if (id && matchesFilters(book)) {
                uniqueBooks.set(id, book);
                reasons.set(id, new Set([t('aiAsk.reasons.category', { name: categoryMap.get(categoryId) || categoryId })]));
              }
            });
            finalList = Array.from(uniqueBooks.values())
              .sort((a, b) => Number(b?.rating ?? b?.avg_rating ?? 0) - Number(a?.rating ?? a?.avg_rating ?? 0))
              .slice(0, MAX_AI_RESULTS);
            console.log('Sau retry với category, có', finalList.length, 'sách');
          }
        } catch (error) {
          console.error('Lỗi retry với category:', error);
        }
      }

      if (finalList.length < MIN_AI_RESULTS) {
        console.warn('Không đủ sách, chỉ có', finalList.length, 'sách (cần tối thiểu', MIN_AI_RESULTS, ')');
        showMessage('aiAsk.messages.fewResults');
      } else {
        const summary = filterSummary || t('aiAsk.messages.currentPreferences');
        const sourceLabel = gatherReasons() || t('aiAsk.reasons.default');
        console.log('Đủ sách, hiển thị summary với', finalList.length, 'sách');
        showMessage('aiAsk.messages.quickSummary', {
          count: finalList.length,
          source: sourceLabel,
          summary
        });
        buildInsights(finalList, { summary, sourceLabel, isFallback });
      }

      setRecommendations(finalList);
      setSelectedBook(finalList[0] || null);
      console.log('Đã set recommendations:', finalList.length, 'sách');
      
      if (!finalList.length) {
        console.warn('Không có sách nào để hiển thị!');
        setInsights([]);
      }
    } catch (error) {
      console.error('AIAsk - Lỗi gợi ý nhanh:', error);
      showMessage('aiAsk.messages.quickError');
      setInsights([]);
      setRecommendations([]);
      setSelectedBook(null);
    } finally {
      setLoadingRecommendations(false);
    }
  }, [
    MAX_AI_RESULTS,
    MIN_AI_RESULTS,
    authorMap,
    buildAdvancedParams,
    buildInsights,
    categoryMap,
    filterSummary,
    filters,
    matchesFilters,
    showMessage,
    t
  ]);

  // Nút "Sách tương tự": dựa trên sách người dùng đang chọn
  // Tìm sách tương tự dựa trên: category, keywords/tags, và từ khóa từ "Gợi ý nhanh"
  const handleSimilarBooks = useCallback(async () => {
    if (!selectedBook) {
      showMessage('aiAsk.messages.selectBookForSimilar');
      return;
    }

    setLoadingRecommendations(true);
    showMessage('aiAsk.messages.similarAnalyzing', { title: selectedBook.title });
    setInsights([]);

    try {
      const uniqueBooks = new Map();

      const pushSimilar = (books = []) => {
        books.forEach((book) => {
          const id = book?.book_id || book?.id;
          if (!id) return;
          // Loại bỏ chính sách đang chọn
          if (id === (selectedBook.book_id || selectedBook.id)) return;
          if (!matchesFilters(book)) return;
          if (!uniqueBooks.has(id)) {
            uniqueBooks.set(id, book);
          }
        });
      };

      // Extract keywords từ title của sách đang chọn
      const extractKeywords = (title) => {
        if (!title) return [];
        // Tách title thành các từ, loại bỏ từ ngắn (< 2 ký tự)
        const words = title.toLowerCase().split(/\s+/).filter(word => word.length >= 2);
        return words;
      };

      const bookKeywords = extractKeywords(selectedBook.title);
      const categoryId = selectedBook.category_id || selectedBook.categoryId;
      const authorId = selectedBook.author_id || selectedBook.authorId;
      const publisherId = selectedBook.publisher_id || selectedBook.publisherId;
      const bookPrice = Number(selectedBook.price || 0);

      // Ưu tiên 1: Tìm sách cùng category (quan trọng nhất)
      if (categoryId) {
        console.log('Tìm sách tương tự - Ưu tiên 1: Cùng category', categoryId);
        const categoryParams = buildAdvancedParams({
          category_id: categoryId,
          author_id: undefined, // Loại bỏ author để tìm sách của tác giả khác
          query: undefined,
          limit: 15
        });
        const categoryResponse = await searchApi.advancedSearch(categoryParams);
        if (categoryResponse?.success) {
          const list = Array.isArray(categoryResponse.data) ? categoryResponse.data : categoryResponse.data?.books || [];
          pushSimilar(list);
          console.log('Tìm thấy', list.length, 'sách cùng category');
        }
      }

      // Ưu tiên 2: Tìm sách cùng author (tác giả)
      if (uniqueBooks.size < MIN_AI_RESULTS && authorId) {
        console.log('Tìm sách tương tự - Ưu tiên 2: Cùng author', authorId);
        const authorParams = buildAdvancedParams({
          author_id: authorId,
          category_id: undefined,
          query: undefined,
          limit: 12
        });
        const authorResponse = await searchApi.advancedSearch(authorParams);
        if (authorResponse?.success) {
          const list = Array.isArray(authorResponse.data) ? authorResponse.data : authorResponse.data?.books || [];
          pushSimilar(list);
          console.log('Tìm thấy', list.length, 'sách cùng author');
        }
      }

      // Ưu tiên 3: Tìm sách cùng publisher (nhà xuất bản)
      if (uniqueBooks.size < MIN_AI_RESULTS && publisherId) {
        console.log('Tìm sách tương tự - Ưu tiên 3: Cùng publisher', publisherId);
        const publisherParams = buildAdvancedParams({
          publisher_id: publisherId,
          category_id: undefined,
          author_id: undefined,
          query: undefined,
          limit: 12
        });
        const publisherResponse = await searchApi.advancedSearch(publisherParams);
        if (publisherResponse?.success) {
          const list = Array.isArray(publisherResponse.data) ? publisherResponse.data : publisherResponse.data?.books || [];
          pushSimilar(list);
          console.log('Tìm thấy', list.length, 'sách cùng publisher');
        }
      }

      // Ưu tiên 4: Tìm sách có giá tương tự (cùng khoảng giá ±20%)
      if (uniqueBooks.size < MIN_AI_RESULTS && bookPrice > 0) {
        console.log('Tìm sách tương tự - Ưu tiên 4: Cùng khoảng giá', bookPrice);
        const priceRange = bookPrice * 0.2; // ±20%
        const minPrice = Math.max(0, bookPrice - priceRange);
        const maxPrice = bookPrice + priceRange;
        const similarPriceParams = buildAdvancedParams({
          min_price: minPrice,
          max_price: maxPrice,
          category_id: undefined,
          author_id: undefined,
          publisher_id: undefined,
          query: undefined,
          limit: 12
        });
        const similarPriceResponse = await searchApi.advancedSearch(similarPriceParams);
        if (similarPriceResponse?.success) {
          const list = Array.isArray(similarPriceResponse.data) ? similarPriceResponse.data : similarPriceResponse.data?.books || [];
          pushSimilar(list);
          console.log('Tìm thấy', list.length, 'sách có giá tương tự (', minPrice, '-', maxPrice, ')');
        }
      }

      // Ưu tiên 5: Tìm sách có cùng keywords/tags (từ title)
      if (uniqueBooks.size < MIN_AI_RESULTS && bookKeywords.length > 0) {
        console.log('Tìm sách tương tự - Ưu tiên 5: Cùng keywords', bookKeywords);
        // Thử với từng keyword quan trọng (từ dài nhất)
        const sortedKeywords = bookKeywords.sort((a, b) => b.length - a.length);
        for (const keyword of sortedKeywords.slice(0, 3)) {
          if (uniqueBooks.size >= MIN_AI_RESULTS * 2) break;
          const keywordParams = buildAdvancedParams({
            query: keyword,
            category_id: undefined,
            author_id: undefined,
            limit: 10
          });
          const keywordResponse = await searchApi.advancedSearch(keywordParams);
          if (keywordResponse?.success) {
            const list = Array.isArray(keywordResponse.data) ? keywordResponse.data : keywordResponse.data?.books || [];
            pushSimilar(list);
            console.log('Tìm thấy', list.length, 'sách với keyword:', keyword);
          }
        }
      }

      // Ưu tiên 6: Tìm sách có cùng từ khóa với "Gợi ý nhanh" (searchTerm)
      if (uniqueBooks.size < MIN_AI_RESULTS && searchTerm && searchTerm.trim()) {
        console.log('Tìm sách tương tự - Ưu tiên 6: Từ khóa từ Gợi ý nhanh', searchTerm);
        const searchTermParams = buildAdvancedParams({
          query: searchTerm.trim(),
          category_id: undefined,
          author_id: undefined,
          limit: 10
        });
        const searchTermResponse = await searchApi.advancedSearch(searchTermParams);
        if (searchTermResponse?.success) {
          const list = Array.isArray(searchTermResponse.data) ? searchTermResponse.data : searchTermResponse.data?.books || [];
          pushSimilar(list);
          console.log('Tìm thấy', list.length, 'sách với từ khóa từ Gợi ý nhanh');
        }
      }

      // Ưu tiên 7: Tìm sách với title tương tự (từng phần của title)
      if (uniqueBooks.size < MIN_AI_RESULTS && selectedBook.title) {
        console.log('Tìm sách tương tự - Ưu tiên 7: Title tương tự');
        const titleParams = buildAdvancedParams({
          query: selectedBook.title,
          category_id: undefined,
          author_id: undefined,
          limit: 10
        });
        const titleResponse = await searchApi.advancedSearch(titleParams);
        if (titleResponse?.success) {
          const list = Array.isArray(titleResponse.data) ? titleResponse.data : titleResponse.data?.books || [];
          pushSimilar(list);
          console.log('Tìm thấy', list.length, 'sách với title tương tự');
        }
      }

      const finalList = Array.from(uniqueBooks.values())
        .sort((a, b) => {
          // Ưu tiên sắp xếp theo độ tương đồng
          const aCategory = (a.category_id || a.categoryId) === categoryId;
          const bCategory = (b.category_id || b.categoryId) === categoryId;
          const aAuthor = (a.author_id || a.authorId) === authorId;
          const bAuthor = (b.author_id || b.authorId) === authorId;
          const aPublisher = (a.publisher_id || a.publisherId) === publisherId;
          const bPublisher = (b.publisher_id || b.publisherId) === publisherId;
          
          // Tính điểm tương đồng
          const aScore = (aCategory ? 3 : 0) + (aAuthor ? 2 : 0) + (aPublisher ? 1 : 0);
          const bScore = (bCategory ? 3 : 0) + (bAuthor ? 2 : 0) + (bPublisher ? 1 : 0);
          
          if (aScore !== bScore) {
            return bScore - aScore; // Sắp xếp theo điểm tương đồng giảm dần
          }
          
          // Nếu điểm tương đồng bằng nhau, sắp xếp theo rating
          return Number(b?.rating ?? b?.avg_rating ?? 0) - Number(a?.rating ?? a?.avg_rating ?? 0);
        })
        .slice(0, MAX_AI_RESULTS);

      console.log('Tổng cộng tìm thấy', finalList.length, 'sách tương tự');

      if (finalList.length >= MIN_AI_RESULTS) {
        setRecommendations(finalList);
        setSelectedBook(finalList[0]);
        showMessage('aiAsk.messages.similarSummary', {
          count: finalList.length,
          title: selectedBook.title
        });
        buildInsights(finalList, {
          summary: t('aiAsk.messages.similarSummaryContext', { title: selectedBook.title }),
          sourceLabel: t('aiAsk.messages.similarSource')
        });
      } else if (finalList.length) {
        setRecommendations(finalList);
        setSelectedBook(finalList[0]);
        showMessage('aiAsk.messages.similarFew', {
          count: finalList.length,
          title: selectedBook.title
        });
        buildInsights(finalList, {
          summary: t('aiAsk.messages.similarSummaryContext', { title: selectedBook.title }),
          sourceLabel: t('aiAsk.messages.similarSource')
        });
      } else {
        setRecommendations([]);
        setSelectedBook(null);
        showMessage('aiAsk.messages.similarNone');
        setInsights([]);
      }
    } catch (error) {
      console.error('AIAsk - Lỗi lấy sách tương tự:', error);
      showMessage('aiAsk.messages.similarError');
      setInsights([]);
      setRecommendations([]);
      setSelectedBook(null);
    } finally {
      setLoadingRecommendations(false);
    }
  }, [
    MIN_AI_RESULTS,
    MAX_AI_RESULTS,
    buildAdvancedParams,
    buildInsights,
    filters,
    matchesFilters,
    searchTerm,
    selectedBook,
    showMessage,
    t
  ]);

  // ♻️ Nút “Làm mới” khôi phục trạng thái ban đầu
  const handleReset = useCallback(() => {
    setFilters(INITIAL_FILTERS(currentYear));
    setRecommendations([]);
    setSelectedBook(null);
    setSearchTerm('');
    showMessage('aiAsk.messages.reset');
    setInsights([]);
  }, [currentYear, showMessage]);

  // 🖱️ Người dùng click vào item gợi ý trong dropdown
  const handleSuggestionClick = useCallback(async (item) => {
    if (!item) return;

    setSearchTerm(item.title);
    setShowSuggestions(false);
    setInsights([]);

    const normalizedId = Number(item.id) || item.id;

    try {
      if (item.type === 'book') {
        const detailRes = await bookApi.getBookById(normalizedId);
        if (detailRes?.success && detailRes.data) {
          setSelectedBook(detailRes.data);
          showMessage('aiAsk.messages.bookSelected', { title: detailRes.data.title });
        } else {
          setSelectedBook({ id: normalizedId, title: item.title });
          showMessage('aiAsk.messages.bookSelectedNoDetail');
        }
      } else if (item.type === 'author') {
        addFilterValue('authors', normalizedId);
        showMessage('aiAsk.messages.authorAdded', { name: item.title });
      } else if (item.type === 'category') {
        addFilterValue('categories', normalizedId);
        showMessage('aiAsk.messages.categoryAdded', { name: item.title });
      } else {
        showMessage('aiAsk.messages.keywordSelected', { keyword: item.title });
      }
    } catch (error) {
      console.error('AIAsk - Lỗi xử lý lựa chọn gợi ý:', error);
      showMessage('aiAsk.messages.suggestionError');
    }
  }, [addFilterValue, showMessage]);

  // 🔖 Hàm tiện ích hiện chip bộ lọc đang áp dụng với nút X để xóa
  const renderOptionChip = (label, value, filterType, filterValue) => {
    const handleRemove = (e) => {
      e.stopPropagation();
      if (filterType === 'categories') {
        toggleMultiOption('categories', filterValue);
      } else if (filterType === 'authors') {
        toggleMultiOption('authors', filterValue);
      } else if (filterType === 'publishers') {
        toggleMultiOption('publishers', filterValue);
      } else if (filterType === 'languages') {
        toggleMultiOption('languages', filterValue);
      } else if (filterType === 'tags') {
        toggleMultiOption('tags', filterValue);
      }
    };

    return (
      <span key={value} className="aiask-chip">
        <span className="aiask-chip-label">{label}</span>
        <button
          type="button"
          className="aiask-chip-remove"
          onClick={handleRemove}
          aria-label={`Xóa ${label}`}
        >
          <i className="bi bi-x" style={{ fontSize: '14px', fontWeight: 'bold' }}></i>
        </button>
      </span>
    );
  };

  return (
    <section className="aiask-container">
      <div className="aiask-card">
        <header className="aiask-header">
          <h1>{t('aiAsk.header.title')}</h1>
          <p className="aiask-subtitle">{t('aiAsk.header.subtitle')}</p>
        </header>

        <form className="aiask-search" onSubmit={handleSubmitSearch}>
          <label htmlFor="aiask-query" className="aiask-label">
            {t('aiAsk.search.label')}
          </label>
          <div className={`aiask-search-wrapper ${showSuggestions ? 'active' : ''}`}>
            <input
              id="aiask-query"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder={t('aiAsk.search.placeholder')}
              className="aiask-search-input"
              autoComplete="off"
            />
            <button type="submit" className="aiask-search-button">
              {t('aiAsk.search.button')}
            </button>
          </div>
          {showSuggestions && (
            <div className="aiask-suggestion-panel">
              <div className="aiask-suggestion-column">
                <div className="aiask-column-title">{t('aiAsk.search.suggestionColumns.queries')}</div>
                {loadingSuggestions && (
                  <div className="aiask-suggestion-empty">{t('aiAsk.search.suggestions.loading')}</div>
                )}
                {!loadingSuggestions && filteredQueries.length === 0 && (
                  <div className="aiask-suggestion-empty">{t('aiAsk.search.suggestions.emptyQueries')}</div>
                )}
                {!loadingSuggestions && filteredQueries.map(query => (
                  <button
                    type="button"
                    key={query}
                    className="aiask-suggestion-item"
                    onClick={() => handleSuggestionClick({ title: query, type: 'query' })}
                  >
                    {query}
                  </button>
                ))}
              </div>

              <div className="aiask-suggestion-column">
                <div className="aiask-column-title">{t('aiAsk.search.suggestionColumns.books')}</div>
                {loadingSuggestions && (
                  <div className="aiask-suggestion-empty">{t('aiAsk.search.suggestions.loading')}</div>
                )}
                {!loadingSuggestions && !suggestions.books.length && (
                  <div className="aiask-suggestion-empty">{t('aiAsk.search.suggestions.emptyBooks')}</div>
                )}
                {!loadingSuggestions && suggestions.books.map(book => (
                  <button
                    type="button"
                    key={`book-${book.id}`}
                    className="aiask-suggestion-item"
                    onClick={() => handleSuggestionClick(book)}
                  >
                    <span className="aiask-suggestion-main">{book.title}</span>
                    {book.subtitle && <span className="aiask-suggestion-sub">{book.subtitle}</span>}
                  </button>
                ))}
              </div>

              <div className="aiask-suggestion-column">
                <div className="aiask-column-title">{t('aiAsk.search.suggestionColumns.others')}</div>
                {loadingSuggestions && (
                  <div className="aiask-suggestion-empty">{t('aiAsk.search.suggestions.loading')}</div>
                )}
                {!loadingSuggestions && !suggestions.authors.length && !suggestions.categories.length && (
                  <div className="aiask-suggestion-empty">{t('aiAsk.search.suggestions.emptyOthers')}</div>
                )}
                {!loadingSuggestions && suggestions.authors.map(author => (
                  <button
                    type="button"
                    key={`author-${author.id}`}
                    className="aiask-suggestion-item"
                    onClick={() => handleSuggestionClick(author)}
                  >
                    <span className="aiask-suggestion-main">{author.title}</span>
                    {author.subtitle && <span className="aiask-suggestion-sub">{author.subtitle}</span>}
                  </button>
                ))}
                {!loadingSuggestions && suggestions.categories.map(category => (
                  <button
                    type="button"
                    key={`category-${category.id}`}
                    className="aiask-suggestion-item"
                    onClick={() => handleSuggestionClick(category)}
                  >
                    <span className="aiask-suggestion-main">{category.title}</span>
                    {category.subtitle && <span className="aiask-suggestion-sub">{category.subtitle}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        <section className="aiask-filters">
          <div className="aiask-filter-row">
            <div className="aiask-filter-control">
              <button type="button" onClick={() => setOpenDropdown(openDropdown === 'categories' ? null : 'categories')}>
                {t('aiAsk.filters.categories')}
              </button>
              {openDropdown === 'categories' && (
                <div className="aiask-dropdown-menu">
                  {metaOptions.categories.map(category => (
                    <label key={category.category_id} className="aiask-option">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.category_id)}
                        onChange={() => toggleMultiOption('categories', category.category_id)}
                      />
                      <span>
                        {category.name}
                        {CATEGORY_SYNONYMS[category.name] && (
                          <small className="aiask-synonym">
                            {t('aiAsk.labels.synonym', {
                              terms: CATEGORY_SYNONYMS[category.name].join(', ')
                            })}
                          </small>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="aiask-filter-control">
              <button type="button" onClick={() => setOpenDropdown(openDropdown === 'authors' ? null : 'authors')}>
                {t('aiAsk.filters.authors')}
              </button>
              {openDropdown === 'authors' && (
                <div className="aiask-dropdown-menu">
                  {metaOptions.authors.map(author => (
                    <label key={author.author_id} className="aiask-option">
                      <input
                        type="checkbox"
                        checked={filters.authors.includes(author.author_id)}
                        onChange={() => toggleMultiOption('authors', author.author_id)}
                      />
                      <span>{author.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="aiask-filter-control">
              <button type="button" onClick={() => setOpenDropdown(openDropdown === 'publishers' ? null : 'publishers')}>
                {t('aiAsk.filters.publishers')}
              </button>
              {openDropdown === 'publishers' && (
                <div className="aiask-dropdown-menu">
                  {metaOptions.publishers.map(publisher => (
                    <label key={publisher.publisher_id} className="aiask-option">
                      <input
                        type="checkbox"
                        checked={filters.publishers.includes(publisher.publisher_id)}
                        onChange={() => toggleMultiOption('publishers', publisher.publisher_id)}
                      />
                      <span>{publisher.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="aiask-filter-control aiask-range">
              <span>{t('aiAsk.filters.price')}</span>
              <div className="aiask-range-inputs">
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="5000"
                  value={filters.price[0]}
                  onChange={(event) => updateFilters('price', [Number(event.target.value), filters.price[1]])}
                />
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="5000"
                  value={filters.price[1]}
                  onChange={(event) => updateFilters('price', [filters.price[0], Number(event.target.value)])}
                />
              </div>
              <div className="aiask-range-values">
                <span>{formatCurrency(filters.price[0])}</span>
                <span>{formatCurrency(filters.price[1])}</span>
              </div>
            </div>

            <div className="aiask-filter-control aiask-range">
              <span>{t('aiAsk.filters.years')}</span>
              <div className="aiask-double-input">
                <input
                  type="number"
                  min="1950"
                  max={currentYear}
                  value={filters.years[0]}
                  onChange={(event) => updateFilters('years', [Number(event.target.value), filters.years[1]])}
                />
                <span className="aiask-range-sep">—</span>
                <input
                  type="number"
                  min="1950"
                  max={currentYear}
                  value={filters.years[1]}
                  onChange={(event) => updateFilters('years', [filters.years[0], Number(event.target.value)])}
                />
              </div>
            </div>
          </div>

          <div className="aiask-filter-row">
            <div className="aiask-filter-control">
              <button type="button" onClick={() => setOpenDropdown(openDropdown === 'languages' ? null : 'languages')}>
                {t('aiAsk.filters.languages')}
              </button>
              {openDropdown === 'languages' && (
                <div className="aiask-dropdown-menu">
                  {languageOptions.map(lang => (
                    <label key={lang.value} className="aiask-option">
                      <input
                        type="checkbox"
                        checked={filters.languages.includes(lang.value)}
                        onChange={() => toggleMultiOption('languages', lang.value)}
                      />
                      <span>{lang.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="aiask-filter-control">
              <button type="button" onClick={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}>
                {t('aiAsk.filters.status')}
              </button>
              {openDropdown === 'status' && (
                <div className="aiask-dropdown-menu single">
                  {statusOptions.map(status => (
                    <label key={status.value} className="aiask-option">
                      <input
                        type="radio"
                        name="aiask-status"
                        checked={filters.status === status.value}
                        onChange={() => updateFilters('status', status.value)}
                      />
                      <span>{status.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="aiask-filter-control aiask-rating">
              <span>{t('aiAsk.filters.minRating')}</span>
              <div className="aiask-rating-input">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(event) => updateFilters('minRating', Number(event.target.value))}
                />
                <span className="aiask-rating-value">
                  {t('aiAsk.filters.ratingValue', { value: filters.minRating.toFixed(1) })}
                </span>
              </div>
            </div>

            <div className="aiask-filter-control">
              <button type="button" onClick={() => setOpenDropdown(openDropdown === 'tags' ? null : 'tags')}>
                {t('aiAsk.filters.tags')}
              </button>
              {openDropdown === 'tags' && (
                <div className="aiask-dropdown-menu">
                  {tagOptions.map(tag => (
                    <label key={tag.value} className="aiask-option">
                      <input
                        type="checkbox"
                        checked={filters.tags.includes(tag.value)}
                        onChange={() => toggleMultiOption('tags', tag.value)}
                      />
                      <span>{tag.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="aiask-active-filters">
            {filters.categories.map(categoryId => {
              const category = metaOptions.categories.find(item => item.category_id === categoryId);
              return category ? renderOptionChip(category.name, `category-${categoryId}`, 'categories', categoryId) : null;
            })}
            {filters.authors.map(authorId => {
              const author = metaOptions.authors.find(item => item.author_id === authorId);
              return author ? renderOptionChip(author.name, `author-${authorId}`, 'authors', authorId) : null;
            })}
            {filters.publishers.map(publisherId => {
              const publisher = metaOptions.publishers.find(item => item.publisher_id === publisherId);
              return publisher ? renderOptionChip(publisher.name, `publisher-${publisherId}`, 'publishers', publisherId) : null;
            })}
            {filters.languages.map(lang => {
              const label = languageLabelMap.get(lang) || lang;
              return renderOptionChip(label, `lang-${lang}`, 'languages', lang);
            })}
            {filters.tags.map(tag => {
              const label = tagLabelMap.get(tag) || tag;
              return renderOptionChip(`#${label}`, `tag-${tag}`, 'tags', tag);
            })}
          </div>
        </section>

        <section className="aiask-actions">
          <button type="button" className="aiask-action" onClick={handleQuickRecommend} disabled={loadingRecommendations}>
            {t('aiAsk.actions.quick')}
          </button>
          <button type="button" className="aiask-action" onClick={handleSimilarBooks} disabled={loadingRecommendations}>
            {t('aiAsk.actions.similar')}
          </button>
          <button type="button" className="aiask-action aiask-secondary" onClick={handleReset}>
            {t('aiAsk.actions.reset')}
          </button>
        </section>

        <section className="aiask-message">
          <p>{message}</p>
          {insights.length > 0 && (
            <ul className="aiask-insights">
              {insights.map((line, index) => (
                <li key={`${line.key}-${index}`}>{t(line.key, line.params)}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="aiask-recommendations">
          {loadingRecommendations && (
            <div className="aiask-loader">{t('aiAsk.recommendations.loading')}</div>
          )}
          {!loadingRecommendations && recommendations.length === 0 && (
            <div className="aiask-placeholder">
              <p>{t('aiAsk.recommendations.empty')}</p>
            </div>
          )}

          {!loadingRecommendations && recommendations.length > 0 && (
            <div className="row g-4">
              {recommendations.map(book => {
                const bookId = book.book_id || book.id;
                const isActive = selectedBook && (selectedBook.book_id || selectedBook.id || selectedBook.product_id) === bookId;

                return (
                  <div key={bookId} className="col-lg-3 col-md-6">
                    <div
                      className={`card h-100 border-0 shadow-sm ${isActive ? 'border-primary' : ''}`}
                      style={{
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        height: '450px',
                        backgroundColor: isActive ? '#f0f7ff' : 'white',
                        border: isActive ? '3px solid #007bff' : '1px solid #e0e0e0',
                        boxShadow: isActive 
                          ? '0 8px 24px rgba(0, 123, 255, 0.25), 0 0 0 1px rgba(0, 123, 255, 0.1)' 
                          : '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onClick={() => setSelectedBook(book)}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                        } else {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 123, 255, 0.3), 0 0 0 1px rgba(0, 123, 255, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        if (isActive) {
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 123, 255, 0.25), 0 0 0 1px rgba(0, 123, 255, 0.1)';
                        } else {
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                        }
                      }}
                    >
                      <div className="position-relative">
                        <img
                          src={book.cover_image || '/images/book1.jpg'}
                          className="card-img-top"
                          alt={book.title}
                          style={{
                            height: '280px',
                            objectFit: 'contain',
                            width: '100%',
                            backgroundColor: '#f8f9fa'
                          }}
                        />
                        {/* Badge - góc trên phải */}
                        <div className="position-absolute top-0 end-0 m-2">
                          <span
                            className="badge"
                            style={{
                              backgroundColor: 'rgba(236, 72, 153, 0.9)',
                              color: '#fff',
                              fontSize: '0.7rem',
                              padding: '4px 10px',
                              borderRadius: '999px',
                              textTransform: 'uppercase'
                            }}
                          >
                            {book.is_new
                              ? t('aiAsk.recommendations.badgeNew')
                              : t('aiAsk.recommendations.badgeSuggested')}
                          </span>
                        </div>
                        {/* Selected Indicator - góc trên trái */}
                        {isActive && (
                          <div className="position-absolute top-0 start-0 m-2">
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#007bff',
                                borderRadius: '50%',
                                boxShadow: '0 2px 8px rgba(0, 123, 255, 0.4)',
                                animation: 'pulse 2s infinite'
                              }}
                            >
                              <i className="bi bi-check-lg text-white" style={{ fontSize: '18px', fontWeight: 'bold' }}></i>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="card-body p-3 d-flex flex-column">
                        <h6 className="card-title fw-bold mb-2" style={{
                          fontSize: '1rem',
                          lineHeight: '1.3',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: '2.6rem'
                        }}>
                          {book.title}
                        </h6>
                        <p className="card-text text-muted small mb-2" style={{ fontSize: '0.85rem' }}>
                          {book.author_name || t('aiAsk.recommendations.authorPlaceholder')}
                        </p>

                        {/* Rating */}
                        <div className="mb-2">
                          <div className="d-flex align-items-center">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`bi bi-star${i < Math.floor(book.rating || book.avg_rating || 0) ? '-fill' : ''} text-warning`}
                                style={{ fontSize: '12px' }}
                              ></i>
                            ))}
                            <span className="text-muted small ms-1" style={{ fontSize: '11px' }}>
                              ({book.review_count ?? book.reviewCount ?? 0})
                            </span>
                          </div>
                        </div>

                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fw-bold text-dark h5 mb-0">
                              {book.price
                                ? formatCurrency(Number(book.price))
                                : t('aiAsk.recommendations.priceContact')}
                            </span>
                            {book.stock > 0 ? (
                              <small className="text-success">
                                <i className="bi bi-check-circle me-1"></i>
                                {t('home.states.inStock')}
                              </small>
                            ) : (
                              <small className="text-danger">
                                <i className="bi bi-x-circle me-1"></i>
                                {t('home.states.outOfStock')}
                              </small>
                            )}
                          </div>
                          {/* Button Xem chi tiết */}
                          <button
                            className="btn btn-outline-primary w-100"
                            style={{
                              fontSize: '14px',
                              padding: '8px 16px',
                              border: '1px solid #007bff',
                              backgroundColor: 'white',
                              color: '#007bff'
                            }}
                            onClick={(event) => {
                              event.stopPropagation();
                              onNavigateTo?.('product', { productId: bookId });
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#007bff';
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'white';
                              e.target.style.color = '#007bff';
                            }}
                          >
                            {t('aiAsk.recommendations.viewDetails')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </section>
  );
};

export default AIAsk;

