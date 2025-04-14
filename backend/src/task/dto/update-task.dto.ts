import { IsString, IsOptional, IsEnum, IsInt } from 'class-validator';
import { TaskStage } from '@prisma/client';

export class UpdateTaskDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(TaskStage) stage?: TaskStage;
  @IsOptional() @IsInt() assignedToId?: number;
}