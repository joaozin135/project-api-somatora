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
        description: 'Id do fornecedor cadastrado',
        example: 'b3f1c2a4-...'
    })
    supplierId!: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Id de uma fazenda já cadastrada para o fornecedor. Informe este OU newFarmName.',
        example: 'b3f1c2a4-...',
        required: false
    })
    farmId?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Nome de uma fazenda nova, ainda não cadastrada para o fornecedor — será criada e vinculada automaticamente. Informe este OU farmId.',
        example: 'Fazenda Santa Rita',
        required: false
    })
    newFarmName?: string;

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
        description: 'Peso vazio (tara) em kg — do cavalo, quando a julieta é pesada separadamente',
        example: 15000
    })
    tareWeight!: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({
        description: 'Peso bruto da julieta em kg, quando pesada separadamente do cavalo. Informe junto com trailerTareWeight.',
        example: 18000,
        required: false
    })
    trailerGrossWeight?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({
        description: 'Peso vazio (tara) da julieta em kg, quando pesada separadamente do cavalo. Informe junto com trailerGrossWeight.',
        example: 8000,
        required: false
    })
    trailerTareWeight?: number;

    @IsNumber()
    @IsPositive()
    @ApiProperty({
        description: 'Peso (tonelada) declarado na nota fiscal do fornecedor, em kg',
        example: 30000
    })
    invoiceWeight!: number;

    @IsNumber()
    @IsPositive()
    @ApiProperty({
        description: 'Valor por tonelada informado na nota fiscal, em R$',
        example: 250.5
    })
    pricePerTon!: number;
}
