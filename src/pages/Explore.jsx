import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDevTo } from '../context/DevToContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Explore = () => {
  const { articles, loading, fetchArticles, fetchArticlesByTag, pagination, fetchTags, tags } = useDevTo();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const popularTags = ['javascript', 'webdev', 'react', 'python', 'beginners', 'tutorial', 'programming', 'css', 'node', 'typescript'];

  useEffect(() => {
    // Check for search param from URL
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSelectedTag(searchFromUrl);
      setSearchQuery(searchFromUrl);
      fetchArticlesByTag(searchFromUrl, 1, 12);
    } else {
      fetchArticles({ page: 1, per_page: 12 });
    }
    fetchTags();
  }, [searchParams]);

  const handleTagFilter = (tag) => {
    setSelectedTag(tag);
    setSearchQuery(tag);
    if (tag) {
      setSearchParams({ search: tag });
      fetchArticlesByTag(tag, 1, 12);
    } else {
      setSearchParams({});
      fetchArticles({ page: 1, per_page: 12 });
    }
  };

  const handleLoadMore = () => {
    if (selectedTag) {
      fetchArticlesByTag(selectedTag, pagination.currentPage + 1, 12);
    } else {
      fetchArticles({ page: pagination.currentPage + 1, per_page: 12 });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const tag = searchQuery.trim().toLowerCase();
      setSelectedTag(tag);
      setSearchParams({ search: tag });
      fetchArticlesByTag(tag, 1, 12);
    }
  };

  const clearSearch = () => {
    setSelectedTag('');
    setSearchQuery('');
    setSearchParams({});
    fetchArticles({ page: 1, per_page: 12 });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore DEV Community
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Discover amazing articles from developers around the world
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by tag (e.g., javascript, react, python)"
                className="w-full py-4 px-6 pr-14 rounded-2xl text-gray-800 bg-white shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Tags Section */}
      <section className="py-4 bg-white border-b shadow-sm sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button
              onClick={() => clearSearch()}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                !selectedTag
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagFilter(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedTag === tag
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {selectedTag && (
            <div className="mb-6 flex items-center gap-2 flex-wrap">
              <span className="text-gray-500">Showing results for:</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
                #{selectedTag}
              </span>
              <button
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {loading && articles.length === 0 ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No articles found</h3>
              <p className="text-gray-500">Try searching with a different tag</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/devto/${article.id}`}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    {/* Cover Image */}
                    <div className="relative h-48 bg-linear-to-br from-indigo-100 to-purple-100 overflow-hidden">
                      {article.cover_image || article.social_image ? (
                        <img
                          src={article.cover_image || article.social_image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      {/* DEV.to Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-black text-white text-xs font-bold rounded">
                          DEV
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.tag_list?.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {article.title}
                      </h3>

                      <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                        {article.description}
                      </p>

                      {/* Author & Stats */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <img
                            src={article.user?.profile_image || `https://ui-avatars.com/api/?name=${article.user?.name}`}
                            alt={article.user?.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{article.user?.name}</p>
                            <p className="text-xs text-gray-400">{formatDate(article.published_at)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {article.public_reactions_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            {article.comments_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More */}
              {pagination.hasMore && (
                <div className="text-center mt-10">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Articles
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA for non-authenticated users */}
      {!isAuthenticated && (
        <section className="py-16 px-6 bg-linear-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Want to share your own stories?</h2>
            <p className="text-indigo-100 mb-8">
              Create an account to write your own blog posts and interact with the community
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Explore;
