export interface IUser {
  id: number;
  email: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserInput {
  email: string;
  password: string;
  name?: string;
  description?: string;
}