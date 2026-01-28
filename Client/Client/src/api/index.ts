import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token Refresh Logic could go here
    if (error.response?.status === 401 && !originalRequest._retry) {
      // For now, simple logout on 401. Fully robust refresh flows can be added later.
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // window.location.href = '/login'; // Optional: Redirect to login
    }

    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
