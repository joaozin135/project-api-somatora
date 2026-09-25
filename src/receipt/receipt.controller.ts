import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { CreateReceiptsDTO } from './dto/create-receipts.dto';
import { UpdateReceiptsDTO } from './dto/update-receipts.dto';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReceiptDTO: UpdateReceiptsDTO) {
    return this.receiptService.update(id, updateReceiptDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.receiptService.remove(id);
  }
}
