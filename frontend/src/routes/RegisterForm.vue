<!-- src/components/RegisterForm.vue -->
<template>
  <div class="register-form">
    <h2>Регистрация</h2>
    <form @submit.prevent="onSubmit">
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
        <span v-if="emailError" class="error">{{ emailError }}</span>
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
        <span v-if="passwordError" class="error">{{ passwordError }}</span>
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
        <span v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</span>
      </div>
      <button type="submit">Зарегистрироваться</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { IRegisterForm } from '../types/auth.types';

const router = useRouter();
const authStore = useAuthStore();

const registerForm = ref<IRegisterForm>({
  email: '',
  password: '',
  confirmPassword: ''
});

const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

const validateEmail = () => {
  if (!registerForm.value.email) {
    emailError.value = 'Email обязателен';
  } else if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(registerForm.value.email)) {
    emailError.value = 'Введите корректный email';
  } else {
    emailError.value = '';
  }
};

const validatePassword = () => {
  if (!registerForm.value.password) {
    passwordError.value = 'Пароль обязателен';
  } else if (registerForm.value.password.length < 6) {
    passwordError.value = 'Пароль должен быть не менее 6 символов';
  } else {
    passwordError.value = '';
  }
};

const validateConfirmPassword = () => {
  if (!registerForm.value.confirmPassword) {
    confirmPasswordError.value = 'Подтверждение пароля обязательно';
  } else if (registerForm.value.confirmPassword !== registerForm.value.password) {
    confirmPasswordError.value = 'Пароли не совпадают';
  } else {
    confirmPasswordError.value = '';
  }
};

const onSubmit = async () => {
  validateEmail();
  validatePassword();
  validateConfirmPassword();
  if (!emailError.value && !passwordError.value && !confirmPasswordError.value) {
    try {
      const { confirmPassword, ...data } = registerForm.value;
      await authStore.login('register', data);
      router.push({ path: '/' });
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
    }
  }
};
</script>

<style scoped>
/* Стили остаются аналогичными */
.register-form {
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
