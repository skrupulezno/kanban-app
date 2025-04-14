import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  spaceId: number;
}
