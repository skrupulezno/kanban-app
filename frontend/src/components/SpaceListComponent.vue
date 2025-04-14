<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Board { id: number; name: string; spaceId: number }
interface Space { id: number; name: string; boards?: Board[] }

const spaces = ref<Space[]>([]);

onMounted(async () => {
  // Получить все спейсы
  const res = await fetch('/api/spaces');
  spaces.value = await res.json();
  // Для каждого спейса получить его доски
  for (const space of spaces.value) {
    const resBoards = await fetch(`/api/spaces/${space.id}/boards`);
    space.boards = await resBoards.json();
  }
});
</script>

<template>
  <h1>Все спейсы</h1>
  <div v-for="space in spaces" :key="space.id" class="space-section">
    <h2>{{ space.name }}</h2>
    <ul>
      <li v-for="board in space.boards ?? []" :key="board.id">
        <!-- Переход по клику на доску -->
        <router-link :to="`/board/${board.id}`">{{ board.name }}</router-link>
      </li>
    </ul>
  </div>
</template>
