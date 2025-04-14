<!-- src/pages/AuthPage.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '../stores/auth.store';
import { IAuthForm, IRegisterForm } from '../types/auth.types';

const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);

const loginForm = ref<IAuthForm>({
  email: '',
  password: ''
});

const registerForm = ref<IRegisterForm>({
  email: '',
  password: '',
  confirmPassword: ''
});

const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

const validateEmail = () => {
  const currentForm = isLogin.value ? loginForm.value : registerForm.value;
  if (!currentForm.email) {
    emailError.value = 'Email обязателен';
  } else if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(currentForm.email)) {
    emailError.value = 'Введите корректный email';
  } else {
    emailError.value = '';
  }
};

const validatePassword = () => {
  const currentForm = isLogin.value ? loginForm.value : registerForm.value;
  if (!currentForm.password) {
    passwordError.value = 'Пароль обязателен';
  } else if (currentForm.password.length < 6) {
    passwordError.value = 'Пароль должен быть не менее 6 символов';
  } else {
    passwordError.value = '';
  }
};

const validateConfirmPassword = () => {
  if (!registerForm.value.confirmPassword) {
    confirmPasswordError.value = 'Подтверждение пароля обязательно';
  } else if (
    registerForm.value.confirmPassword !== registerForm.value.password
  ) {
    confirmPasswordError.value = 'Пароли не совпадают';
  } else {
    confirmPasswordError.value = '';
  }
};

const onSubmit = async () => {
  validateEmail();
  validatePassword();

  if (!isLogin.value) {
    validateConfirmPassword();
  }

  if (
    !emailError.value &&
    !passwordError.value &&
    (isLogin.value || !confirmPasswordError.value)
  ) {
    try {
      if (isLogin.value) {
        await authStore.login('login', loginForm.value);
      } else {
        const { confirmPassword, ...data } = registerForm.value;
        await authStore.login('register', data);
      }
      router.push({ path: '/' });
    } catch (error) {
      console.error('Ошибка при аутентификации:', error);
    }
  }
};
</script>

<template>
  <div class="auth-form">
    <div class="toggle">
      <button
        :class="{ active: isLogin }"
        @click="isLogin = true"
      >
        Вход
      </button>
      <button
        :class="{ active: !isLogin }"
        @click="isLogin = false"
      >
        Регистрация
      </button>
    </div>

    <form @submit.prevent="onSubmit">
      <div v-if="isLogin">
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
          <span
            v-if="emailError"
            class="error"
            >{{ emailError }}</span
          >
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
          <span
            v-if="passwordError"
            class="error"
            >{{ passwordError }}</span
          >
        </div>
      </div>

      <div v-else>
        <div>
          <label for="register-email">Email:</label>
          <input
            type="email"
            id="register-email"
            v-model="registerForm.email"
            :class="{ 'input-error': emailError }"
            @blur="validateEmail"
            placeholder="Введите ваш email"
          />
          <span
            v-if="emailError"
            class="error"
            >{{ emailError }}</span
          >
        </div>

        <div>
          <label for="register-password">Пароль:</label>
          <input
            type="password"
            id="register-password"
            v-model="registerForm.password"
            :class="{ 'input-error': passwordError }"
            @blur="validatePassword"
            placeholder="Введите ваш пароль"
          />
          <span
            v-if="passwordError"
            class="error"
            >{{ passwordError }}</span
          >
        </div>

        <div>
          <label for="confirmPassword">Подтвердите пароль:</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="registerForm.confirmPassword"
            :class="{ 'input-error': confirmPasswordError }"
            @blur="validateConfirmPassword"
            placeholder="Подтвердите ваш пароль"
          />
          <span
            v-if="confirmPasswordError"
            class="error"
            >{{ confirmPasswordError }}</span
          >
        </div>
      </div>

      <button type="submit">
        {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

.toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.toggle button {
  background: transparent;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
  color: #ddd;
}

.toggle .active {
  border-bottom: 2px solid #4285f4;
  color: #4285f4;
}

input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #4285f4;
}

.input-error {
  border-color: red;
}

.error {
  color: red;
  font-size: 12px;
}

button[type='submit'] {
  width: 100%;
  padding: 12px;
  background-color: #4285f4;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button[type='submit']:hover {
  background-color: #357ae8;
}
</style>
