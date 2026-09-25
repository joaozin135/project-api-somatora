import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nome do fornecedor',
    example: 'Fazenda Santa Rita',
  })
  name!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  @IsOptional()
  @ApiProperty({
    description: 'Fazendas do fornecedor (geralmente só uma, mas suporta mais de uma)',
    example: ['Fazenda Santa Rita'],
    required: false,
  })
  farmNames?: string[];

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
