import express from 'express';
import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/comments/:blogId
// @desc    Get comments for a blog
// @access  Public
router.get('/:blogId', optionalAuth, async (req, res) => {
  try {
    const comments = await Comment.find({ 
      blog: req.params.blogId,
      parentComment: null 
    })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id })
          .populate('author', 'username avatar')
          .sort({ createdAt: 1 });
        
        return {
          ...comment.toObject(),
          replies,
          isLiked: req.user ? comment.likes.includes(req.user._id) : false
        };
      })
    );

    res.json({
      success: true,
      comments: commentsWithReplies,
      total: comments.length
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/comments/:blogId
// @desc    Add a comment
// @access  Private
router.post('/:blogId', protect, async (req, res) => {
  try {
    const { content, parentComment } = req.body;

    // Check if blog exists
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // If replying, check if parent comment exists
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (!parent) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found'
        });
      }
    }

    const comment = await Comment.create({
      content,
      author: req.user._id,
      blog: req.params.blogId,
      parentComment: parentComment || null
    });

    await comment.populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added!',
      comment: {
        ...comment.toObject(),
        replies: [],
        isLiked: false
      }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/comments/:id
// @desc    Update a comment
// @access  Private (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment.content = req.body.content;
    await comment.save();
    await comment.populate('author', 'username avatar');

    res.json({
      success: true,
      message: 'Comment updated!',
      comment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check ownership
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    // Delete replies too
    await Comment.deleteMany({ parentComment: comment._id });
    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted!'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/comments/:id/like
// @desc    Like/Unlike a comment
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const userId = req.user._id;
    const likeIndex = comment.likes.indexOf(userId);

    if (likeIndex === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();

    res.json({
      success: true,
      isLiked: likeIndex === -1,
      likeCount: comment.likes.length
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
