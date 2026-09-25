import { Module } from '@nestjs/common';
import { FarmController, SupplierFarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { FARM_REPOSITORY } from './repositories/farm-repository.interface';
import { FarmRepository } from './repositories/farm-repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupplierModule } from 'src/supplier/supplier.module';

@Module({
  imports: [PrismaModule, SupplierModule],
  controllers: [SupplierFarmController, FarmController],
  providers: [
    FarmService,
    {
      provide: FARM_REPOSITORY,
      useClass: FarmRepository,
    },
  ],
  exports: [FARM_REPOSITORY],
})
export class FarmModule {}
