<script setup lang="ts">
import { computed } from 'vue';

import { useAuthStore } from '../stores/auth.store';

const authStore = useAuthStore();

const userEmail = computed(() => authStore.user?.email || '');
</script>

<template>
  <div class="home-page">
    <h1>Добро пожаловать!</h1>
    <p>Ваш email: {{ userEmail }}</p>
    <button @click="authStore.logout">Выйти</button>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-family: 'Roboto', sans-serif;
}

button {
  padding: 10px 20px;
  background-color: #e53935;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
}

button:hover {
  background-color: #d32f2f;
}
</style>
