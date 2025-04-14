import { axiosWithAuth } from '../api/interceptors';
import { ISpace, ISpaceInput } from '../types/space.types';

export const spaceService = {
  async getAllSpaces() {
    return axiosWithAuth.get<ISpace[]>('/spaces');
  },

  async getSpaceById(id: number) {
    return axiosWithAuth.get<ISpace>(`/spaces/${id}`);
  },

  async createSpace(data: ISpaceInput) {
    return axiosWithAuth.post<ISpace>('/spaces', data);
  },

  async updateSpace(id: number, data: Partial<ISpaceInput>) {
    return axiosWithAuth.put<ISpace>(`/spaces/${id}`, data);
  },

  async deleteSpace(id: number) {
    return axiosWithAuth.delete<ISpace>(`/spaces/${id}`);
  }
};