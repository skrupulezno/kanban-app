export interface IBoard {
  id: number;
  name: string;
  description?: string;
  spaceId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IBoardInput {
  name: string;
  description?: string;
  spaceId: number;
}