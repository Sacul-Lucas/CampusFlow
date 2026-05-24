import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title!: string;

  @IsString()
  shortDescription!: string;

  @IsString()
  fullDescription!: string;

  @IsString()
  thumbnail!: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsString()
  category!: string;

  @IsString()
  level!: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
