import { IsEmail, 
  IsString, 
  IsStrongPassword,
  MinLength,
  IsEnum, 
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/generated/prisma/browser';

export class CreateUserDTO {
  @IsString({ message: 'Nome é obrigatório' })
  @MinLength(2)
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João da Silva',
  })
  name!: string;
  @IsEmail()
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao.silva@example.com',
  })
  email!: string;
  @IsStrongPassword({
    minLength: 8,
  })
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'SenhaForte123!',
  })
  password!: string;
  @IsEnum(Role)
  @ApiProperty ({
    description: 'Tipo de acesso do usuário',
    example: 'ADMIN',
  })
  role!: Role;
}
