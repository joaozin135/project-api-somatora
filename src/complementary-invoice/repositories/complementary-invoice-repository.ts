import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ComplementaryInvoice,
  IComplementaryInvoiceRepository,
} from './complementary-invoice-repository.interface';

@Injectable()
export class ComplementaryInvoiceRepository
  implements IComplementaryInvoiceRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ComplementaryInvoice[]> {
    return this.prisma.complementaryInvoice.findMany({
      orderBy: { issueDate: 'desc' },
    });
  }

  async findById(id: string): Promise<ComplementaryInvoice | null> {
    return this.prisma.complementaryInvoice.findUnique({ where: { id } });
  }

  async createAndLinkReceipts(input: {
    number: string;
    supplier: string;
    totalWeight: number;
    receiptIds: string[];
  }): Promise<ComplementaryInvoice> {
    return this.prisma.$transaction(async (tx) => {
      const invoice = await tx.complementaryInvoice.create({
        data: {
          number: input.number,
          supplier: input.supplier,
          totalWeight: input.totalWeight,
        },
      });

      await tx.receipt.updateMany({
        where: { id: { in: input.receiptIds } },
        data: { complementaryInvoiceId: invoice.id },
      });

      return invoice;
    });
  }
}
