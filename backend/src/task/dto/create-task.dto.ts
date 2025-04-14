import { IsString, IsOptional, IsInt, IsEnum } from 'class-validator';
import { TaskStage } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStage)
  stage?: TaskStage;

  @IsInt()
  boardId: number;

  @IsOptional()
  @IsInt()
  userId?: number;
}
