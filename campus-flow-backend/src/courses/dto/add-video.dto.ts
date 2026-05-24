import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class AddVideoDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  videoUrl!: string;

  @IsNumber()
  durationInMinutes!: number;

  @IsBoolean()
  isPreview!: boolean;
}
