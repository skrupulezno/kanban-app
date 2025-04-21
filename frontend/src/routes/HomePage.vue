<!-- HomePage.vue -->
<template>
  <div class="app">
    <header class="app-header">
      <h1>Канбан доска</h1>
      <button class="logout-btn" @click="logout">Выйти</button>
    </header>

    <main class="container">
      <!-- Форма создания пространства -->
      <section class="space-form">
        <h2>Создать пространство</h2>
        <input
          v-model="newSpace.name"
          placeholder="Название пространства"
        />
        <input
          v-model="newSpace.description"
          placeholder="Описание (необязательно)"
        />
        <button
          :disabled="!newSpace.name || loadingSpaces"
          @click="createSpace"
        >
          {{ loadingSpaces ? 'Создание…' : 'Создать' }}
        </button>
      </section>

      <!-- Список пространств -->
      <SpaceList
        :spaces="spaces"
        :loading="loadingSpaces"
        @select="selectSpace"
      />

      <!-- Секция досок выбранного пространства -->
      <BoardSection
        v-if="selectedSpace"
        :space="selectedSpace"
        :boards="boards"
        :loading="loadingBoards"
        @create-board="createBoard"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';
import { spaceService } from '../services/space.service';
import { boardService } from '../services/board.service';

import SpaceList from '../components/SpaceList.vue';
import BoardSection from '../components/BoardSection.vue';

const authStore = useAuthStore();
const router = useRouter();

const userEmail = computed(() => authStore.user?.email || '');

const spaces = ref<Array<{ id: number; name: string; description?: string }>>([]);
const newSpace = ref({ name: '', description: '' });
const loadingSpaces = ref(false);

const selectedSpaceId = ref<number | null>(null);
const boards = ref<Array<{ id: number; name: string; description?: string }>>([]);
const loadingBoards = ref(false);

const selectedSpace = computed(() =>
  spaces.value.find((s) => s.id === selectedSpaceId.value) || null
);

const fetchSpaces = async () => {
  loadingSpaces.value = true;
  try {
    const { data } = await spaceService.getAllSpaces();
    spaces.value = data;
  } finally {
    loadingSpaces.value = false;
  }
};

const createSpace = async () => {
  if (!newSpace.value.name) return;
  loadingSpaces.value = true;
  try {
    await spaceService.createSpace({
      name: newSpace.value.name,
      description: newSpace.value.description || undefined,
    });
    newSpace.value = { name: '', description: '' };
    await fetchSpaces();
  } finally {
    loadingSpaces.value = false;
  }
};

const selectSpace = async (id: number) => {
  selectedSpaceId.value = id;
  loadingBoards.value = true;
  try {
    const resp = await boardService.getBoardsBySpaceId(id);
    boards.value = resp.data;
  } finally {
    loadingBoards.value = false;
  }
};

const createBoard = async (payload: { name: string; description?: string }) => {
  if (!payload.name || selectedSpaceId.value === null) return;
  loadingBoards.value = true;
  try {
    await boardService.createBoard({
      name: payload.name,
      description: payload.description || undefined,
      spaceId: selectedSpaceId.value,
    });
    await selectSpace(selectedSpaceId.value);
  } finally {
    loadingBoards.value = false;
  }
};

const logout = () => {
  authStore.logout();
  router.push('/auth/login');
};

onMounted(fetchSpaces);
</script>

<style scoped>
.app {
  font-family: Roboto, sans-serif;
}
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1976d2;
  color: #fff;
  padding: 1rem;
}
.logout-btn {
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.container {
  padding: 1rem;
}
.space-form,
.board-section {
  margin-bottom: 2rem;
}
.space-form input,
.board-section input {
  margin-right: 0.5rem;
  padding: 0.5rem;
}
.space-form button,
.board-section button {
  padding: 0.5rem 1rem;
}
</style>
