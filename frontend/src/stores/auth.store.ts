import { defineStore } from 'pinia';
import { ref } from 'vue';

import router from '../router';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<null | { email: string }>(null);
  const isAuthenticated = ref<boolean>(false);

  const fetchUser = async () => {
    try {
      const profile = await userService.getProfile();
      user.value = profile.user;
      isAuthenticated.value = true;
    } catch (error) {
      console.error('Ошибка при получении профиля:', error);
      isAuthenticated.value = false;
    }
  };

  const login = async (type: 'login' | 'register', data: any) => {
    await authService.main(type, data);
    await fetchUser();
  };

  const logout = async () => {
    await authService.logout();
    user.value = null;
    isAuthenticated.value = false;
    router.push('/auth');
  };

  return {
    user,
    isAuthenticated,
    fetchUser,
    login,
    logout
  };
});
