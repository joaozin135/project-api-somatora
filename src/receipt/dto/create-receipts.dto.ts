import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { DiameterClass, ReceiptType } from "src/generated/prisma/enums";

export class CreateReceiptsDTO {
    @IsEnum(ReceiptType)
    @ApiProperty({
        description: 'Classe da Tora',
        example: 'Pé'
    })
    type!: ReceiptType;
    @IsEnum(DiameterClass)
    @ApiProperty({
        description: 'Classe do Diâmetro',
        example: '18 a 24'
    })
    diameterClass!: DiameterClass;

}