<template>
  <div class="board-page">
    <header class="board-header">
      <h1>Доска {{ boardId }}</h1>
      
    <button class="btn-add" @click="showModal = true">+ Новая задача</button> 
      <button class="btn-logout" @click="goBack">← Назад</button>
    </header>

    <div class="columns">
      <div
        v-for="column in columns"
        :key="column.name"
        class="column"
        :data-stage="column.name"
      >
        <h2 class="column-title">{{ column.label }}</h2>

        <draggable
          class="task-list"
          :list="column.tasks"
          group="tasks"
          item-key="id"
          @add="onTaskDrop"
          @end="onTaskDrop" 
        >
          <template #item="{ element }">
            <div class="task-card">
              <div class="task-card-title">{{ element.title }}</div>
              <div class="task-card-desc">{{ element.description }}</div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal">
          <h3>Создать задачу</h3>
          <input v-model="newTaskTitle" placeholder="Заголовок" />
          <textarea v-model="newTaskDescription" placeholder="Описание"></textarea>
          <div class="modal-actions">
            <button class="btn-primary" @click="createTask">Создать</button>
            <button @click="showModal = false">Отмена</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import draggable from 'vuedraggable';
import { taskService } from '../services/task.service';
import { ITask } from '../types/task.types';

const route = useRoute();
const router = useRouter();
const boardId = Number(route.query.id);
const spaceId = Number(route.query.spaceId);

const todoTasks = ref<ITask[]>([]);
const inProgressTasks = ref<ITask[]>([]);
const doneTasks = ref<ITask[]>([]);

const newTaskTitle = ref('');
const newTaskDescription = ref('');
const showModal = ref(false);

onMounted(async () => {
  try {
    const { data } = await taskService.getByBoardId(boardId);
    todoTasks.value = data.filter(t => t.stage === 'TODO');
    inProgressTasks.value = data.filter(t => t.stage === 'IN_PROGRESS');
    doneTasks.value = data.filter(t => t.stage === 'DONE');
  } catch (err) {
    console.error('Ошибка загрузки задач:', err);
  }
});

const columns = computed(() => [
  { name: 'TODO', label: 'TO DO', tasks: todoTasks.value },
  { name: 'IN_PROGRESS', label: 'In Progress', tasks: inProgressTasks.value },
  { name: 'DONE', label: 'Done', tasks: doneTasks.value },
]);

async function onTaskDrop(evt: SortableEvent) {
  // evt.added exists if it was really added here
  console.log(evt);
  
  if (evt.added) {
    const movedTask = evt.added.element as ITask;
    const toCol = (evt.to as HTMLElement).closest('.column')!;
    const newStage = toCol!.getAttribute('data-stage') as ITask['stage'];

    if (movedTask.stage !== newStage) {
      await taskService.updateStage(movedTask.id, newStage);
      movedTask.stage = newStage;
    }
  }
}

async function createTask() {
  const payload = {
    boardId,
    spaceId,
    title: newTaskTitle.value,
    description: newTaskDescription.value,
    stage: 'TODO' as const
  };
  try {
    const { data: created } = await taskService.createTask(boardId, payload);
    todoTasks.value.push(created);
  } catch (error) {
    console.error('Ошибка создания задачи:', error);
  }
  newTaskTitle.value = '';
  newTaskDescription.value = '';
  showModal.value = false;
}

function goBack() {
  router.back();
}
</script>

<style scoped>
:root {
  --bg: #f4f5f7;
  --col-bg: #ffffff;
  --primary: #5c6bc0;
  --primary-dark: #3949ab;
  --text: #333;
  --muted: #666;
}

.board-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Roboto', sans-serif;
  background: var(--bg);
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--primary);
  color: #fff;
}
.btn-logout {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}

.columns {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  padding: 1rem 2rem;
  overflow-x: auto;
}

.column {
  background: var(--col-bg);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}
.column[data-stage="TODO"]    { border-top: 4px solid #f06292; }
.column[data-stage="IN_PROGRESS"] { border-top: 4px solid #ffb74d; }
.column[data-stage="DONE"]    { border-top: 4px solid #81c784; }

.column-title {
  margin: 0 0 0.5rem;
  color: var(--text);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.task-list {
  flex: 1;
  min-height: 50px;
}

.task-card {
  background: var(--col-bg);
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  cursor: grab;
  transition: box-shadow 0.2s ease;
}
.task-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.task-card-title {
  font-weight: 500;
  color: var(--text);
}
.task-card-desc {
  font-size: 0.9rem;
  color: var(--muted);
  margin-top: 0.25rem;
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}
.btn-add:hover {
  background: var(--primary-dark);
}

/* Модалка */
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  width: 320px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.modal h3 {
  margin-top: 0;
  color: var(--primary);
}
.modal input,
.modal textarea {
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.modal-actions {
  text-align: right;
}
.modal-actions button {
  margin-left: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
}
.modal-actions .btn-primary {
  background: var(--primary);
  color: #fff;
}
.modal-actions .btn-primary:hover {
  background: var(--primary-dark);
}
.modal-actions button:not(.btn-primary):hover {
  background: #eee;
}
</style>
