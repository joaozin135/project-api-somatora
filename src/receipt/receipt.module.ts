import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { RECEIPT_REPOSITORY } from './repositories/receipt-repository.interface';
import { ReceiptRepository } from './repositories/receipt-repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReceiptController],
  providers: [
    ReceiptService,
    {
      provide: RECEIPT_REPOSITORY,
      useClass: ReceiptRepository,
    },
  ],
})
export class ReceiptModule {}
