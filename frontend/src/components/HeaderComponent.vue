<script setup lang="ts">
import { useRoute } from 'vue-router';


const route = useRoute();

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<template>
  <div class="header-container">
    <div class="header-logo">
      <a href="">
        <img
          class="logo-image"
          src="/images/beamnova.svg"
          alt=""
        />
      </a>
    </div>
    <div class="header-navbar">
      <div class="navbar-list">
        <ul class="list">
          <li class="list-item">
            <a
              :class="{ active: isActive('/') }"
              href="/"
              >Главная</a
            >
          </li>
          <li class="list-item">
            <a
              :class="{ active: isActive('/dashboard') }"
              href="/dashboard"
              >Дэшборд</a
            >
          </li>
          <li class="list-item">
            <a
              :class="{ active: isActive('/about') }"
              href="/about"
              >О нас</a
            >
          </li>
          <li class="list-item">
            <a
              :class="{ active: isActive('/contact') }"
              href="/contact"
              >Контакты</a
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="header-auth">
      <a href="/auth/login">Войти</a>
    </div>
  </div>
</template>

<style scoped>
.list-item > a {
  background-color: transparent;
  padding: 10px 20px;
  border-radius: 50px;
  transition: background-color 0.3s ease;
}

.list-item > a.active {
  background-color: #f1f3f4;
  color: #5f6368;
}

.header-container {
  width: calc(100% - 400px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0px;
  background-color: #fff;
  padding: 20px 15px !important;
  border-radius: 50px;
  box-shadow:
    0 1px 2px rgba(32, 33, 36, 0.15),
    0 1px 8px rgba(32, 33, 36, 0.08);
}

@media screen and (max-width: 1200px) {
  .header-container {
    width: calc(100% - 40px);
    flex-direction: column;
  }
}

@media screen and (max-width: 800px) {
  .logo-image {
    display: none;
  }

  .list {
    display: inline-block;
  }
}

.header-logo {
  margin-left: 10px;
  margin-top: 2px;
}

.logo-image {
  width: 165px;
}

.list {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

a {
  color: #5f6368;
  font-weight: 600;
  text-decoration: none;
}

ul li {
  margin-right: 10px;
}
</style>
