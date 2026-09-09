import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateComplementaryInvoiceDTO } from './dto/create-complementary-invoice.dto';
import { COMPLEMENTARY_INVOICE_REPOSITORY } from './repositories/complementary-invoice-repository.interface';
import type { IComplementaryInvoiceRepository } from './repositories/complementary-invoice-repository.interface';
import { RECEIPT_REPOSITORY } from 'src/receipt/repositories/receipt-repository.interface';
import type { IReceiptRepository } from 'src/receipt/repositories/receipt-repository.interface';

@Injectable()
export class ComplementaryInvoiceService {
  constructor(
    @Inject(COMPLEMENTARY_INVOICE_REPOSITORY)
    private readonly complementaryInvoiceRepository: IComplementaryInvoiceRepository,
    @Inject(RECEIPT_REPOSITORY)
    private readonly receiptRepository: IReceiptRepository,
  ) {}

  async create(dto: CreateComplementaryInvoiceDTO) {
    const uniqueReceiptIds = Array.from(new Set(dto.receiptIds));
    const receipts = await this.receiptRepository.findByIds(uniqueReceiptIds);

    if (receipts.length !== uniqueReceiptIds.length) {
      throw new BadRequestException(
        'Uma ou mais pesagens informadas não foram encontradas.',
      );
    }

    const alreadyLinked = receipts.filter((r) => r.complementaryInvoiceId);
    if (alreadyLinked.length > 0) {
      throw new BadRequestException(
        `As pesagens ${alreadyLinked.map((r) => r.invoiceNumber).join(', ')} já estão vinculadas a outra nota fiscal complementar.`,
      );
    }

    const suppliers = new Set(receipts.map((r) => r.supplier));
    if (suppliers.size > 1) {
      throw new BadRequestException(
        'Todas as pesagens de uma nota fiscal complementar devem ser do mesmo fornecedor.',
      );
    }

    const [supplier] = suppliers;

    return this.complementaryInvoiceRepository.createAndLinkReceipts({
      number: dto.number,
      supplier,
      totalWeight: dto.totalWeight,
      receiptIds: uniqueReceiptIds,
    });
  }

  async findAll() {
    return this.complementaryInvoiceRepository.findAll();
  }
}
