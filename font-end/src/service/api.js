import axios from 'axios'
const API_BASE = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});


api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
export const authApi = {
  register: async (name, email, password) =>
   await api.post('/auth/signup', { name, email, password })
  .then(response => response.data)
  .catch(error => {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }),

  login: async (email, password) =>
   await api.post('/auth/signin', { email, password })
  .then(response => response.data)
  .catch(error => {
    throw new Error(error.response?.data?.message || 'Login failed');
  }),

  logout: async () => await api.post('/auth/logout'),

  me: async () => await api.get('/auth/me'),
};

export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/product/${id}`),
  getByCategory: (categoryId) => api.get(`/products?category=${categoryId}`),
};
