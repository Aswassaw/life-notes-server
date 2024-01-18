import { IsArray, IsString, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MaxLength(50)
  title!: string;

  @IsString()
  @MaxLength(2000)
  content!: string;

  @IsArray()
  tags!: string[];
}
