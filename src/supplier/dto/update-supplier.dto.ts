import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSupplierDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    description: 'Nome do fornecedor',
    example: 'Fazenda Santa Rita',
    required: false,
  })
  name?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Se o fornecedor está ativo (aparece na seleção de novas pesagens)',
    required: false,
  })
  active?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'CNPJ do fornecedor',
    example: '12.345.678/0001-90',
    required: false,
  })
  cnpj?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Endereço do fornecedor',
    required: false,
  })
  address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Telefone de contato',
    example: '(11) 91234-5678',
    required: false,
  })
  phone?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'E-mail de contato',
    example: 'contato@fazenda.com.br',
    required: false,
  })
  email?: string;
}
