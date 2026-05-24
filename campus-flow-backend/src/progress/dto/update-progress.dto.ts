import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProgressDto {
  @IsOptional()
  @IsString()
  currentVideo?: string;

  @IsOptional()
  @IsString()
  currentModule?: string;

  @IsOptional()
  @IsNumber()
  watchedMinutes?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
