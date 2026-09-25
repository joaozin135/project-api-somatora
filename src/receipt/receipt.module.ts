import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { RECEIPT_REPOSITORY } from './repositories/receipt-repository.interface';
import { ReceiptRepository } from './repositories/receipt-repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { FarmModule } from 'src/farm/farm.module';

@Module({
  imports: [PrismaModule, SupplierModule, FarmModule],
  controllers: [ReceiptController],
  providers: [
    ReceiptService,
    {
      provide: RECEIPT_REPOSITORY,
      useClass: ReceiptRepository,
    },
  ],
  exports: [RECEIPT_REPOSITORY],
})
export class ReceiptModule {}
