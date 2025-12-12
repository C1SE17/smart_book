import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const BlogPage = ({ onNavigateTo }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAuthor, setSelectedAuthor] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const blogPosts = t('blog.posts', { returnObjects: true }) || [];
  const categories = t('blog.filters.categories', { returnObjects: true }) || {};
  const authors = t('blog.filters.authors', { returnObjects: true }) || {};
  const sortOptions = t('blog.filters.sort', { returnObjects: true }) || {};
  const categoryColors = t('blog.categoryColors', { returnObjects: true }) || {};

  const handleBackToHome = () => {
    onNavigateTo('home');
  };

  const handleBlogClick = (blogId) => {
    // Tạo một handler mới để navigate đến blog detail
    const navigateToBlogDetail = (id) => {
      onNavigateTo('blog-detail')(id);
    };
    navigateToBlogDetail(blogId);
  };

  const getCategoryColor = (categoryKey) =>
    categoryColors[categoryKey] || categoryColors.default || '#6c757d';

  const normalizedPosts = blogPosts.map((post) => ({
    ...post,
    categoryLabel: categories[post.categoryKey] || post.categoryKey,
    authorLabel: authors[post.authorKey] || post.authorKey
  }));

  const filteredPosts = normalizedPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.categoryKey === selectedCategory;
    const matchesAuthor =
      selectedAuthor === 'all' || post.authorKey === selectedAuthor;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query.length === 0 ||
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      (post.tags || []).some((tag) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesAuthor && matchesSearch;
  });

  const postsToSort = [...filteredPosts];
  if (sortBy === 'oldest') {
    postsToSort.reverse();
  }
  const sortedPosts = postsToSort;

  const featuredPost = sortedPosts[0];
  const otherPosts = sortedPosts.slice(1);

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container py-5">
        {/* Breadcrumb */}
        <div className="mb-4">
          <button
            className="btn btn-link text-dark p-0 no-hover"
            onClick={handleBackToHome}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '16px',
              textDecoration: 'none',
              boxShadow: 'none',
              fontWeight: '500'
            }}
          >
            <i className="fas fa-arrow-left me-2"></i>
            {t('blog.breadcrumb.home')}/
            <span className="fw-bold ms-1" style={{ fontSize: '16px' }}> {t('blog.breadcrumb.blog')}</span>
          </button>
        </div>

        <h1 className="text-center mb-4" style={{ fontSize: '2.8rem', fontWeight: '700', color: '#343a40' }}>
          {t('blog.title')}
        </h1>
        <p className="text-center text-muted mb-5" style={{ fontSize: '1.1rem' }}>
          {t('blog.subtitle')}
        </p>

        {/* Search and Filter Bar */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="bg-white rounded-3 p-4 shadow-sm border">
              <div className="row align-items-center">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="position-relative">
                    <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                    <input
                      type="text"
                      className="form-control ps-5"
                      placeholder={t('blog.searchPlaceholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row g-2">
                    <div className="col-4">
                      <select 
                        className="form-select" 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}
                      >
                        {Object.entries(categories).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-4">
                      <select 
                        className="form-select" 
                        value={selectedAuthor}
                        onChange={(e) => setSelectedAuthor(e.target.value)}
                        style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}
                      >
                        {Object.entries(authors).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-4">
                      <select 
                        className="form-select" 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ border: '1px solid #e9ecef', borderRadius: '8px' }}
                      >
                        {Object.entries(sortOptions).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {sortedPosts.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-newspaper fa-3x text-muted mb-3"></i>
            <p className="text-muted mb-0">
              {blogPosts.length === 0
                ? t('blog.messages.noPosts')
                : t('blog.messages.noResults')}
            </p>
          </div>
        ) : (
        <>
        {/* Featured Blog Post */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-lg">
              <div className="row g-0">
                <div className="col-md-6">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="img-fluid h-100"
                    style={{ objectFit: 'cover', minHeight: '300px' }}
                  />
                </div>
                <div className="col-md-6">
                  <div className="card-body p-5">
                    <span 
                      className="badge mb-3"
                      style={{ 
                        backgroundColor: getCategoryColor(featuredPost.categoryKey),
                        color: 'white',
                        fontSize: '0.8rem',
                        padding: '6px 12px'
                      }}
                    >
                      {featuredPost.categoryLabel}
                    </span>
                    <h3 className="card-title fw-bold mb-3" style={{ fontSize: '1.5rem' }}>
                      {featuredPost.title}
                    </h3>
                    <p className="card-text text-muted mb-4" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                      {featuredPost.excerpt}
                    </p>
                    <div className="mb-3">
                      {featuredPost.tags.map((tag, index) => (
                        <span key={index} className="badge bg-light text-dark me-2 mb-2" style={{ fontSize: '0.75rem' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <div className="fw-bold text-dark">{featuredPost.authorLabel}</div>
                        <div className="text-muted small">{featuredPost.date}</div>
                      </div>
                      <div className="ms-auto">
                        <i className="fas fa-clock me-1 text-muted"></i>
                        <span className="text-muted small">{featuredPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Blog Posts */}
        <div className="row mb-5">
          <div className="col-12">
            <h4 className="fw-bold text-dark mb-4">
              <i className="fas fa-square text-primary me-2" style={{ fontSize: '0.8rem' }}></i>
              {t('blog.sections.otherPosts')}
            </h4>
            <div className="row g-4">
              {otherPosts.map((post) => (
                <div key={post.id} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => handleBlogClick(post.id)}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body p-4">
                      <span 
                        className="badge mb-3"
                        style={{ 
                          backgroundColor: getCategoryColor(post.categoryKey),
                          color: 'white',
                          fontSize: '0.7rem',
                          padding: '4px 8px'
                        }}
                      >
                        {post.categoryLabel}
                      </span>
                      <h5 className="card-title fw-bold mb-3" style={{ fontSize: '1.1rem' }}>
                        {post.title}
                      </h5>
                      <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {post.excerpt}
                      </p>
                      <div className="d-flex align-items-center mb-3">
                        <div className="me-3">
                          <div className="fw-bold text-dark small">{post.authorLabel}</div>
                          <div className="text-muted small">{post.date}</div>
                        </div>
                        <div className="ms-auto">
                          <i className="fas fa-clock me-1 text-muted"></i>
                          <span className="text-muted small">{post.readTime}</span>
                        </div>
                      </div>
                      <div>
                        {post.tags.map((tag, index) => (
                          <span key={index} className="badge bg-light text-dark me-1 mb-1" style={{ fontSize: '0.7rem' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;