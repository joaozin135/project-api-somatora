import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptsDTO } from './dto/create-receipts.dto';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  create(@Body() createReceiptDTO: CreateReceiptsDTO) {
    return this.receiptService.create(createReceiptDTO);
  }

  @Get()
  findAll() {
    return this.receiptService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.receiptService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receiptService.remove(id);
  }
}
