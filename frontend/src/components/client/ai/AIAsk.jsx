import React, { useState, useEffect, useMemo, useCallback } from 'react';
import searchApi from '../../../services/searchApi';
import categoryApi from '../../../services/categoryApi';
import authorApi from '../../../services/authorApi';
import publisherApi from '../../../services/publisherApi';
import recommendationApi from '../../../services/recommendationApi';
import bookApi from '../../../services/bookApi';
import './AIAsk.css';

// 📘 Thành phần AIAsk: màn hình “AI Ask” giúp người dùng tìm sách thông minh bằng cách kết hợp bộ lọc + dữ liệu hành vi từ backend.

// 🎯 Bộ giá trị mặc định cho các bộ lọc nhanh
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

// 🌍 Danh sách ngôn ngữ phổ biến
const LANG_OPTIONS = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'Tiếng Anh' },
  { value: 'jp', label: 'Tiếng Nhật' },
  { value: 'cn', label: 'Tiếng Trung' },
  { value: 'kr', label: 'Tiếng Hàn' },
  { value: 'fr', label: 'Tiếng Pháp' }
];

// 📦 Tình trạng hàng hóa hiển thị dạng radio
const STATUS_OPTIONS = [
  { value: 'in_stock', label: 'Còn hàng' },
  { value: 'preorder', label: 'Đặt trước' },
  { value: 'out_of_stock', label: 'Hết hàng' }
];

// 🏷️ Bộ thẻ gợi ý để lọc nhanh theo chủ đề
const TAG_LIBRARY = [
  'mới phát hành',
  'bán chạy',
  'giải thưởng',
  'thiếu nhi',
  'chuyển thể phim',
  'self-help',
  'light novel',
  'classic'
];

// 🔄 Từ điển đồng nghĩa (ví dụ: kiếm hiệp ↔ wuxia)
const CATEGORY_SYNONYMS = {
  'Kiếm hiệp': ['Wuxia', 'Võ hiệp'],
  Wuxia: ['Kiếm hiệp'],
  'Light novel': ['LN']
};

