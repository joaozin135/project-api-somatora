import { Module } from '@nestjs/common';
import { ComplementaryInvoiceController } from './complementary-invoice.controller';
import { ComplementaryInvoiceService } from './complementary-invoice.service';
import { COMPLEMENTARY_INVOICE_REPOSITORY } from './repositories/complementary-invoice-repository.interface';
import { ComplementaryInvoiceRepository } from './repositories/complementary-invoice-repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ReceiptModule } from 'src/receipt/receipt.module';

@Module({
  imports: [PrismaModule, ReceiptModule],
  controllers: [ComplementaryInvoiceController],
  providers: [
    ComplementaryInvoiceService,
    {
      provide: COMPLEMENTARY_INVOICE_REPOSITORY,
      useClass: ComplementaryInvoiceRepository,
    },
  ],
})
export class ComplementaryInvoiceModule {}
