import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDTO } from './dto/create-supplier.dto';
import { UpdateSupplierDTO } from './dto/update-supplier.dto';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(@Body() dto: CreateSupplierDTO) {
    return this.supplierService.create(dto);
  }

  @Get()
  findAll() {
    return this.supplierService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSupplierDTO) {
    return this.supplierService.update(id, dto);
  }
}
