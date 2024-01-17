import { IsString, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MaxLength(25)
  firstName!: string;

  @IsString()
  @MaxLength(25)
  lastName!: string;

  @IsString()
  @MaxLength(50)
  email!: string;

  @IsString()
  @MaxLength(100)
  password!: string;
}
