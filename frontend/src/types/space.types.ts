export interface ISpace {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISpaceInput {
  name: string;
  description?: string;
}