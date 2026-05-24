import { IsString, IsOptional } from 'class-validator';

export class AddModuleDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
