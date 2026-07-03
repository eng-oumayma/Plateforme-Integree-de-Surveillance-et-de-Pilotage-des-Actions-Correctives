import api from '../api/api';

export const regulatoryEventService = {
  getAll: async () => {
    const response = await api.get('/regulatory-events');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/regulatory-events', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.patch(`/regulatory-events/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/regulatory-events/${id}`);
    return response.data;
  }
};