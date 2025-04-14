import { axiosWithAuth } from '../api/interceptors';
import { IUser, IUserInput } from '../types/user.types';

export const userService = {
  async getAllUsers() {
    return axiosWithAuth.get<IUser[]>('/users');
  },

  async getUserById(id: number) {
    return axiosWithAuth.get<IUser>(`/users/${id}`);
  },

  async createUser(data: IUserInput) {
    return axiosWithAuth.post<IUser>('/users', data);
  },

  async updateUser(id: number, data: Partial<IUserInput>) {
    return axiosWithAuth.put<IUser>(`/users/${id}`, data);
  },

  async deleteUser(id: number) {
    return axiosWithAuth.delete<boolean>(`/users/${id}`);
  }
};