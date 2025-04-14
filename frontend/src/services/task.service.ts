import { axiosWithAuth } from '../api/interceptors';
import { ITask, ITaskInput, ITaskUpdate, ITaskFilter } from '../types/task.types';

export const taskService = {
  async getAllTasks(filter?: ITaskFilter) {
    return axiosWithAuth.get<ITask[]>('/tasks', { params: filter });
  },

  async getTaskById(id: number) {
    return axiosWithAuth.get<ITask>(`/tasks/${id}`);
  },

  async createTask(data: ITaskInput) {
    return axiosWithAuth.post<ITask>('/tasks', data);
  },

  async updateTask(id: number, data: ITaskUpdate) {
    return axiosWithAuth.patch<ITask>(`/tasks/${id}`, data);
  },

  async deleteTask(id: number) {
    return axiosWithAuth.delete<ITask>(`/tasks/${id}`);
  },

    async updateStage(id: number, stage: 'TODO' | 'IN_PROGRESS' | 'DONE') {
      return axiosWithAuth.put(`/tasks/${id}/stage`, { stage });
    }
};