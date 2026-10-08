import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { DiameterClass, ReceiptType, WeighedUnit } from "src/generated/prisma/enums";

export class CreateReceiptsDTO {
    @IsDateString()
    @IsOptional()
    @ApiProperty({
        description: 'Data/hora da pesagem (ISO 8601). Permite lançar pesagens retroativas; não pode ser futura. Se omitida, usa o instante do cadastro.',
        example: '2026-10-07T15:00:00.000Z',
        required: false
    })
    createdAt?: string;

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

    @IsEnum(WeighedUnit)
    @ApiProperty({
        description: 'O que foi pesado: TRUCK_AND_TRAILER (cavalo + julieta, mesma classe), TRUCK (só o cavalo) ou TRAILER (só a julieta). Em TRAILER, grossWeight/tareWeight são os pesos da julieta.',
        enum: WeighedUnit,
        example: 'TRUCK_AND_TRAILER'
    })
    weighedUnit!: WeighedUnit;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Placa do cavalo. Obrigatória em TRUCK e TRUCK_AND_TRAILER; opcional em TRAILER.',
        example: 'ABC1D23',
        required: false,
        nullable: true
    })
    truckPlate?: string | null;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: 'Placa da julieta. Obrigatória em TRAILER e TRUCK_AND_TRAILER.',
        example: 'XYZ9A87',
        required: false,
        nullable: true
    })
    trailerPlate?: string | null;

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
        description: 'Peso bruto em kg — do cavalo em TRUCK/TRUCK_AND_TRAILER, da julieta em TRAILER',
        example: 32000
    })
    grossWeight!: number;

    @IsNumber()
    @IsPositive()
    @ApiProperty({
        description: 'Peso vazio (tara) em kg — do cavalo em TRUCK/TRUCK_AND_TRAILER, da julieta em TRAILER',
        example: 15000
    })
    tareWeight!: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({
        description: 'Peso bruto da julieta em kg. Só em TRUCK_AND_TRAILER, junto com trailerTareWeight.',
        example: 18000,
        required: false
    })
    trailerGrossWeight?: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @ApiProperty({
        description: 'Peso vazio (tara) da julieta em kg. Só em TRUCK_AND_TRAILER, junto com trailerGrossWeight.',
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
