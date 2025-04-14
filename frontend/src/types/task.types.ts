export enum TaskStage {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface ITask {
  id: number;
  title: string;
  description?: string;
  stage: TaskStage;
  boardId: number;
  spaceId: number;
  assignedToId?: number | null;
  createdAt: string;
  updatedAt: string;
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