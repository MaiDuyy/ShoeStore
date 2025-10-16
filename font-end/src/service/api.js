import axios from 'axios'
const API_BASE = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  withCredentials: true
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access-token');
    if (token) {
      config.headers['x-access-token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
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

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (item) => api.post('/cart/add', item),
  updateCartItem: (item) => api.put('/cart/update', item),
  removeFromCart: (productId, size, color) => api.delete(`/cart/remove/${productId}`, { params: { size, color } }),
  clearCart: () => api.delete('/cart/clear'),
};

export const orderApi = {
  createOrder: (orderData) => api.post('/orders/create', orderData),
  getUserOrders: () => api.get('/orders/my-orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};
