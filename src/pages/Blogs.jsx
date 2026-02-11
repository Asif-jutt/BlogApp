import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { blogs, loading, pagination, fetchBlogs, filters, updateFilters } = useBlog();
  const [searchInput, setSearchInput] = useState('');

  const categoryFromUrl = searchParams.get('category');

  useEffect(() => {
    if (categoryFromUrl) {
      updateFilters({ category: categoryFromUrl });
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    fetchBlogs({ page: 1 });
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const handleCategoryChange = (category) => {
    updateFilters({ category });
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const handleLoadMore = () => {
    fetchBlogs({ page: pagination.currentPage + 1 });
  };

  const categories = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Entertainment', 'Sports', 'Other'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Blogs</h1>
          <p className="text-gray-500 mb-8">Discover stories, ideas, and expertise from our community</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search blogs..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filters */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filters.category === category
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            {pagination.totalBlogs} {pagination.totalBlogs === 1 ? 'blog' : 'blogs'} found
          </p>
          <select
            value={`${filters.sortBy}-${filters.order}`}
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split('-');
              updateFilters({ sortBy, order });
            }}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="views-desc">Most Viewed</option>
            <option value="title-asc">Title A-Z</option>
          </select>
        </div>

        {/* Blogs Grid */}
        {loading && blogs.length === 0 ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 text-gray-200 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No blogs found</h3>
            <p className="text-gray-500">
              {filters.search 
                ? `No results for "${filters.search}"` 
                : filters.category !== 'All'
                  ? `No blogs in ${filters.category} category`
                  : 'No blogs available yet'}
            </p>
            {(filters.search || filters.category !== 'All') && (
              <button
                onClick={() => {
                  setSearchInput('');
                  updateFilters({ search: '', category: 'All' });
                  setSearchParams({});
                }}
                className="mt-4 px-6 py-2 text-indigo-600 font-medium hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
              {blogs.map((blog) => (
                <div key={blog._id} className="w-full max-w-sm">
                  <BlogCard blog={blog} />
                </div>
              ))}
            </div>

            {/* Load More */}
            {pagination.hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 border-2 border-indigo-200 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-all disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Blogs;
