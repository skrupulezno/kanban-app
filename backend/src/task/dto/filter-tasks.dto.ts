import { IsOptional, IsEnum, IsInt, IsString } from 'class-validator';
import { TaskStage } from '@prisma/client';

export class FilterTasksDto {
  @IsOptional() @IsEnum(TaskStage) stage?: TaskStage;
  @IsOptional() @IsInt() spaceId?: number;
  @IsOptional() @IsInt() boardId?: number;
  @IsOptional() @IsInt() page?: number;
  @IsOptional() @IsInt() pageSize?: number;
  @IsOptional() @IsString() sortBy?: string;
  @IsOptional() @IsString() order?: 'asc' | 'desc';
}