import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';

const BlogCard = ({ blog }) => {
  const { isAuthenticated } = useAuth();
  const { likeBlog } = useBlog();

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    await likeBlog(blog._id);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <Link to={`/blog/${blog._id}`} className="group block h-full">
      <article className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100/50 h-full flex flex-col transform hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative h-52 bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-20 h-20 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Category Badge */}
          <span className={`absolute top-4 left-4 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg ${getCategoryColor(blog.category)}`}>
            {blog.category}
          </span>

          {/* Stats Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="bg-white/95 backdrop-blur-sm text-red-500 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {blog.likeCount || blog.likes?.length || 0}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col grow">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 grow leading-relaxed">
            {blog.excerpt || blog.content.substring(0, 150)}
          </p>

          {/* Author & Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-indigo-100 shadow-md">
                {blog.author?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{blog.author?.username}</p>
                <p className="text-xs text-gray-400">{formatDate(blog.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400">
              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-300 ${
                  blog.isLiked ? 'text-red-500 scale-110' : 'hover:text-red-500 hover:scale-110'
                } ${!isAuthenticated ? 'cursor-default' : ''}`}
                disabled={!isAuthenticated}
              >
                <svg className={`w-5 h-5 ${blog.isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Comment Count */}
              <span className="flex items-center gap-1.5 text-sm font-medium hover:text-indigo-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{blog.commentCount || 0}</span>
              </span>

              {/* Views */}
              <span className="flex items-center gap-1.5 text-sm font-medium hover:text-indigo-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{blog.views || 0}</span>
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
