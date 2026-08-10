import api from './axiosInstance';

// ─── Auth ───────────────────────────────────────────────────
export const register = (data) =>
  api.post('/api/auth/register', data);

export const login = (data) =>
  api.post('/api/auth/login', data);

// ─── Blog Posts ─────────────────────────────────────────────
export const getAllBlogs = () =>
  api.get('/api/blogposts');

// Fetch only the authenticated user's own blogs
export const getMyBlogs = () =>
  api.get('/api/blogposts/my');

export const getBlogById = (id) =>
  api.get(`/api/blogposts/${id}`);

/**
 * @param {{ title: string, content: string, imageUrl?: string, categoryId: string }} data
 */
export const createBlog = (data) =>
  api.post('/api/blogposts', data);

/**
 * @param {string} id
 * @param {{ title: string, content: string, imageUrl?: string, isPublished: boolean, categoryId: string }} data
 */
export const updateBlog = (id, data) =>
  api.put(`/api/blogposts/${id}`, data);

export const deleteBlog = (id) =>
  api.delete(`/api/blogposts/${id}`);

// ─── Categories ─────────────────────────────────────────────
export const getCategories = () =>
  api.get('/api/category');

export const createCategory = (data) =>
  api.post('/api/category', data);
