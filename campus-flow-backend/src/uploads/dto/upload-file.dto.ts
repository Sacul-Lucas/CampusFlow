import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsOptional()
  destination!: string;

  // Additional metadata if needed
}
