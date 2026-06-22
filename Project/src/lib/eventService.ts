import api from './api';

export const eventService = {
  getAll: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await api.post('/events', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  update: async (id: string, data: any) => {
    if (data instanceof FormData) {
      const response = await api.post(`/events/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  getMyEvents: async () => {
    const response = await api.get('/my-events');
    return response.data;
  }
};