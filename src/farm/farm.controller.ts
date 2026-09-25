import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDTO } from './dto/create-farm.dto';

@Controller('supplier/:supplierId/farm')
export class SupplierFarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  create(@Param('supplierId') supplierId: string, @Body() dto: CreateFarmDTO) {
    return this.farmService.create(supplierId, dto);
  }
}

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmService.remove(id);
  }
}
