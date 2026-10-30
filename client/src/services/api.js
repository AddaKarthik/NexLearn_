import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('nexlearn_token') || localStorage.getItem('cinewave_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiration handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthUrl =
        error.config.url.includes('/auth/login') || error.config.url.includes('/auth/signup');
      if (!isAuthUrl) {
        localStorage.removeItem('nexlearn_token');
        localStorage.removeItem('nexlearn_user');
        localStorage.removeItem('cinewave_token');
        localStorage.removeItem('cinewave_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const courseAPI = {
  getCourses: (params) => api.get('/courses', { params }),
  getFeatured: () => api.get('/courses/featured'),
  getTrending: () => api.get('/courses/trending'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  addReview: (id, data) => api.post(`/courses/${id}/reviews`, data),
  getStreamProxyUrl: (rawUrl) => `/api/courses/stream-proxy?url=${encodeURIComponent(rawUrl)}`,
};

export const enrollmentAPI = {
  enroll: (courseId) => api.post(`/enrollments/${courseId}`),
  getProgress: (courseId) => api.get(`/enrollments/${courseId}`),
  updateProgress: (courseId, data) => api.post(`/enrollments/${courseId}/progress`, data),
  getMyLearning: () => api.get('/my-learning'),
};

export const instructorAPI = {
  getCourses: () => api.get('/instructor/courses'),
  createCourse: (data) => api.post('/instructor/courses', data),
  updateCourse: (id, data) => api.put(`/instructor/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/instructor/courses/${id}`),
};

export const savedAPI = {
  getSaved: () => api.get('/saved'),
  toggle: (courseId) => api.post(`/saved/toggle/${courseId}`),
  check: (courseId) => api.get(`/saved/check/${courseId}`),
};

export const chatbotAPI = {
  sendMessage: (messages) => api.post('/chatbot', { messages }),
};

export const paymentAPI = {
  createOrder: () => api.post('/payment/create-order'),
  verifyPayment: (data) => api.post('/payment/verify', data),
  getStatus: () => api.get('/payment/status'),
  getHistory: () => api.get('/payment/history'),
};

// Backwards compatibility aliases for existing code
export const videoAPI = {
  getVideos: courseAPI.getCourses,
  getFeatured: courseAPI.getFeatured,
  getVideoById: courseAPI.getCourseById,
  recordView: () => Promise.resolve({ data: { success: true } }),
  checkAccess: (id) => courseAPI.getCourseById(id),
};

export const creatorAPI = {
  getVideos: instructorAPI.getCourses,
  createVideo: instructorAPI.createCourse,
  updateVideo: instructorAPI.updateCourse,
  deleteVideo: instructorAPI.deleteCourse,
};

export const watchlistAPI = {
  getWatchlist: savedAPI.getSaved,
  toggle: savedAPI.toggle,
  check: savedAPI.check,
};

export default api;
