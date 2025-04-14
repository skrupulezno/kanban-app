<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { spaceService } from '../services/space.service';
import { boardService } from '../services/board.service';
import { ISpace } from '../types/space.types';

const spaces = ref<ISpace[]>([]);

onMounted(async () => {
  try {
    const { data: spaceList } = await spaceService.getAllSpaces();
    for (const space of spaceList) {
      const { data: boards } = await boardService.getBoardsBySpaceId(space.id);
      space.boards = boards;
    }
    spaces.value = spaceList;
  } catch (error) {
    console.error('Ошибка загрузки спейсов и досок:', error);
  }
});
</script>

<template>
  <h1>Все спейсы</h1>
  <div v-for="space in spaces" :key="space.id" class="space-section">
    <h2>{{ space.name }}</h2>
    <ul>
      <li v-for="board in space.boards ?? []" :key="board.id">
        <router-link :to="{ name: 'Board', query: { id: board.id, spaceId: space.id } }">
          {{ board.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>
