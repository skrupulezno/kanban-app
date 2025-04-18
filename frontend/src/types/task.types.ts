export enum TaskStage {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface ITask {
  id: number;
  title: string;
  description?: string; // <-- оставить так
  stage: 'TODO' | 'IN_PROGRESS' | 'DONE';
  boardId: number;
  spaceId?: number; // если нужно
}
export interface ITaskInput {
  title: string;
  description?: string;
  stage?: TaskStage;
  boardId: number;
  spaceId: number;
  assignedToId?: number;
}

export interface ITaskUpdate {
  title?: string;
  description?: string;
  stage?: TaskStage;
  assignedToId?: number;
}

export interface ITaskFilter {
  stage?: TaskStage;
  boardId?: number;
  spaceId?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}