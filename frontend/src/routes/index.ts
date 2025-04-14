// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import LoginForm from '../routes/LoginForm.vue';
import RegisterForm from '../routes/RegisterForm.vue';
import Home from '../routes/HomePage.vue'; 

import { useAuthStore } from '../stores/auth.store';

const routes = [
  { path: '/auth/login', component: LoginForm },
  { path: '/auth/register', component: RegisterForm },
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated && !authStore.user) {
    await authStore.fetchUser();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/auth/login');
  }

  if (authStore.isAuthenticated && (to.path === '/auth/login' || to.path === '/auth/register')) {
    return next('/');
  }

  next();
});

export default router;