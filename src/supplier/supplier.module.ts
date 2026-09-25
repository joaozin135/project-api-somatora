import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { SUPPLIER_REPOSITORY } from './repositories/supplier-repository.interface';
import { SupplierRepository } from './repositories/supplier-repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SupplierController],
  providers: [
    SupplierService,
    {
      provide: SUPPLIER_REPOSITORY,
      useClass: SupplierRepository,
    },
  ],
  exports: [SUPPLIER_REPOSITORY],
})
export class SupplierModule {}