const AIAsk = ({ onNavigateTo, onSearch }) => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
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
  const [message, setMessage] = useState('Hãy nhập từ khóa hoặc chọn bộ lọc để AI gợi ý sách phù hợp.');
  const [insights, setInsights] = useState([]); // 📝 Ghi chú phân tích gợi ý để hiển thị cho người dùng

  const MIN_AI_RESULTS = 3;
  const MAX_AI_RESULTS = 5;

  // 🔍 Chuẩn hóa dữ liệu danh mục/tác giả/NXB để tra cứu nhanh theo id
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
        if (!categoriesRes?.success) warnings.push('danh mục');

        const authors = authorsRes?.success ? authorsRes.data || [] : [];
        if (!authorsRes?.success) warnings.push('tác giả');

        const publishers = publishersRes?.success ? publishersRes.data || [] : [];
        if (!publishersRes?.success) warnings.push('nhà phát hành');

        setMetaOptions({ categories, authors, publishers });

        setPopularKeywords(keywordsRes?.success ? keywordsRes.data || [] : []);

        if (warnings.length) {
          setMessage(`Không tải được dữ liệu ${warnings.join(', ')}. Một số bộ lọc có thể thiếu thông tin.`);
        }
      } catch (error) {
        console.error('AIAsk - Lỗi tải metadata bộ lọc:', error);
        setMessage('Không thể tải dữ liệu bộ lọc. Vui lòng thử lại sau ít phút.');
      }
    };

    fetchMeta();
  }, []);

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
        setMessage('Không thể tải gợi ý tức thời, hãy nhập lại từ khóa khác.');
      } finally {
        setLoadingSuggestions(false);
      }
    }, 320);

    return () => clearTimeout(debounce);
  }, [searchTerm]);

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
      if (names.length) parts.push(`thể loại ${names.join(', ')}`);
    }

    if (filters.authors.length) {
      const names = filters.authors.map(id => authorMap.get(id)).filter(Boolean);
      if (names.length) parts.push(`tác giả ${names.join(', ')}`);
    }

    if (filters.publishers.length) {
      const names = filters.publishers.map(id => publisherMap.get(id)).filter(Boolean);
      if (names.length) parts.push(`NXB ${names.join(', ')}`);
    }

    const [minPrice, maxPrice] = filters.price;
    if (minPrice > 0 || maxPrice < 500000) {
      parts.push(`khoảng giá ${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')} ₫`);
    }

    const [minYear, maxYear] = filters.years;
    if (minYear !== 2000 || maxYear !== currentYear) {
      parts.push(`năm xuất bản ${minYear} - ${maxYear}`);
    }

    if (filters.languages.length) {
      const langs = filters.languages.map(code => LANG_OPTIONS.find(opt => opt.value === code)?.label || code);
      parts.push(`ngôn ngữ ${langs.join(', ')}`);
    }

    if (filters.tags.length) {
      parts.push(`tags ${filters.tags.map(tag => `#${tag}`).join(', ')}`);
    }

    if (filters.minRating > 0) {
      parts.push(`điểm đánh giá tối thiểu ${filters.minRating.toFixed(1)}`);
    }

    return parts.join(', ');
  }, [authorMap, categoryMap, currentYear, filters, publisherMap]);

  // 🧾 Sinh danh sách insight để hiển thị dưới phần thông điệp của AI
  const buildInsights = useCallback((books, { summary, sourceLabel, isFallback } = {}) => {
    const lines = [];

    if (summary) {
      lines.push(`Bộ lọc ưu tiên: ${summary}.`);
    }

    if (sourceLabel) {
      lines.push(`Nguồn dữ liệu: ${sourceLabel}${isFallback ? ' (sử dụng fallback xu hướng)' : ''}.`);
    }

    if (books && books.length) {
      const ratingValues = books
        .map(item => Number(item.rating || item.avg_rating || 0))
        .filter(value => value > 0);

      if (ratingValues.length) {
        const avgRating = ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length;
        lines.push(`Điểm đánh giá trung bình của nhóm đề xuất ≈ ${avgRating.toFixed(1)}/5.`);
      }

      const priceValues = books
        .map(item => Number(item.price))
        .filter(value => !Number.isNaN(value) && value > 0);

      if (priceValues.length) {
        const minPrice = Math.min(...priceValues);
        const maxPrice = Math.max(...priceValues);
        lines.push(`Khoảng giá gợi ý ~ ${minPrice.toLocaleString('vi-VN')} - ${maxPrice.toLocaleString('vi-VN')} ₫.`);
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
          lines.push(`Danh mục nổi bật nhất: ${categoryName}.`);
        }
      }
    }

    setInsights(lines);
  }, [categoryMap]);

  // 🔍 Kiểm tra một cuốn sách có đáp ứng bộ lọc hiện tại hay không
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

    if (filters.categories.length && (!categoryId || !filters.categories.includes(categoryId))) {
      return false;
    }

    if (filters.authors.length && (!authorId || !filters.authors.includes(authorId))) {
      return false;
    }

    if (filters.publishers.length && (!publisherId || !filters.publishers.includes(publisherId))) {
      return false;
    }

    if (filters.minRating > 0 && ratingValue && ratingValue < filters.minRating) {
      return false;
    }

    return true;
  }, [filters]);

  const handleSubmitSearch = useCallback((event) => {
    event.preventDefault();
    if (!searchTerm.trim()) {
      setMessage('Bạn hãy nhập từ khóa để tìm kiếm hoặc thử Gợi ý nhanh nhé!');
      return;
    }
    setShowSuggestions(false);
    onSearch?.(searchTerm.trim());
    onNavigateTo?.('search', { searchQuery: searchTerm.trim(), q: searchTerm.trim() });
    setMessage(`Đang mở trang tìm kiếm cho “${searchTerm.trim()}”...`);
    setInsights([]);
  }, [onNavigateTo, onSearch, searchTerm]);

  // ⚙️ Chuẩn hóa tham số gửi xuống API tìm kiếm nâng cao
  const buildAdvancedParams = useCallback((overrides = {}) => {
    const [minPrice, maxPrice] = filters.price;
    const [minYear, maxYear] = filters.years;

    const singleCategory = filters.categories.length === 1 ? filters.categories[0] : undefined;
    const singleAuthor = filters.authors.length === 1 ? filters.authors[0] : undefined;
    const singlePublisher = filters.publishers.length === 1 ? filters.publishers[0] : undefined;

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
    setMessage('AI đang phân tích dữ liệu của bạn...');
    setInsights([]);

    const uniqueBooks = new Map();
    const reasons = new Map();

    const pushBooks = (books = [], reason) => {
      books.forEach((book) => {
        const id = book?.book_id || book?.id;
        if (!id) return;
        if (!matchesFilters(book)) return;
        if (!uniqueBooks.has(id)) {
          uniqueBooks.set(id, book);
          reasons.set(id, new Set());
        }
        if (reason) {
          reasons.get(id)?.add(reason);
        }
      });
    };

    const gatherReasons = () => {
      const all = new Set();
      reasons.forEach((set) => set.forEach((label) => all.add(label)));
      return all.size ? Array.from(all).join(', ') : undefined;
    };

    try {
      let isFallback = false;

      // 1. Dữ liệu từ hệ thống đề xuất cá nhân hóa
      try {
        const recoRes = await recommendationApi.getRecommendedProducts({ limit: 12 });
        if (recoRes?.success && Array.isArray(recoRes.data?.products)) {
          const reason = recoRes.data?.fallback ? 'Xu hướng toàn hệ thống' : 'Hồ sơ đọc cá nhân';
          if (recoRes.data?.fallback) {
            isFallback = true;
          }
          pushBooks(recoRes.data.products, reason);
        }
      } catch (error) {
        console.warn('AIAsk - lỗi lấy recommendation:', error);
      }

      const ensureCount = async (fetchParams, reasonLabel) => {
        if (uniqueBooks.size >= MAX_AI_RESULTS) return;
        try {
          const response = await searchApi.advancedSearch(fetchParams);
          if (response?.success) {
            const list = Array.isArray(response.data) ? response.data : response.data?.books || [];
            pushBooks(list, reasonLabel);
          }
        } catch (error) {
          console.warn('AIAsk - lỗi advancedSearch:', error);
        }
      };

      // 2. Nếu chưa đủ, lấy theo từng thể loại và tác giả đã chọn
      if (uniqueBooks.size < MAX_AI_RESULTS) {
        for (const categoryId of filters.categories.slice(0, 3)) {
          await ensureCount(buildAdvancedParams({ category_id: categoryId, author_id: undefined, limit: 10 }), `Thể loại ${categoryMap.get(categoryId) || categoryId}`);
          if (uniqueBooks.size >= MAX_AI_RESULTS) break;
        }
      }

      if (uniqueBooks.size < MAX_AI_RESULTS) {
        for (const authorId of filters.authors.slice(0, 3)) {
          await ensureCount(buildAdvancedParams({ author_id: authorId, category_id: undefined, limit: 10 }), `Tác giả ${authorMap.get(authorId) || authorId}`);
          if (uniqueBooks.size >= MAX_AI_RESULTS) break;
        }
      }

      // 3. Fallback tổng quát nếu vẫn thiếu
      if (uniqueBooks.size < MIN_AI_RESULTS) {
        await ensureCount(buildAdvancedParams({ limit: 12 }), 'Bộ lọc tổng hợp');
      }

      let finalList = Array.from(uniqueBooks.values())
        .sort((a, b) => Number(b?.rating ?? b?.avg_rating ?? 0) - Number(a?.rating ?? a?.avg_rating ?? 0))
        .slice(0, MAX_AI_RESULTS);

      if (finalList.length < MIN_AI_RESULTS) {
        setMessage('AI chỉ tìm được một vài tựa sách phù hợp. Bạn có thể nới lỏng bộ lọc để có thêm lựa chọn.');
      } else {
        const summary = filterSummary || 'sở thích hiện tại';
        const sourceLabel = gatherReasons() || 'Hệ thống đề xuất';
        setMessage(`AI đã tổng hợp ${finalList.length} gợi ý dựa trên ${sourceLabel}, tập trung vào ${summary}.`);
        buildInsights(finalList, { summary, sourceLabel, isFallback });
      }

      setRecommendations(finalList);
      setSelectedBook(finalList[0] || null);
      if (!finalList.length) {
        setInsights([]);
      }
    } catch (error) {
      console.error('AIAsk - Lỗi gợi ý nhanh:', error);
      setMessage('Có lỗi khi gợi ý nhanh. Bạn vui lòng thử lại hoặc làm mới trang.');
      setInsights([]);
      setRecommendations([]);
      setSelectedBook(null);
    } finally {
      setLoadingRecommendations(false);
    }
  }, [MAX_AI_RESULTS, MIN_AI_RESULTS, authorMap, buildAdvancedParams, buildInsights, categoryMap, filterSummary, filters, matchesFilters]);

  // 🔄 Nút “Sách tương tự”: dựa trên sách người dùng đang chọn
  const handleSimilarBooks = useCallback(async () => {
    if (!selectedBook) {
      setMessage('Hãy chọn một cuốn sách từ danh sách gợi ý (bấm vào card) trước khi xem sách tương tự.');
      return;
    }

    setLoadingRecommendations(true);
    setMessage(`AI đang phân tích “${selectedBook.title}” để tìm sách tương tự...`);
    setInsights([]);

    try {
      const uniqueBooks = new Map();

      const pushSimilar = (books = []) => {
        books.forEach((book) => {
          const id = book?.book_id || book?.id;
          if (!id) return;
          if (!matchesFilters(book)) return;
          if (!uniqueBooks.has(id)) {
            uniqueBooks.set(id, book);
          }
        });
      };

      const paramsBase = {
        query: selectedBook.title,
        author_id: selectedBook.author_id || selectedBook.authorId || undefined,
        category_id: selectedBook.category_id || selectedBook.categoryId || undefined,
        min_rating: Math.max(filters.minRating || 0, Number(selectedBook.rating || selectedBook.avg_rating || 0)) || undefined,
        limit: 12
      };

      const tryFetch = async (overrideParams) => {
        const response = await searchApi.advancedSearch(buildAdvancedParams({ ...paramsBase, ...overrideParams }));
        if (response?.success) {
          const list = Array.isArray(response.data) ? response.data : response.data?.books || [];
          pushSimilar(list);
        }
      };

      await tryFetch({});

      if (uniqueBooks.size < MIN_AI_RESULTS) {
        await tryFetch({ category_id: selectedBook.category_id || selectedBook.categoryId || undefined, author_id: undefined });
      }

      if (uniqueBooks.size < MIN_AI_RESULTS) {
        await tryFetch({ author_id: selectedBook.author_id || selectedBook.authorId || undefined, category_id: undefined });
      }

      const finalList = Array.from(uniqueBooks.values()).slice(0, MAX_AI_RESULTS);

      if (finalList.length >= MIN_AI_RESULTS) {
        setRecommendations(finalList);
        setSelectedBook(finalList[0]);
        setMessage(`AI tìm thấy ${finalList.length} tựa sách có chủ đề gần với “${selectedBook.title}”.`);
        buildInsights(finalList, {
          summary: `chủ đề tương đồng với “${selectedBook.title}”`,
          sourceLabel: 'phân tích metadata & hành vi đọc tương tự'
        });
      } else if (finalList.length) {
        setRecommendations(finalList);
        setSelectedBook(finalList[0]);
        setMessage(`Chỉ tìm được ${finalList.length} sách tương tự cho “${selectedBook.title}”. Bạn hãy mở rộng bộ lọc nhé!`);
        buildInsights(finalList, {
          summary: `chủ đề tương đồng với “${selectedBook.title}”`,
          sourceLabel: 'phân tích metadata & hành vi đọc tương tự'
        });
      } else {
        setRecommendations([]);
        setSelectedBook(null);
        setMessage('Chưa có sách tương tự, bạn hãy thử đổi từ khóa hoặc chọn bộ lọc khác nhé!');
        setInsights([]);
      }
    } catch (error) {
      console.error('AIAsk - Lỗi lấy sách tương tự:', error);
      setMessage('Có lỗi khi lấy sách tương tự. Bạn hãy thử lại sau!');
      setInsights([]);
      setRecommendations([]);
      setSelectedBook(null);
    } finally {
      setLoadingRecommendations(false);
    }
  }, [MIN_AI_RESULTS, MAX_AI_RESULTS, buildAdvancedParams, buildInsights, filters.minRating, matchesFilters, selectedBook]);

  // ♻️ Nút “Làm mới” khôi phục trạng thái ban đầu
  const handleReset = useCallback(() => {
    setFilters(INITIAL_FILTERS(currentYear));
    setRecommendations([]);
    setSelectedBook(null);
    setSearchTerm('');
    setMessage('Bộ lọc đã được làm mới. Hãy nhập từ khóa mới để AI gợi ý.');
    setInsights([]);
  }, [currentYear]);

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
          setMessage(`Đã chọn sách “${detailRes.data.title}”. Bấm “Sách tương tự” để xem thêm gợi ý liên quan.`);
        } else {
          setSelectedBook({ id: normalizedId, title: item.title });
          setMessage('Không lấy được chi tiết sách, nhưng bạn vẫn có thể bấm “Sách tương tự”.');
        }
      } else if (item.type === 'author') {
        addFilterValue('authors', normalizedId);
        setMessage(`Đã thêm tác giả ${item.title} vào bộ lọc.`);
      } else if (item.type === 'category') {
        addFilterValue('categories', normalizedId);
        setMessage(`Đã thêm thể loại ${item.title} vào bộ lọc. Nhấn “Gợi ý nhanh” để cập nhật danh sách.`);
      } else {
        setMessage(`Đã chọn từ khóa “${item.title}”. Bạn có thể bấm nút Tìm hoặc Gợi ý nhanh.`);
      }
    } catch (error) {
      console.error('AIAsk - Lỗi xử lý lựa chọn gợi ý:', error);
      setMessage('Không xử lý được lựa chọn này, hãy thử nhấp lại hoặc chọn mục khác.');
    }
  }, [addFilterValue]);

  // 🔖 Hàm tiện ích hiện chip bộ lọc đang áp dụng
  const renderOptionChip = (label, value) => (
    <span key={value} className="aiask-chip">
      {label}
    </span>
  );

  return (
    <section className="aiask-container">
      <div className="aiask-card">
        <header className="aiask-header">
          <h1>📚 AI Gợi ý Sách thông minh</h1>
          <p className="aiask-subtitle">Nhập từ khóa, chọn bộ lọc và để AI đề xuất những cuốn sách hợp với bạn nhất.</p>
        </header>

        <form className="aiask-search" onSubmit={handleSubmitSearch}>
          <label htmlFor="aiask-query" className="aiask-label">Bạn muốn tìm sách gì?</label>
          <div className={`aiask-search-wrapper ${showSuggestions ? 'active' : ''}`}>
            <input
              id="aiask-query"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Tìm theo tên sách, tác giả, chủ đề..."
              className="aiask-search-input"
              autoComplete="off"
            />
            <button type="submit" className="aiask-search-button">Tìm</button>
          </div>
          {showSuggestions && (
            <div className="aiask-suggestion-panel">
              <div className="aiask-suggestion-column">
                <div className="aiask-column-title">Queries</div>
                {loadingSuggestions && <div className="aiask-suggestion-empty">Đang tải...</div>}
                {!loadingSuggestions && filteredQueries.length === 0 && (
                  <div className="aiask-suggestion-empty">Không có gợi ý</div>
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
                <div className="aiask-column-title">Books</div>
                {loadingSuggestions && <div className="aiask-suggestion-empty">Đang tải...</div>}
                {!loadingSuggestions && !suggestions.books.length && (
                  <div className="aiask-suggestion-empty">Chưa có sách trùng khớp</div>
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
                <div className="aiask-column-title">Authors/Categories</div>
                {loadingSuggestions && <div className="aiask-suggestion-empty">Đang tải...</div>}
                {!loadingSuggestions && !suggestions.authors.length && !suggestions.categories.length && (
                  <div className="aiask-suggestion-empty">Chưa có gợi ý thêm</div>
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
                Thể loại
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
                          <small className="aiask-synonym"> (aka {CATEGORY_SYNONYMS[category.name].join(', ')})</small>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="aiask-filter-control">
              <button type="button" onClick={() => setOpenDropdown(openDropdown === 'authors' ? null : 'authors')}>
                Tác giả
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
                NXB / Nhà phát hành
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
              <span>Khoảng giá</span>
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
                <span>{filters.price[0].toLocaleString('vi-VN')} ₫</span>
                <span>{filters.price[1].toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>

            <div className="aiask-filter-control aiask-range">
              <span>Năm xuất bản</span>
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
                Ngôn ngữ
              </button>
              {openDropdown === 'languages' && (
                <div className="aiask-dropdown-menu">
                  {LANG_OPTIONS.map(lang => (
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
                Tình trạng
              </button>
              {openDropdown === 'status' && (
                <div className="aiask-dropdown-menu single">
                  {STATUS_OPTIONS.map(status => (
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
              <span>Đánh giá tối thiểu</span>
              <div className="aiask-rating-input">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filters.minRating}
                  onChange={(event) => updateFilters('minRating', Number(event.target.value))}
                />
                <span className="aiask-rating-value">⭐ ≥ {filters.minRating.toFixed(1)}</span>
              </div>
            </div>

            <div className="aiask-filter-control">
              <button type="button" onClick={() => setOpenDropdown(openDropdown === 'tags' ? null : 'tags')}>
                Tags/Keywords
              </button>
              {openDropdown === 'tags' && (
                <div className="aiask-dropdown-menu">
                  {TAG_LIBRARY.map(tag => (
                    <label key={tag} className="aiask-option">
                      <input
                        type="checkbox"
                        checked={filters.tags.includes(tag)}
                        onChange={() => toggleMultiOption('tags', tag)}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="aiask-active-filters">
            {filters.categories.map(categoryId => {
              const category = metaOptions.categories.find(item => item.category_id === categoryId);
              return category ? renderOptionChip(category.name, `category-${categoryId}`) : null;
            })}
            {filters.authors.map(authorId => {
              const author = metaOptions.authors.find(item => item.author_id === authorId);
              return author ? renderOptionChip(author.name, `author-${authorId}`) : null;
            })}
            {filters.publishers.map(publisherId => {
              const publisher = metaOptions.publishers.find(item => item.publisher_id === publisherId);
              return publisher ? renderOptionChip(publisher.name, `publisher-${publisherId}`) : null;
            })}
            {filters.languages.map(lang => {
              const label = LANG_OPTIONS.find(item => item.value === lang)?.label || lang;
              return renderOptionChip(label, `lang-${lang}`);
            })}
            {filters.tags.map(tag => renderOptionChip(`#${tag}`, `tag-${tag}`))}
          </div>
        </section>

        <section className="aiask-actions">
          <button type="button" className="aiask-action" onClick={handleQuickRecommend} disabled={loadingRecommendations}>
            Gợi ý nhanh
          </button>
          <button type="button" className="aiask-action" onClick={handleSimilarBooks} disabled={loadingRecommendations}>
            Sách tương tự
          </button>
          <button type="button" className="aiask-action aiask-secondary" onClick={handleReset}>
            Làm mới
          </button>
        </section>

        <section className="aiask-message">
          <p>{message}</p>
          {insights.length > 0 && (
            <ul className="aiask-insights">
              {insights.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          )}
        </section>

        <section className="aiask-recommendations">
          {loadingRecommendations && <div className="aiask-loader">Đang phân tích dữ liệu...</div>}
          {!loadingRecommendations && recommendations.length === 0 && (
            <div className="aiask-placeholder">
              <p>Chưa có dữ liệu hiển thị. Hãy thử “Gợi ý nhanh” để AI bắt đầu nhé!</p>
            </div>
          )}

          {!loadingRecommendations && recommendations.length > 0 && (
            <div className="aiask-grid">
              {recommendations.map(book => {
                const bookId = book.book_id || book.id;
                const isActive = selectedBook && (selectedBook.book_id || selectedBook.id || selectedBook.product_id) === bookId;

                return (
                  <div
                    key={bookId}
                    className={`aiask-book-card ${isActive ? 'is-selected' : ''}`}
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="aiask-book-cover">
                    {book.cover_image ? (
                      <img src={book.cover_image} alt={book.title} />
                    ) : (
                      <div className="aiask-placeholder-cover">No Image</div>
                    )}
                      <span className="aiask-badge">{book.is_new ? 'Mới' : 'Đề xuất'}</span>
                    </div>
                    <div className="aiask-book-info">
                      <h3>{book.title}</h3>
                      <p className="aiask-book-author">{book.author_name || 'Đang cập nhật'}</p>
                      <p className="aiask-book-price">{book.price ? `${Number(book.price).toLocaleString('vi-VN')} ₫` : 'Liên hệ'}</p>
                      <div className="aiask-book-meta">
                        {book.rating && <span>⭐ {Number(book.rating).toFixed(1)}</span>}
                        {book.category_name && <span>{book.category_name}</span>}
                      </div>
                      <button
                        type="button"
                        className="aiask-view-button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onNavigateTo?.('product', { productId: bookId });
                        }}
                      >
                        Xem chi tiết
                      </button>
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

