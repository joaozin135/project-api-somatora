import { Body, Controller, Post } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptsDTO } from './dto/create-receipts.dto';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  create(@Body() createReceiptDTO: CreateReceiptsDTO) {
    return this.receiptService.create(createReceiptDTO);
  }
}
