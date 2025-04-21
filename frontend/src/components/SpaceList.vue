<!-- components/SpaceList.vue -->
<template>
    <section class="space-list">
      <h2>Пространства</h2>
      <div v-if="loading">Загрузка…</div>
      <ul v-else>
        <li
          v-for="space in spaces"
          :key="space.id"
          @click="$emit('select', space.id)"
        >
          <strong>{{ space.name }}</strong>
          <p v-if="space.description">{{ space.description }}</p>
        </li>
      </ul>
    </section>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  const props = defineProps<{
    spaces: Array<{ id: number; name: string; description?: string }>;
    loading: boolean;
  }>();
  </script>
  
  <style scoped>
  .space-list ul {
    list-style: none;
    padding: 0;
  }
  .space-list li {
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
  }
  .space-list li:hover {
    background: #f5f5f5;
  }
  .space-list p {
    margin: 0.25rem 0 0;
    color: #666;
  }
  </style>
  