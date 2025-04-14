import { IsString, IsOptional } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
