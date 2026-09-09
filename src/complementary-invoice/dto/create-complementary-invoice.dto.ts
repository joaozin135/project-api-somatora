import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNumber, IsPositive, IsString, IsNotEmpty } from 'class-validator';

export class CreateComplementaryInvoiceDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Número da nota fiscal complementar',
    example: '7890',
  })
  number!: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Peso total (kg) coberto por esta nota fiscal complementar',
    example: 4500,
  })
  totalWeight!: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ApiProperty({
    description: 'IDs das pesagens (recebimentos) que esta nota fiscal complementar está cobrindo. Todas devem ser do mesmo fornecedor e ainda não estar vinculadas a outra complementar.',
    example: ['b3f1c2...', 'a91d44...'],
  })
  receiptIds!: string[];
}
