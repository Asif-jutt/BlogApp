import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import LoadingSpinner from '../components/LoadingSpinner';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBlog, fetchBlogById, likeBlog, deleteBlog, loading } = useBlog();
  const { user, isAuthenticated } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBlogById(id);
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await likeBlog(id);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const result = await deleteBlog(id);
    if (result.success) {
      navigate('/blogs');
    }
    setDeleting(false);
    setShowDeleteModal(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology: 'bg-blue-100 text-blue-700',
      Lifestyle: 'bg-pink-100 text-pink-700',
      Travel: 'bg-green-100 text-green-700',
      Food: 'bg-orange-100 text-orange-700',
      Health: 'bg-red-100 text-red-700',
      Business: 'bg-purple-100 text-purple-700',
      Entertainment: 'bg-yellow-100 text-yellow-700',
      Sports: 'bg-indigo-100 text-indigo-700',
      Other: 'bg-gray-100 text-gray-700'
    };
    return colors[category] || colors.Other;
  };

  if (loading || !currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isOwner = user?._id === currentBlog.author?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative">
        {currentBlog.coverImage ? (
          <div className="h-100 relative">
            <img
              src={currentBlog.coverImage}
              alt={currentBlog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
          </div>
        ) : (
          <div className="h-75 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500"></div>
        )}
      </section>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Category & Actions */}
            <div className="flex items-center justify-between mb-6">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getCategoryColor(currentBlog.category)}`}>
                {currentBlog.category}
              </span>
              
              {isOwner && (
                <div className="flex items-center gap-2">
                  <Link
                    to={`/edit/${currentBlog._id}`}
                    className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {currentBlog.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-between pb-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-semibold">
                  {currentBlog.author?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{currentBlog.author?.username}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(currentBlog.createdAt)} · {currentBlog.views} views
                  </p>
                </div>
              </div>

              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  currentBlog.isLiked
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <svg className={`w-5 h-5 ${currentBlog.isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{currentBlog.likeCount || 0}</span>
              </button>
            </div>

            {/* Content */}
            <div className="py-8 prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {currentBlog.content}
              </div>
            </div>

            {/* Tags */}
            {currentBlog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                {currentBlog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Comments Section */}
            <CommentSection blogId={id} />
          </div>
        </div>
      </article>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-fadeIn">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Blog?</h3>
            <p className="text-gray-500 text-center mb-6">
              This action cannot be undone. This blog and all its comments will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="h-20"></div>
    </div>
  );
};

export default BlogDetail;
