import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { TaskStage } from '@prisma/client';

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