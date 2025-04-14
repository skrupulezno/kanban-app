import { axiosClassic } from '../api/interceptors';
import { IAuthForm, IAuthResponse, IRegisterForm } from '../types/auth.types';
import { saveTokenStorage, removeFromStorage } from './auth-token.service';

export const authService = {
  async main(type: 'login' | 'register', data: IAuthForm | IRegisterForm) {
    const response = await axiosClassic.post<IAuthResponse>(`/auth/${type}`, data);
    if (response.data.accessToken) {
      saveTokenStorage(response.data.accessToken);
    }
    return response;
  },

  async getNewToken() {
    const response = await axiosClassic.post<IAuthResponse>('/auth/refresh');
    if (response.data.accessToken) {
      saveTokenStorage(response.data.accessToken);
    }
    return response;
  },

  async logout() {
    removeFromStorage();
  }
};