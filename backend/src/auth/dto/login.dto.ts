import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '../types/role.enum';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  credential: string; // username or email

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  activeRole: Role;
}