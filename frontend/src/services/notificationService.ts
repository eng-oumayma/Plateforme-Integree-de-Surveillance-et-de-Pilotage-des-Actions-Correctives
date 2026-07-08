import api from '../api/api';

export const notificationService = {
  async getAll(page = 1, limit = 20) {
    const { data } = await api.get('/notifications', { params: { page, limit } });
    return data; // { data: Notification[], total: number, unreadCount: number }
  },

  async getUnreadCount() {
    const { data } = await api.get('/notifications/unread-count');
    return data.count as number;
  },

  async poll(since: string) {
    const { data } = await api.get('/notifications/poll', { params: { since } });
    return data;
  },

  async markAsRead(id: string) {
    const { data } = await api.put(`/notifications/${id}/read`);
    return data;
  },

  async markAllAsRead() {
    const { data } = await api.put('/notifications/read-all');
    return data;
  },

  async remove(id: string) {
    await api.delete(`/notifications/${id}`);
  },

  async clearRead() {
    const { data } = await api.delete('/notifications/clear-read');
    return data;
  },
};