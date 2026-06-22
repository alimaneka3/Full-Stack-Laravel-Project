import api from './api';

export const adminService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Users
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  updateUser: async (userId: string, data: { role?: string; is_approved?: boolean }) => {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Events
  getEvents: async () => {
    const response = await api.get('/admin/events');
    return response.data;
  },

  deleteEvent: async (eventId: string) => {
    const response = await api.delete(`/admin/events/${eventId}`);
    return response.data;
  },

  // Bookings
  getBookings: async () => {
    const response = await api.get('/admin/bookings');
    return response.data;
  },

  updateBookingStatus: async (bookingId: string, status: string) => {
    const response = await api.put(`/admin/bookings/${bookingId}`, { status });
    return response.data;
  },

  // Contact Messages
  getContactMessages: async () => {
    const response = await api.get('/admin/contact-messages');
    return response.data;
  },

  markMessageRead: async (messageId: string) => {
    const response = await api.put(`/admin/contact-messages/${messageId}`);
    return response.data;
  },

  deleteMessage: async (messageId: string) => {
    const response = await api.delete(`/admin/contact-messages/${messageId}`);
    return response.data;
  },

  // Organisers (approvals) - Helper methods
  getPendingOrganisers: async () => {
    const response = await api.get('/admin/users');
    const users = response.data;
    return users.filter((u: any) => u.role === 'organiser' && !u.is_approved);
  },

  approveOrganiser: async (userId: string) => {
    const response = await api.put(`/admin/users/${userId}`, { is_approved: true });
    return response.data;
  },

  rejectOrganiser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  }
};