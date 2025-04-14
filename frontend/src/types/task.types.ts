import { IBase } from './root.types';

export enum EnumTaskPriority {
  low = 'low',
  medium = 'medium',
  high = 'high'
}

export interface ITaskReponse extends IBase {
  name: string;
  priority?: EnumTaskPriority;
  isCompleted: boolean;
}

//Partial не обязательные поля
export type TypeTaskFormState = Partial<Omit<ITaskReponse, 'id' | 'updated'>>;
