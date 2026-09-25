import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ComplementaryInvoiceService } from './complementary-invoice.service';
import { CreateComplementaryInvoiceDTO } from './dto/create-complementary-invoice.dto';

@Controller('complementary-invoice')
export class ComplementaryInvoiceController {
  constructor(
    private readonly complementaryInvoiceService: ComplementaryInvoiceService,
  ) {}

  @Post()
  create(@Body() dto: CreateComplementaryInvoiceDTO) {
    return this.complementaryInvoiceService.create(dto);
  }

  @Get()
  findAll() {
    return this.complementaryInvoiceService.findAll();
  }

  @Delete('receipt/:receiptId')
  unlinkReceipt(@Param('receiptId') receiptId: string) {
    return this.complementaryInvoiceService.unlinkReceipt(receiptId);
  }
}
