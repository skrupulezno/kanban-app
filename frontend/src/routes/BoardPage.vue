<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import draggable from 'vuedraggable';  // компонент перетаскивания
import { taskService } from '../services/task.service';
import { ITask } from '../types/task.types';

const route = useRoute();
const boardId = route.query.id;
const spaceId = route.query.spaceId;

console.log('Board id:', boardId);
console.log('Space id:', spaceId);

// Массивы задач по статусам:
const todoTasks = ref<ITask[]>([]);
const inProgressTasks = ref<ITask[]>([]);
const doneTasks = ref<ITask[]>([]);

// Параметры для новой задачи (модальное окно):
const newTaskTitle = ref('');
const newTaskDescription = ref('');
const newTaskStage = ref<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');
const showModal = ref(false);

// Опции для выбора статуса задачи в выпадающем списке
const stageOptions = [
  { label: 'TODO', value: 'TODO' },
  { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
  { label: 'DONE', value: 'DONE' }
];

onMounted(async () => {
  try {
    const { data: tasks } = await taskService.getByBoardId(Number(boardId));
    todoTasks.value = tasks.filter(t => t.stage === 'TODO');
    inProgressTasks.value = tasks.filter(t => t.stage === 'IN_PROGRESS');
    doneTasks.value = tasks.filter(t => t.stage === 'DONE');
  } catch (error) {
    console.error('Ошибка загрузки задач:', error);
  }
});

// Объединяем колонки в один computed для удобства
const columns = computed(() => [
  { title: 'TODO', tasks: todoTasks.value },
  { title: 'In Progress', tasks: inProgressTasks.value },
  { title: 'Done', tasks: doneTasks.value }
]);

// Обработчик события перетаскивания
async function onTaskDrop(evt: any) {
  console.log('Task drop event:', evt);
  
  // Проверяем наличие свойства added и data-атрибута data-stage на целевом контейнере
  if (evt?.added && evt?.to?.dataset) {
    const movedTask = evt.added.element;
    const newStage = evt.to.dataset.stage;
    
    // Если статус изменился, обновляем его на сервере
    if (newStage && movedTask && movedTask.stage !== newStage) {
      movedTask.stage = newStage;
      try {
        await taskService.updateStage(movedTask.id, newStage);
        console.log(`Задача ${movedTask.id} обновлена: новый статус ${newStage}`);
      } catch (error) {
        console.error('Ошибка обновления статуса задачи:', error);
      }
    }
  } else {
    console.warn('Элемент не был добавлен в новую колонку, evt:', evt);
  }
}

// Создание новой задачи
async function createTask() {
  console.log('Выбранный статус для новой задачи:', newTaskStage.value);
  // При создании новой задачи изначально выбираем 'TODO'
  newTaskStage.value = 'TODO';
  
  const newTask = {
    boardId: Number(boardId),
    spaceId: Number(spaceId),
    title: newTaskTitle.value,
    description: newTaskDescription.value || '',
    stage: newTaskStage.value,
  };

  try {
    const { data: createdTask } = await taskService.createTask(Number(boardId), newTask);
    
    if (createdTask.stage === 'TODO') {
      todoTasks.value.push(createdTask);
    } else if (createdTask.stage === 'IN_PROGRESS') {
      inProgressTasks.value.push(createdTask);
    } else if (createdTask.stage === 'DONE') {
      doneTasks.value.push(createdTask);
    }
  } catch (error) {
    console.error('Ошибка создания задачи:', error);
  }
  
  newTaskTitle.value = '';
  newTaskDescription.value = '';
  newTaskStage.value = 'TODO';
  showModal.value = false;
}
</script>

<template>
  <div class="board-page">
    <h1 class="board-title">Доска {{ boardId }}</h1>
    <div class="columns-container">
      <!-- Перебор колонок канбан-доски -->
      <div class="column" v-for="(column, index) in columns" :key="index">
        <div class="column-header">{{ column.title }}</div>
        <div
          class="card-container"
          :data-stage="column.title === 'TODO' ? 'TODO' : (column.title === 'In Progress' ? 'IN_PROGRESS' : 'DONE')"
        >
          <draggable :list="column.tasks" item-key="id" group="tasks" @change="onTaskDrop">
            <template #item="{ element }">
              <div class="task-card">
                <div class="task-card-title">{{ element.title }}</div>
                <div class="task-card-description">{{ element.description }}</div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
    <div class="create-task-container">
      <button class="create-task-btn" @click="showModal = true">
        Создать задачу
      </button>
    </div>

    <!-- Модальное окно для создания новой задачи -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="modal-header">Новая задача</h2>
        <div class="form-field">
          <label for="title">Заголовок</label>
          <input id="title" type="text" v-model="newTaskTitle" />
        </div>
        <div class="form-field">
          <label for="description">Описание</label>
          <textarea id="description" v-model="newTaskDescription"></textarea>
        </div>
        <div class="form-field">
          <label for="stage">Статус</label>
          <select id="stage" v-model="newTaskStage">
            <option disabled value="">Выбрать статус</option>
            <option v-for="option in stageOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="modal-actions">
          <button class="modal-btn primary" @click="createTask">Создать</button>
          <button class="modal-btn" @click="showModal = false">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Основной стиль доски */
.board-page {
  background-color: #fafafa;
  min-height: 100vh;
  padding: 16px;
  font-family: 'Roboto', sans-serif;
}

/* Заголовок доски */
.board-title {
  text-align: center;
  margin-bottom: 24px;
}

/* Контейнер колонок */
.columns-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* Оформление колонки в стиле MUI */
.column {
  background-color: #fff;
  border-radius: 4px;
  width: 300px;
  box-shadow: 0px 1px 3px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Заголовок колонки */
.column-header {
  background-color: #3f51b5;
  color: white;
  padding: 12px 16px;
  font-size: 1.1rem;
}

/* Контейнер для карточек задач */
.card-container {
  padding: 16px;
  flex-grow: 1;
}

/* Карточка задачи */
.task-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 16px;
  padding: 12px;
  cursor: grab;
  transition: box-shadow 0.3s ease;
}

.task-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.task-card-title {
  font-weight: 500;
  margin-bottom: 8px;
}

.task-card-description {
  font-size: 0.9rem;
  color: #616161;
}

/* Контейнер кнопки создания задачи */
.create-task-container {
  text-align: center;
  margin-top: 24px;
}

.create-task-btn {
  background-color: #3f51b5;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-task-btn:hover {
  background-color: #303f9f;
}

/* Стили модального окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  width: 400px;
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0px 1px 5px rgba(0,0,0,0.3);
}

.modal-header {
  margin-top: 0;
  margin-bottom: 16px;
  color: #3f51b5;
  font-size: 1.5rem;
}

/* Стили для полей формы */
.form-field {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.form-field label {
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #424242;
}

.form-field input,
.form-field textarea,
.form-field select {
  border: 1px solid #cfcfcf;
  border-radius: 4px;
  padding: 8px;
  font-size: 1rem;
  outline: none;
}

.form-field input:focus,
.form-field textarea:focus,
.form-field select:focus {
  border-color: #3f51b5;
}

/* Стили для модальных кнопок */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.modal-btn {
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  background-color: #e0e0e0;
  color: #424242;
  transition: background-color 0.3s ease;
}

.modal-btn:hover {
  background-color: #d5d5d5;
}

.modal-btn.primary {
  background-color: #3f51b5;
  color: white;
}

.modal-btn.primary:hover {
  background-color: #303f9f;
}
</style>
