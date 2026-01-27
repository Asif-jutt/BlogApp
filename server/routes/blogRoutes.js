import express from 'express';
import Blog from '../models/Blog.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blogs with filters
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      author,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { status: 'published' };

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by author
    if (author) {
      query.author = author;
    }

    // Search in title, content, tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const blogs = await Blog.find(query)
      .populate('author', 'username avatar')
      .populate('commentCount')
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.json({
      success: true,
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBlogs: total,
        hasMore: page * limit < total
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/blogs/categories
// @desc    Get all categories with counts
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      categories: categories.map(c => ({ name: c._id, count: c.count }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('commentCount');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    // Check if user has liked
    const isLiked = req.user ? blog.likes.includes(req.user._id) : false;

    res.json({
      success: true,
      blog: {
        ...blog.toObject(),
        isLiked,
        likeCount: blog.likes.length
      }
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/blogs
// @desc    Create a blog
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, category, tags, status } = req.body;

    const blog = await Blog.create({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      coverImage,
      category,
      tags: tags || [],
      status: status || 'published',
      author: req.user._id
    });

    await blog.populate('author', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully!',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog'
      });
    }

    const { title, content, excerpt, coverImage, category, tags, status } = req.body;

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, excerpt, coverImage, category, tags, status },
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');

    res.json({
      success: true,
      message: 'Blog updated successfully!',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog'
      });
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: 'Blog deleted successfully!'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/blogs/:id/like
// @desc    Like/Unlike a blog
// @access  Private
router.put('/:id/like', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const userId = req.user._id;
    const likeIndex = blog.likes.indexOf(userId);

    if (likeIndex === -1) {
      // Like
      blog.likes.push(userId);
    } else {
      // Unlike
      blog.likes.splice(likeIndex, 1);
    }

    await blog.save();

    res.json({
      success: true,
      isLiked: likeIndex === -1,
      likeCount: blog.likes.length,
      message: likeIndex === -1 ? 'Blog liked!' : 'Blog unliked!'
    });
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/blogs/user/my-blogs
// @desc    Get current user's blogs
// @access  Private
router.get('/user/my-blogs', protect, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .populate('author', 'username avatar')
      .populate('commentCount')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      blogs
    });
  } catch (error) {
    console.error('Get my blogs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
