import { defineStore } from 'pinia';
import { authService } from '../services/auth.service';
import { axiosWithAuth } from '../api/interceptors';
import { IAuthForm, IRegisterForm, IAuthResponse } from '../types/auth.types';
import { getAccessToken } from '../services/auth-token.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as IAuthResponse['user'] | null,
    token: null as string | null,
  }),
  getters: {
    isAuthenticated: (state): boolean => !!state.token && !!state.user,
  },
  actions: {
    async login(type: 'login' | 'register', data: IAuthForm | IRegisterForm) {
      const response = await authService.main(type, data);
      if (response.data && response.data.accessToken) {
        this.token = response.data.accessToken;
        this.user = response.data.user;
      }
      return response;
    },

    async logout() {
      await authService.logout();
      this.token = null;
      this.user = null;
    },

    async refreshToken() {
      const response = await authService.getNewToken();
      if (response.data && response.data.accessToken) {
        this.token = response.data.accessToken;
      }
      return response;
    },

    async fetchUser() {
      try {
        const response = await axiosWithAuth.get('/auth/me');
        const token = getAccessToken();
        if (response.data && token) {
          this.user = response.data; 
          this.token = token;
        }
      } catch (error) {
        this.token = null;
        this.user = null;
        console.error('Ошибка получения данных пользователя:', error);
      }
    }
  },
});
