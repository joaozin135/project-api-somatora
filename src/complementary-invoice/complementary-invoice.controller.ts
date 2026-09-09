import { Body, Controller, Get, Post } from '@nestjs/common';
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
}
