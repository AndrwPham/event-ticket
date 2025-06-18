import { IsString, IsNotEmpty, IsEnum, IsEmail, MinLength } from 'class-validator';
import { Role } from '../types/role.enum';

export class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(4) @IsNotEmpty() username: string;
  @IsString() @MinLength(6) @IsNotEmpty() password: string;
}