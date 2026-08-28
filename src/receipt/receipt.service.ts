import { Inject, Injectable } from '@nestjs/common';
import { CreateReceiptsDTO } from './dto/create-receipts.dto';
import { RECEIPT_REPOSITORY } from './repositories/receipt-repository.interface';
import type { IReceiptRepository } from './repositories/receipt-repository.interface';
 
@Injectable()
export class ReceiptService {
  constructor(
    @Inject(RECEIPT_REPOSITORY)
    private readonly receiptRepository: IReceiptRepository,
  ) {}

  async create(createReceiptDto: CreateReceiptsDTO) {
    const newReceipt = await this.receiptRepository.create({
      type: createReceiptDto.type,
      diameterClass: createReceiptDto.diameterClass,
    });
    return newReceipt;
  }
}
