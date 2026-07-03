import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to inject JWT authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('plan_b_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Endpoint Actions
export const authAPI = {
  register: (email, password) => api.post('/api/auth/register', { email, password }),
  login: (email, password) => api.post('/api/auth/login-json', { email, password }),
  getMe: () => api.get('/api/auth/me'),
  googleLogin: (email, name, picture) => api.post('/api/auth/google', { email, name, picture }),
};

export const profileAPI = {
  getProfile: () => api.get('/api/profile'),
  updateProfile: (profileData) => api.put('/api/profile', profileData),
  uploadPicture: (formData) => api.post('/api/profile/picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  detectLocation: (lat, lon, city) => api.post('/api/profile/detect-location', { latitude: lat, longitude: lon, city }),
};

export const moodsAPI = {
  logMood: (mood, note) => api.post('/api/moods', { mood, note }),
  getHistory: () => api.get('/api/moods'),
  getStats: () => api.get('/api/moods/stats'),
};

export const matchesAPI = {
  getMatches: () => api.get('/api/matches'),
  performAction: (targetId, action) => api.post(`/api/matches/${targetId}/action`, { action }),
  getIcebreakers: (targetId) => api.post(`/api/matches/${targetId}/icebreaker`),
};

export const eventsAPI = {
  getEvents: (category) => api.get('/api/events', { params: { category } }),
  getEventDetails: (eventId) => api.get(`/api/events/${eventId}`),
  createEvent: (eventData) => api.post('/api/events', eventData),
  joinEvent: (eventId) => api.post(`/api/events/${eventId}/join`),
};

export const communityAPI = {
  getCommunities: (userId) => api.get('/api/communities', { params: { current_user_id: userId } }),
  createCommunity: (commData) => api.post('/api/communities', commData),
  joinCommunity: (commId) => api.post(`/api/communities/${commId}/join`),
  getPosts: (commId) => api.get(`/api/communities/${commId}/posts`),
  createPost: (commId, postData) => api.post(`/api/communities/${commId}/posts`, postData),
  likePost: (postId) => api.post(`/api/communities/posts/${postId}/like`),
  commentOnPost: (postId, commentData) => api.post(`/api/communities/posts/${postId}/comments`, commentData),
};

export const chatAPI = {
  getContacts: () => api.get('/api/chat/contacts'),
  getHistory: (otherUserId) => api.get(`/api/chat/${otherUserId}`),
  sendMessage: (receiverId, message) => api.post('/api/chat', { receiver_id: receiverId, message }),
};

export const assistantAPI = {
  queryAssistant: (message) => api.post('/api/assistant', { message }),
};

export default api;
export { API_BASE_URL };
