import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

import AuthPage from './pages/AuthPage.vue';
import HomePage from './pages/HomePage.vue';
import LandingPage from './pages/LandingPage.vue';
import { useAuthStore } from './stores/auth.store';

const routes: Array<RouteRecordRaw> = [
  { path: '/', component: LandingPage },
  { path: '/auth', component: AuthPage },
  { path: '/home', component: HomePage, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  if (authStore.isAuthenticated === false && !authStore.user) {
    await authStore.fetchUser();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth');
  } else {
    next();
  }
});

export default router;
