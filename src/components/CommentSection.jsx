import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentAPI } from '../services/api';

const CommentSection = ({ blogId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentAPI.getByBlog(blogId);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await commentAPI.create(blogId, { content: newComment });
      setComments([response.data.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      const response = await commentAPI.create(blogId, { 
        content: replyContent, 
        parentComment: parentId 
      });
      
      setComments(comments.map(comment => 
        comment._id === parentId 
          ? { ...comment, replies: [...(comment.replies || []), response.data.comment] }
          : comment
      ));
      setReplyTo(null);
      setReplyContent('');
    } catch (error) {
      console.error('Failed to add reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e, commentId) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    try {
      await commentAPI.update(commentId, { content: editContent });
      
      setComments(comments.map(comment => {
        if (comment._id === commentId) {
          return { ...comment, content: editContent };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply._id === commentId ? { ...reply, content: editContent } : reply
            )
          };
        }
        return comment;
      }));
      
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async (commentId, isReply = false, parentId = null) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentAPI.delete(commentId);
      
      if (isReply && parentId) {
        setComments(comments.map(comment => 
          comment._id === parentId 
            ? { ...comment, replies: comment.replies.filter(r => r._id !== commentId) }
            : comment
        ));
      } else {
        setComments(comments.filter(c => c._id !== commentId));
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleLike = async (commentId) => {
    if (!isAuthenticated) return;

    try {
      const response = await commentAPI.like(commentId);
      
      setComments(comments.map(comment => {
        if (comment._id === commentId) {
          return { ...comment, isLiked: response.data.isLiked, likes: Array(response.data.likeCount).fill('') };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply._id === commentId 
                ? { ...reply, isLiked: response.data.isLiked, likes: Array(response.data.likeCount).fill('') }
                : reply
            )
          };
        }
        return comment;
      }));
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return commentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CommentItem = ({ comment, isReply = false, parentId = null }) => (
    <div className={`${isReply ? 'ml-12 mt-4' : ''}`}>
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
          {comment.author?.username?.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1">
          <div className="bg-gray-50 rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-sm">{comment.author?.username}</span>
                <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
              </div>
              
              {user?._id === comment.author?._id && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingId(comment._id);
                      setEditContent(comment.content);
                    }}
                    className="text-gray-400 hover:text-indigo-600 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(comment._id, isReply, parentId)}
                    className="text-gray-400 hover:text-red-600 text-xs"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            
            {editingId === comment._id ? (
              <form onSubmit={(e) => handleEdit(e, comment._id)} className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                  rows="2"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditContent('');
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-700 text-sm">{comment.content}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2 ml-2">
            <button
              onClick={() => handleLike(comment._id)}
              className={`flex items-center gap-1 text-xs transition-colors ${
                comment.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              } ${!isAuthenticated ? 'cursor-default' : ''}`}
              disabled={!isAuthenticated}
            >
              <svg className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {comment.likes?.length || 0}
            </button>
            
            {!isReply && isAuthenticated && (
              <button
                onClick={() => {
                  setReplyTo(replyTo === comment._id ? null : comment._id);
                  setReplyContent('');
                }}
                className="text-xs text-gray-400 hover:text-indigo-600 font-medium"
              >
                Reply
              </button>
            )}
          </div>

          {/* Reply Form */}
          {replyTo === comment._id && (
            <form onSubmit={(e) => handleReply(e, comment._id)} className="mt-3 ml-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                rows="2"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={submitting || !replyContent.trim()}
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  Reply
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent('');
                  }}
                  className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Replies */}
          {comment.replies?.map((reply) => (
            <CommentItem key={reply._id} comment={reply} isReply parentId={comment._id} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                rows="3"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="px-5 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-600 text-sm">
            <a href="/login" className="text-indigo-600 font-medium hover:underline">Sign in</a> to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
