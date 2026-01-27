import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CreateBlog = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { createBlog, updateBlog, fetchBlogById, currentBlog, loading } = useBlog();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    category: 'Technology',
    tags: '',
    status: 'published'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Entertainment', 'Sports', 'Other'];

  useEffect(() => {
    if (isEditing) {
      fetchBlogById(id);
    }
  }, [id, isEditing]);

  useEffect(() => {
    if (isEditing && currentBlog) {
      setFormData({
        title: currentBlog.title || '',
        content: currentBlog.content || '',
        excerpt: currentBlog.excerpt || '',
        coverImage: currentBlog.coverImage || '',
        category: currentBlog.category || 'Technology',
        tags: currentBlog.tags?.join(', ') || '',
        status: currentBlog.status || 'published'
      });
    }
  }, [currentBlog, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validation
    if (formData.content.length < 50) {
      setError('Content must be at least 50 characters');
      setSubmitting(false);
      return;
    }

    const blogData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      excerpt: formData.excerpt || formData.content.substring(0, 150) + '...'
    };

    let result;
    if (isEditing) {
      result = await updateBlog(id, blogData);
    } else {
      result = await createBlog(blogData);
    }

    if (result.success) {
      navigate(`/blog/${result.blog._id}`);
    } else {
      setError(result.message);
    }
    setSubmitting(false);
  };

  if (isEditing && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Blog' : 'Create New Blog'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isEditing ? 'Update your blog post' : 'Share your thoughts with the world'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg"
              required
              maxLength={100}
            />
            <p className="text-xs text-gray-400 text-right">{formData.title.length}/100</p>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Cover Image URL
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
            {formData.coverImage && (
              <div className="mt-3 rounded-xl overflow-hidden h-48 bg-gray-100">
                <img
                  src={formData.coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="A brief summary of your blog (optional)"
              rows="2"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              maxLength={200}
            />
            <p className="text-xs text-gray-400 text-right">{formData.excerpt.length}/200</p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content here... (minimum 50 characters)"
              rows="12"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
              required
              minLength={50}
            />
            <p className="text-xs text-gray-400 text-right">{formData.content.length} characters</p>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Tags
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, javascript, webdev (comma separated)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  {isEditing ? 'Updating...' : 'Publishing...'}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  {isEditing ? 'Update Blog' : 'Publish Blog'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
