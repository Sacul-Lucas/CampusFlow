import { IsArray, IsBoolean, IsOptional, IsString, IsUrl, Matches } from 'class-validator';

const YOUTUBE_SHORTS_REGEX = /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[A-Za-z0-9_-]+(\?.*)?$/i;

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

  @IsOptional()
  @IsBoolean()
  published?: boolean;

  @IsOptional()
  @IsBoolean()
  hasCertificate?: boolean;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'O shortUrl deve ser uma URL válida' })
  @Matches(YOUTUBE_SHORTS_REGEX, {
    message: 'O shortUrl deve ser um link de YouTube Shorts',
  })
  shortUrl?: string;
}
