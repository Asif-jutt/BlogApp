import axios from 'axios';

const DEVTO_API = 'https://dev.to/api';

const devtoApi = axios.create({
  baseURL: DEVTO_API,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const devtoAPI = {
  // Get all articles with optional filters
  getArticles: (params = {}) => {
    return devtoApi.get('/articles', {
      params: {
        per_page: params.per_page || 12,
        page: params.page || 1,
        tag: params.tag || undefined,
        username: params.username || undefined,
        state: params.state || 'rising',
        top: params.top || undefined
      }
    });
  },

  // Get latest articles
  getLatestArticles: (page = 1, perPage = 12) => {
    return devtoApi.get('/articles/latest', {
      params: { page, per_page: perPage }
    });
  },

  // Get single article by ID
  getArticleById: (id) => {
    return devtoApi.get(`/articles/${id}`);
  },

  // Get articles by tag
  getArticlesByTag: (tag, page = 1, perPage = 12) => {
    return devtoApi.get('/articles', {
      params: { tag, page, per_page: perPage }
    });
  },

  // Search articles
  searchArticles: (query, page = 1, perPage = 12) => {
    return devtoApi.get('/articles', {
      params: { 
        per_page: perPage, 
        page,
        tag: query // DEV.to uses tags for searching
      }
    });
  },

  // Get comments for an article
  getComments: (articleId) => {
    return devtoApi.get(`/comments`, {
      params: { a_id: articleId }
    });
  },

  // Get popular tags
  getTags: (page = 1, perPage = 10) => {
    return devtoApi.get('/tags', {
      params: { page, per_page: perPage }
    });
  }
};

export default devtoApi;
