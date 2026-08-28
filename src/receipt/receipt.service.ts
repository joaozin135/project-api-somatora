import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReceiptsDTO } from './dto/create-receipts.dto';
import { RECEIPT_REPOSITORY } from './repositories/receipt-repository.interface';
import type { IReceiptRepository } from './repositories/receipt-repository.interface';
import { UpdateReceiptsDTO } from './dto/update-receipts.dto';

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

  async findAll() {
    return this.receiptRepository.findAll();
  }

  async findOne(id: string) {
    const receipt = await this.receiptRepository.findById(id);
    if (!receipt)
      throw new NotFoundException(`Recebimento com id ${id} não encontrado`);
    return receipt;
  }

  async update(id: string, { type, diameterClass }: UpdateReceiptsDTO) {
    await this.findOne(id);

    if (type === undefined && diameterClass === undefined) {
      throw new BadRequestException(
        'Informe ao menos um campo para atualizar.',
      );
    }

    if (type !== undefined) {
      const updatedReceipt = await this.receiptRepository.update(id, {
        type,
      });
    }

    if (diameterClass !== undefined) {
      const updatedReceipt = await this.receiptRepository.update(id, {
        diameterClass,
      });
    }
  }

  async remove(id: string){
    await this.receiptRepository.remove(id);
  }


}
