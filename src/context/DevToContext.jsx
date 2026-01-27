import React, { createContext, useContext, useState, useCallback } from 'react';
import { devtoAPI } from '../services/devtoApi';

const DevToContext = createContext(null);

export const useDevTo = () => {
  const context = useContext(DevToContext);
  if (!context) {
    throw new Error('useDevTo must be used within a DevToProvider');
  }
  return context;
};

export const DevToProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasMore: true
  });
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);

  const fetchArticles = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await devtoAPI.getArticles({
        page: params.page || 1,
        per_page: params.per_page || 12,
        tag: params.tag,
        state: params.state || 'rising'
      });

      const newArticles = response.data;
      
      if (params.page === 1 || !params.page) {
        setArticles(newArticles);
      } else {
        setArticles(prev => [...prev, ...newArticles]);
      }

      setPagination({
        currentPage: params.page || 1,
        hasMore: newArticles.length >= (params.per_page || 12)
      });

      return newArticles;
    } catch (err) {
      setError(err.message || 'Failed to fetch articles');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLatestArticles = useCallback(async (page = 1, perPage = 12) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await devtoAPI.getLatestArticles(page, perPage);
      const newArticles = response.data;

      if (page === 1) {
        setArticles(newArticles);
      } else {
        setArticles(prev => [...prev, ...newArticles]);
      }

      setPagination({
        currentPage: page,
        hasMore: newArticles.length >= perPage
      });

      return newArticles;
    } catch (err) {
      setError(err.message || 'Failed to fetch latest articles');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArticleById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await devtoAPI.getArticleById(id);
      setCurrentArticle(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch article');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchArticlesByTag = async (tag, page = 1, perPage = 12) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await devtoAPI.getArticlesByTag(tag, page, perPage);
      const newArticles = response.data;

      if (page === 1) {
        setArticles(newArticles);
      } else {
        setArticles(prev => [...prev, ...newArticles]);
      }

      setPagination({
        currentPage: page,
        hasMore: newArticles.length >= perPage
      });

      return newArticles;
    } catch (err) {
      setError(err.message || 'Failed to fetch articles by tag');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await devtoAPI.getTags(1, 20);
      setTags(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch tags:', err);
      return [];
    }
  };

  const fetchComments = async (articleId) => {
    try {
      const response = await devtoAPI.getComments(articleId);
      setComments(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch comments:', err);
      return [];
    }
  };

  const searchArticles = async (query, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await devtoAPI.searchArticles(query, page, 12);
      const newArticles = response.data;

      if (page === 1) {
        setArticles(newArticles);
      } else {
        setArticles(prev => [...prev, ...newArticles]);
      }

      setPagination({
        currentPage: page,
        hasMore: newArticles.length >= 12
      });

      return newArticles;
    } catch (err) {
      setError(err.message || 'Failed to search articles');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const value = {
    articles,
    currentArticle,
    loading,
    error,
    pagination,
    tags,
    comments,
    fetchArticles,
    fetchLatestArticles,
    fetchArticleById,
    fetchArticlesByTag,
    fetchTags,
    fetchComments,
    searchArticles,
    setCurrentArticle
  };

  return (
    <DevToContext.Provider value={value}>
      {children}
    </DevToContext.Provider>
  );
};

export default DevToContext;
