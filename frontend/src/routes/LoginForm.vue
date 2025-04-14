<!-- src/components/LoginForm.vue -->
<template>
  <div class="login-form">
    <h2>Вход</h2>
    <form @submit.prevent="onSubmit">
      <div>
        <label for="login-email">Email:</label>
        <input
          type="email"
          id="login-email"
          v-model="loginForm.email"
          :class="{ 'input-error': emailError }"
          @blur="validateEmail"
          placeholder="Введите ваш email"
        />
        <span v-if="emailError" class="error">{{ emailError }}</span>
      </div>
      <div>
        <label for="login-password">Пароль:</label>
        <input
          type="password"
          id="login-password"
          v-model="loginForm.password"
          :class="{ 'input-error': passwordError }"
          @blur="validatePassword"
          placeholder="Введите ваш пароль"
        />
        <span v-if="passwordError" class="error">{{ passwordError }}</span>
      </div>
      <button type="submit">Войти</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { IAuthForm } from '../types/auth.types';

const router = useRouter();
const authStore = useAuthStore();

const loginForm = ref<IAuthForm>({
  email: '',
  password: ''
});

const emailError = ref('');
const passwordError = ref('');

const validateEmail = () => {
  if (!loginForm.value.email) {
    emailError.value = 'Email обязателен';
  } else if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(loginForm.value.email)) {
    emailError.value = 'Введите корректный email';
  } else {
    emailError.value = '';
  }
};

const validatePassword = () => {
  if (!loginForm.value.password) {
    passwordError.value = 'Пароль обязателен';
  } else if (loginForm.value.password.length < 6) {
    passwordError.value = 'Пароль должен быть не менее 6 символов';
  } else {
    passwordError.value = '';
  }
};

const onSubmit = async () => {
  validateEmail();
  validatePassword();
  if (!emailError.value && !passwordError.value) {
    try {
      await authStore.login('login', loginForm.value);
      router.push({ path: '/' });
    } catch (error) {
      console.error('Ошибка при входе:', error);
    }
  }
};
</script>

<style scoped>
/* Стили остаются без изменений */
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.input-error {
  border-color: red;
}
.error {
  color: red;
  font-size: 12px;
}
button[type="submit"] {
  width: 100%;
  padding: 12px;
  background-color: #4285f4;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
