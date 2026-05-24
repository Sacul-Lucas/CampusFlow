import { IsDateString, IsString } from 'class-validator';

export class AddLiveDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  liveUrl!: string;

  @IsDateString()
  scheduledDate!: Date;
}
