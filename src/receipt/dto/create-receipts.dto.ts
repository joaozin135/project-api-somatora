import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { DiameterClass, ReceiptType } from "src/generated/prisma/enums";

export class CreateReceiptsDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Número da nota fiscal',
        example: '123456'
    })
    invoiceNumber!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Fornecedor',
        example: 'Fazenda Santa Rita'
    })
    supplier!: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Fazenda de origem da madeira',
        example: 'Fazenda Santa Rita'
    })
    farm!: string;

    @IsNumber()
    @IsPositive()
    @ApiProperty({
        description: 'Comprimento da tora em metros',
        example: 2.2
    })
    length!: number;

    @IsEnum(ReceiptType)
    @ApiProperty({
        description: 'Classe da Tora',
        example: 'PE'
    })
    type!: ReceiptType;

    @IsEnum(DiameterClass)
    @ApiProperty({
        description: 'Classe do Diâmetro',
        example: 'FROM_18_TO_24'
    })
    diameterClass!: DiameterClass;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Placa do cavalo',
        example: 'ABC1D23'
    })
    truckPlate!: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Placa da julieta (quando houver bitrem)',
        example: 'XYZ9A87',
        required: false
    })
    trailerPlate?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Nome do motorista',
        example: 'João da Silva'
    })
    driver!: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Observações sobre a carga',
        required: false
    })
    notes?: string;

    @IsNumber()
    @IsPositive()
    @ApiProperty({
        description: 'Peso bruto em kg',
        example: 32000
    })
    grossWeight!: number;

    @IsNumber()
    @IsPositive()
    @ApiProperty({
        description: 'Peso vazio (tara) em kg',
        example: 15000
    })
    tareWeight!: number;
}
