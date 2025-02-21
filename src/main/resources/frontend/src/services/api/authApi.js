import axios from './axios';

export const authApi = {
  login: async (credentials) => {
    const response = await axios.post('/api/auth/login', credentials);
    const { token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    return response;
  },

  logout: async () => {
    const response = await axios.post('/api/auth/logout');
    localStorage.removeItem('token');
    return response;
  },

  register: async (userData) => {
    return await axios.post('/api/auth/register', userData);
  },

  getCurrentUser: async () => {
    return await axios.get('/api/auth/me');
  },

  updateProfile: async (userData) => {
    return await axios.put('/api/auth/profile', userData);
  },

  changePassword: async (passwordData) => {
    return await axios.put('/api/auth/password', passwordData);
  }
};

export default authApi; 