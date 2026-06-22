import api from './api';

export const authService = {
  register: async (data: { 
    name: string; 
    email: string; 
    password: string;
    password_confirmation: string;
    role: string 
  }) => {
    const response = await api.post('/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      // Ignore errors on logout
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    const response = await api.post('/reset-password', data);
    return response.data;
  }
};