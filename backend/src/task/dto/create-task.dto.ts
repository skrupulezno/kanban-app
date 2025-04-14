import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';

export enum TaskStage {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  // Пользователь, который назначен как исполнитель:
  @IsOptional()
  @IsInt()
  assignedToId?: number;

  @IsInt()
  spaceId: number;

  @IsInt()
  boardId: number;

  @IsOptional()
  @IsEnum(TaskStage)
  stage?: TaskStage;
}