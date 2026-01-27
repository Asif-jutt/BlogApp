import React, { createContext, useContext, useState, useCallback } from 'react';
import { blogAPI } from '../services/api';

const BlogContext = createContext(null);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasMore: false
  });
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: 'All',
    search: '',
    sortBy: 'createdAt',
    order: 'desc'
  });

  const fetchBlogs = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 9,
        ...(filters.category !== 'All' && { category: filters.category }),
        ...(filters.search && { search: filters.search }),
        sortBy: filters.sortBy,
        order: filters.order,
        ...params
      };

      const response = await blogAPI.getAll(queryParams);
      
      if (params.page === 1 || !params.page) {
        setBlogs(response.data.blogs);
      } else {
        setBlogs(prev => [...prev, ...response.data.blogs]);
      }
      
      setPagination(response.data.pagination);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
      return null;
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchBlogById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getById(id);
      setCurrentBlog(response.data.blog);
      return response.data.blog;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch blog');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (blogData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.create(blogData);
      setBlogs(prev => [response.data.blog, ...prev]);
      return { success: true, blog: response.data.blog, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create blog';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id, blogData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.update(id, blogData);
      setBlogs(prev => prev.map(blog => 
        blog._id === id ? response.data.blog : blog
      ));
      setCurrentBlog(response.data.blog);
      return { success: true, blog: response.data.blog, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update blog';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await blogAPI.delete(id);
      setBlogs(prev => prev.filter(blog => blog._id !== id));
      return { success: true, message: 'Blog deleted successfully' };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete blog';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const likeBlog = async (id) => {
    try {
      const response = await blogAPI.like(id);
      
      // Update in blogs list
      setBlogs(prev => prev.map(blog => 
        blog._id === id 
          ? { ...blog, isLiked: response.data.isLiked, likeCount: response.data.likeCount }
          : blog
      ));
      
      // Update current blog if viewing
      if (currentBlog?._id === id) {
        setCurrentBlog(prev => ({
          ...prev,
          isLiked: response.data.isLiked,
          likeCount: response.data.likeCount
        }));
      }
      
      return response.data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to like blog' };
    }
  };

  const fetchUserBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogAPI.getMyBlogs();
      setBlogs(response.data.blogs || []);
      return response.data.blogs;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your blogs');
      setBlogs([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogAPI.getCategories();
      setCategories(response.data.categories);
      return response.data.categories;
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      return [];
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const value = {
    blogs,
    currentBlog,
    loading,
    error,
    pagination,
    categories,
    filters,
    fetchBlogs,
    fetchBlogById,
    fetchUserBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    fetchCategories,
    updateFilters,
    setError,
    setCurrentBlog
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};

export default BlogContext;
