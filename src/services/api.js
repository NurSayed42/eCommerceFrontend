import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8085';

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor — attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, Promise.reject);

// Response interceptor — 401 এবং 403 দুটোই handle করো
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // 401 বা 403 — token expired হতে পারে, refresh করার চেষ্টা করো
    if ((status === 401 || status === 403) && !original._retry) {
      original._retry = true;
      try {
        const refresh = localStorage.getItem('refreshToken');
        if (refresh) {
          const { data } = await axios.post(
            `${BASE_URL}/api/v1/auth/refresh-token`,
            null,
            { params: { token: refresh } }
          );
          const newToken = data.data.accessToken;
          localStorage.setItem('accessToken', newToken);
          localStorage.setItem('refreshToken', data.data.refreshToken);
          // user object ও update করো
          const storedUser = localStorage.getItem('user');
          if (storedUser && storedUser !== 'undefined') {
            try {
              const u = JSON.parse(storedUser);
              u.accessToken = newToken;
              localStorage.setItem('user', JSON.stringify(u));
            } catch { /* ignore */ }
          }
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
      } catch {
        // refresh ও fail করলে logout
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    const msg = error.response?.data?.message || 'Something went wrong';
    if (status !== 401 && status !== 403) toast.error(msg);
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register:      (data) => api.post('/auth/register', data),
  verifyOtp:     (data) => api.post('/auth/verify-otp', data),
  login:         (data) => api.post('/auth/login', data),

  googleLogin:          (idToken)     => api.post('/auth/google', { idToken }),
  sendVerificationOtp:  (identifier)  => api.post('/auth/send-verification-otp', null, { params: { identifier } }),

  
  refreshToken:  (token) => api.post('/auth/refresh-token', null, { params: { token } }),
  forgotPassword:(id) => api.post('/auth/forgot-password', null, { params: { identifier: id } }),
  resetPassword: (id, otp, pass) => api.post('/auth/reset-password', null, { params: { identifier: id, otp, newPassword: pass } }),
};

export const productAPI = {
  search:       (params) => api.get('/products', { params }),
  getById:      (id)     => api.get(`/products/${id}`),
  getBySlug:    (slug)   => api.get(`/products/slug/${slug}`),
  getFeatured:  ()       => api.get('/products/featured'),
  getFlashSale: ()       => api.get('/products/flash-sale'),
  getTrending:  ()       => api.get('/products/trending'),
  getTopSelling:(limit)  => api.get('/products/top-selling', { params: { limit } }),
};

export const categoryAPI = {
  getAll:      ()   => api.get('/categories'),
  getSubs:     (id) => api.get(`/categories/${id}/subcategories`),
  getFeatured: ()   => api.get('/categories/featured'),
};

export const bannerAPI = {
  get: (position = 'HOME_HERO') => api.get('/banners', { params: { position } }),
};

export const cartAPI = {
  get:          ()                          => api.get('/cart'),
  add:          (productId, variantId, qty) => api.post('/cart/add', null, { params: { productId, variantId, quantity: qty } }),
  update:       (itemId, quantity)          => api.put(`/cart/items/${itemId}`, null, { params: { quantity } }),
  remove:       (itemId)                    => api.delete(`/cart/items/${itemId}`),
  saveForLater: (itemId)                    => api.post(`/cart/items/${itemId}/save-for-later`),
};

export const orderAPI = {
  place:         (data)       => api.post('/orders', data),
  getMyOrders:   (page = 0)   => api.get('/orders', { params: { page, size: 10 } }),
  getByOrderNum: (num)        => api.get(`/orders/${num}`),
  cancel:        (id, reason) => api.post(`/orders/${id}/cancel`, null, { params: { reason } }),
  requestReturn: (id, reason) => api.post(`/orders/${id}/return`, null, { params: { reason } }),
};

export const paymentAPI = {
  initSSLCommerz: (orderId) => api.post(`/payments/sslcommerz/init/${orderId}`),
};

export const userAPI = {
  getProfile:     ()         => api.get('/users/me'),
  updateProfile:  (params)   => api.put('/users/me', null, { params }),
  changePassword: (cur, nw)  => api.post('/users/me/change-password', null, { params: { currentPassword: cur, newPassword: nw } }),
  deactivate:     ()         => api.post('/users/me/deactivate'),
  getAddresses:   ()         => api.get('/users/me/addresses'),
  addAddress:     (data)     => api.post('/users/me/addresses', data),
  deleteAddress:  (id)       => api.delete(`/users/me/addresses/${id}`),
};

export const wishlistAPI = {
  get:    ()            => api.get('/wishlist'),
  add:    (productId, priceDropAlert = false, stockAlert = false) =>
    api.post(`/wishlist/add/${productId}`, null, { params: { priceDropAlert, stockAlert } }),
  remove: (productId)   => api.delete(`/wishlist/remove/${productId}`),
  check:  (productId)   => api.get(`/wishlist/check/${productId}`),
};

export const reviewAPI = {
  getProductReviews: (productId, page = 0) =>
    api.get(`/reviews/product/${productId}`, { params: { page, size: 10 } }),

  canReview: (productId) =>
    api.get(`/reviews/can-review/${productId}`),

  create: (formData) =>
    api.post('/reviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const couponAPI = {
  validate: (code, orderAmount) => api.post('/coupons/validate', null, { params: { code, orderAmount } }),
};

export const notificationAPI = {
  get:            (page = 0) => api.get('/notifications', { params: { page } }),
  getUnreadCount: ()         => api.get('/notifications/unread-count'),
  markAllRead:    ()         => api.post('/notifications/mark-all-read'),
};

export const supportAPI = {
  createTicket: (subject, message, category = 'GENERAL') =>
    api.post('/support/tickets', null, { params: { subject, message, category } }),
  getMyTickets: (page = 0) => api.get('/support/tickets', { params: { page } }),
};