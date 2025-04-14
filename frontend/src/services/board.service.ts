import { axiosWithAuth } from '../api/interceptors';
import { IBoard, IBoardInput } from '../types/board.types';

export const boardService = {
  async getAllBoards() {
    return axiosWithAuth.get<IBoard[]>('/boards');
  },

  async getBoardById(id: number) {
    return axiosWithAuth.get<IBoard>(`/boards/${id}`);
  },

  async createBoard(data: IBoardInput) {
    return axiosWithAuth.post<IBoard>('/boards', data);
  },

  async updateBoard(id: number, data: Partial<IBoardInput>) {
    return axiosWithAuth.put<IBoard>(`/boards/${id}`, data);
  },

  async deleteBoard(id: number) {
    return axiosWithAuth.delete<IBoard>(`/boards/${id}`);
  }
};