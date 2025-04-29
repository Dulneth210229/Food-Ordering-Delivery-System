import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token for authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      // Check if the error is due to token expiration
      if (error.response.data.message === 'Token expired' || 
          error.response.data.message === 'Invalid token') {
        console.error('Authentication token expired or invalid');
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// User authentication
export const registerUser = (data) => api.post('/api/v1/users/register', data);
export const loginUser = (data) => api.post('/api/v1/users/login', data);
export const getUserProfile = () => api.get('/api/v1/users/profile');
export const updateUserProfile = (data) => api.put('/api/v1/users/update-profile', data);
export const changeUserPassword = (data) => api.put('/api/v1/users/change-password', data);
export const deleteUserAccount = () => api.delete('/api/v1/users/delete-account');

// Driver authentication
export const registerDriver = (data) => api.post('/api/v1/drivers/register', data);
export const loginDriver = (data) => api.post('/api/v1/drivers/login', data);
export const getDriverProfile = () => api.get('/api/v1/drivers/profile');
export const updateDriverProfile = (data) => api.put('/api/v1/drivers/update-profile', data);
export const changeDriverPassword = (data) => api.put('/api/v1/drivers/change-password', data);
export const deleteDriverAccount = () => api.delete('/api/v1/drivers/delete-account');

// Admin authentication
export const registerAdmin = (data) => api.post('/api/v1/admin/register', data);
export const loginAdmin = (data) => api.post('/api/v1/admin/login', data);
export const getAdminProfile = () => api.get('/api/v1/admin/profile');
export const updateAdminProfile = (data) => api.put('/api/v1/admin/update-profile', data);
export const changeAdminPassword = (data) => api.put('/api/v1/admin/change-password', data);
export const deleteAdminAccount = () => api.delete('/api/v1/admin/delete-account');

export default api;