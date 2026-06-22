import api from './api';

export const bookingService = {
  create: async (eventId: string) => {
    const response = await api.post('/bookings', { event_id: eventId });
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/my-bookings');
    return response.data;
  },

  cancel: async (bookingId: string) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  adminGetAll: async () => {
    const response = await api.get('/admin/bookings');
    return response.data;
  },

  adminUpdateStatus: async (bookingId: string, status: string) => {
    const response = await api.put(`/admin/bookings/${bookingId}`, { status });
    return response.data;
  }
};