import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';
import { TaskStage } from '@prisma/client';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStage)
  stage?: TaskStage;

  // Возможна смена привязки к доске
  @IsOptional()
  @IsInt()
  boardId?: number;

  @IsOptional()
  @IsInt()
  userId?: number;
}
