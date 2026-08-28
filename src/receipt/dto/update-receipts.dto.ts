import { PartialType } from '@nestjs/swagger';
import { CreateReceiptsDTO } from './create-receipts.dto';

export class UpdateReceiptsDTO extends PartialType(CreateReceiptsDTO) {}
