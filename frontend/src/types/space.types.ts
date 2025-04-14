import { IBoard } from './board.types';

export interface ISpace {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;

  boards?: IBoard[];
}

export interface ISpaceInput {
  name: string;
  description?: string;
}