import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDevTo } from '../context/DevToContext';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';
import LoadingSpinner from '../components/LoadingSpinner';

const DevToArticle = () => {
  const { id } = useParams();
  const { currentArticle, loading, fetchArticleById, fetchComments, comments } = useDevTo();
  const { user, isAuthenticated } = useAuth();
  const [localComments, setLocalComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);

  useEffect(() => {
    if (id) {
      fetchArticleById(id);
      fetchComments(id);
    }
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    const comment = {
      id: Date.now(),
      content: newComment,
      author: {
        username: user.username,
        avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.username}`
      },
      createdAt: new Date().toISOString(),
      isLocal: true
    };

    setLocalComments([comment, ...localComments]);
    setNewComment('');
  };

  const handleLike = () => {
    if (!isAuthenticated) return;
    setIsLiked(!isLiked);
    setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or couldn't be loaded.</p>
          <Link to="/explore" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      {currentArticle.cover_image && (
        <div className="relative h-64 md:h-96 bg-gray-200">
          <img
            src={currentArticle.cover_image}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        </div>
      )}

      <article className="max-w-4xl mx-auto px-6 py-8 -mt-20 relative z-10">
        {/* Article Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            {/* Source Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-black text-white text-sm font-bold rounded-lg">
                DEV.to
              </span>
              <a
                href={currentArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View on DEV.to
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {currentArticle.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {currentArticle.tags?.split(', ').map((tag) => (
                <Link
                  key={tag}
                  to={`/explore?tag=${tag}`}
                  className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm hover:bg-indigo-100 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-6 border-t border-b border-gray-100">
              <div className="flex items-center gap-4">
                <img
                  src={currentArticle.user?.profile_image}
                  alt={currentArticle.user?.name}
                  className="w-14 h-14 rounded-full ring-4 ring-indigo-50"
                />
                <div>
                  <p className="font-semibold text-gray-900">{currentArticle.user?.name}</p>
                  <p className="text-sm text-gray-500">@{currentArticle.user?.username}</p>
                  <p className="text-sm text-gray-400">{formatDate(currentArticle.published_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Like Button */}
                <button
                  onClick={handleLike}
                  disabled={!isAuthenticated}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isLiked
                      ? 'bg-red-50 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } ${!isAuthenticated && 'opacity-50 cursor-not-allowed'}`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isLiked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="font-medium">
                    {(currentArticle.public_reactions_count || 0) + localLikes}
                  </span>
                </button>

                {/* Reading Time */}
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{currentArticle.reading_time_minutes || 5} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-indigo-600 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: currentArticle.body_html }}
          />
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Comments
            <span className="text-lg text-gray-400">
              ({(currentArticle.comments_count || 0) + localComments.length})
            </span>
          </h2>

          {/* Add Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <div className="flex gap-4">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`}
                  alt={user.username}
                  className="w-10 h-10 rounded-full shrink-0"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl text-center">
              <p className="text-gray-600 mb-4">Sign in to join the conversation</p>
              <Link
                to="/login"
                className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Local Comments */}
          {localComments.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Your comments
              </p>
              {localComments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 bg-green-50 rounded-xl mb-4">
                  <img
                    src={comment.author.avatar}
                    alt={comment.author.username}
                    className="w-10 h-10 rounded-full shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{comment.author.username}</span>
                      <span className="text-sm text-gray-400">{formatDate(comment.createdAt)}</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                        Just now
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DEV.to Comments */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black text-white text-xs rounded">DEV</span>
                Comments from DEV.to
              </p>
              {comments.map((comment) => (
                <div key={comment.id_code} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                  <img
                    src={comment.user?.profile_image || `https://ui-avatars.com/api/?name=${comment.user?.name}`}
                    alt={comment.user?.name}
                    className="w-10 h-10 rounded-full shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900">{comment.user?.name}</span>
                      <span className="text-sm text-gray-400">{formatDate(comment.created_at)}</span>
                    </div>
                    <div
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: comment.body_html }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            localComments.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )
          )}
        </div>

        {/* Back to Explore */}
        <div className="mt-8 text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Explore
          </Link>
        </div>
      </article>
    </div>
  );
};

export default DevToArticle;
