import { IsDateString, IsOptional, IsString } from 'class-validator';

export class AddLiveDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  liveUrl!: string;

  @IsDateString()
  scheduledDate!: Date;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  banner?: string;

  @IsOptional()
  @IsString()
  status?: 'scheduled' | 'live' | 'finished';

  @IsOptional()
  createdAt?: Date;
}
