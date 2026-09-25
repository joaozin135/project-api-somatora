import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFarmDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nome da fazenda',
    example: 'Fazenda Santa Rita',
  })
  name!: string;
}
