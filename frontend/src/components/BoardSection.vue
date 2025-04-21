<template>
    <section class="board-section">
      <h2>Доски пространства «{{ space.name }}»</h2>
      <div class="board-form">
        <input
          v-model="name"
          placeholder="Название доски"
        />
        <input
          v-model="description"
          placeholder="Описание (необязательно)"
        />
        <button
          :disabled="!name || loading"
          @click="onCreate"
        >
          {{ loading ? '…' : 'Создать' }}
        </button>
      </div>
  
      <ul>
        <li
          v-for="board in boards"
          :key="board.id"
          @click="goToBoard(board.id)"
        >
          <strong>{{ board.name }}</strong>
          <p v-if="board.description">{{ board.description }}</p>
        </li>
      </ul>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue';
  import { useRouter } from 'vue-router';
  
  const props = defineProps<{
    space: { id: number; name: string };
    boards: Array<{ id: number; name: string; description?: string }>;
    loading: boolean;
  }>();
  const emit = defineEmits<{
    (e: 'create-board', payload: { name: string; description?: string }): void;
  }>();
  
  const name = ref('');
  const description = ref('');
  const router = useRouter();
  
  const onCreate = () => {
    emit('create-board', { name: name.value, description: description.value });
    name.value = '';
    description.value = '';
  };
  
  const goToBoard = (id: number) => {
    router.push({ path: '/board', query: { id, spaceId: props.space.id } });
  };
  </script>
  
  <style scoped>
  .board-form {
    margin-bottom: 1rem;
  }
  .board-form input {
    margin-right: 0.5rem;
    padding: 0.4rem;
  }
  .board-form button {
    padding: 0.4rem 0.8rem;
  }
  .board-section ul {
    list-style: none;
    padding: 0;
  }
  .board-section li {
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
  }
  .board-section li:hover {
    background: #f5f5f5;
  }
  .board-section p {
    margin: 0.25rem 0 0;
    color: #666;
  }
  </style>
  