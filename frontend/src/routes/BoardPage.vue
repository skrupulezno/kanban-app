<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import draggable from 'vuedraggable';  // импорт компонента перетаскивания
import { taskService } from '../services/task.service';

interface Task {
  id: number;
  title: string;
  description: string;
  stage: 'TODO' | 'IN_PROGRESS' | 'DONE';
  boardId: number;
}

const route = useRoute();
const boardId = route.params.id;             // ID текущей доски из маршрута

// Массивы задач по статусам:
const todoTasks = ref<Task[]>([]);
const inProgressTasks = ref<Task[]>([]);
const doneTasks = ref<Task[]>([]);

// Поля для новой задачи (модальное окно):
const newTaskTitle = ref('');
const newTaskDescription = ref('');
const newTaskStage = ref<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
const showModal = ref(false);

onMounted(async () => {
  // Загрузка задач доски
  const res = await fetch(`/api/boards/${boardId}/tasks`);
  const tasks: Task[] = await res.json();
  // Распределяем задачи по спискам в соответствии с их stage
  todoTasks.value = tasks.filter(t => t.stage === 'TODO');
  inProgressTasks.value = tasks.filter(t => t.stage === 'IN_PROGRESS');
  doneTasks.value = tasks.filter(t => t.stage === 'DONE');
});

// Вызывается после окончания перетаскивания задачи
async function onTaskDrop(_evt: any) {
  const updateAll = async (tasks: any[], stage: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    for (const task of tasks) {
      task.stage = stage;
      await taskService.updateStage(task.id, stage);
    }
  };

  await updateAll(todoTasks.value, 'TODO');
  await updateAll(inProgressTasks.value, 'IN_PROGRESS');
  await updateAll(doneTasks.value, 'DONE');
}

// Создание новой задачи
async function createTask() {
  const newTask: Task = {
    id: Date.now(),  // генерация временного ID (в реальности сервер сгенерирует)
    boardId: Number(boardId),
    title: newTaskTitle.value,
    description: newTaskDescription.value,
    stage: newTaskStage.value,
  };
  // Отправляем POST запрос для сохранения задачи на сервере
  await fetch(`/api/boards/${boardId}/tasks`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(newTask)
  });
  // Добавляем задачу в соответствующий список на клиенте:
  if (newTask.stage === 'TODO') {
    todoTasks.value.push(newTask);
  } else if (newTask.stage === 'IN_PROGRESS') {
    inProgressTasks.value.push(newTask);
  } else if (newTask.stage === 'DONE') {
    doneTasks.value.push(newTask);
  }
  // Очищаем поля и закрываем модалку
  newTaskTitle.value = '';
  newTaskDescription.value = '';
  newTaskStage.value = 'TODO';
  showModal.value = false;
}
</script>

<template>
  <div class="board-page">
    <h1>Доска {{ boardId }}</h1>
    <div class="columns">
      <!-- Колонка TODO -->
      <div class="column">
        <h2>TODO</h2>
        <draggable :list="todoTasks" item-key="id" group="tasks" @end="onTaskDrop">
          <template #item="{ element }">
            <div class="task-card">
              <h3>{{ element.title }}</h3>
              <p>{{ element.description }}</p>
            </div>
          </template>
        </draggable>
      </div>
      <!-- Колонка IN_PROGRESS -->
      <div class="column">
        <h2>In Progress</h2>
        <draggable :list="inProgressTasks" item-key="id" group="tasks" @end="onTaskDrop">
          <template #item="{ element }">
            <div class="task-card">
              <h3>{{ element.title }}</h3>
              <p>{{ element.description }}</p>
            </div>
          </template>
        </draggable>
      </div>
      <!-- Колонка DONE -->
      <div class="column">
        <h2>Done</h2>
        <draggable :list="doneTasks" item-key="id" group="tasks" @end="onTaskDrop">
          <template #item="{ element }">
            <div class="task-card">
              <h3>{{ element.title }}</h3>
              <p>{{ element.description }}</p>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Кнопка для создания новой задачи -->
    <button @click="showModal = true">Создать задачу</button>

    <!-- Модальное окно для новой задачи -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Новая задача</h3>
        <input v-model="newTaskTitle" placeholder="Заголовок" />
        <textarea v-model="newTaskDescription" placeholder="Описание"></textarea>
        <select v-model="newTaskStage">
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
        <div class="modal-actions">
          <button @click="createTask">Создать</button>
          <button @click="showModal = false">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>
