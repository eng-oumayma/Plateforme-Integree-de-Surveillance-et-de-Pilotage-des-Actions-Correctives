import api from '../api/api';
import type { User, CreateUserPayload, UpdateUserPayload } from '../types';

export const userService = {
  async getAll(params?: { role?: string; isActive?: boolean; department?: string }): Promise<User[]> {
    const { data } = await api.get('/users', { params });
    return data;
  },

  async getById(id: string): Promise<User> {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const { data } = await api.post('/users', payload);
    return data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
  },

   
  // Backend : DELETE /users/:id
  async remove(id) {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },

  // async toggleActive(id: string, isActive: boolean): Promise<User> {
  //   const { data } = await api.patch(`/users/${id}/status`, { isActive });
  //   return data;
  // },

    // Backend attend : PATCH /users/:id/status  { status: 'ACTIVE' | 'INACTIVE' }
  async toggleActive(id, makeActive) {
    const { data } = await api.patch(`/users/${id}/status`, {
      status: makeActive ? 'ACTIVE' : 'INACTIVE',
    });
    return data;
  },
  async updateAvatar(id: string, file: File): Promise<User> {
    const form = new FormData();
    form.append('avatar', file);
    const { data } = await api.patch(`/users/${id}/avatar`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async exportCsv(): Promise<Blob> {
    const { data } = await api.get('/users/export', { responseType: 'blob' });
    return data;
  },
};