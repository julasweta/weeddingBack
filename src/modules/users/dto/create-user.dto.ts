// create-user.dto.ts
import { Role } from '@prisma/client';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  role?: Role; // М ожливо, ти хочеш додати роль користувача
  @IsOptional()
  isConfirmed?: boolean; // Додаткове поле для підтвердження користувача
}
