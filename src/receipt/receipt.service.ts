import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReceiptsDTO } from './dto/create-receipts.dto';
import { RECEIPT_REPOSITORY } from './repositories/receipt-repository.interface';
import type { IReceiptRepository, Receipt } from './repositories/receipt-repository.interface';
import { UpdateReceiptsDTO } from './dto/update-receipts.dto';

function withNetWeight(receipt: Receipt) {
  return {
    ...receipt,
    netWeight: receipt.grossWeight - receipt.tareWeight,
  };
}

@Injectable()
export class ReceiptService {
  constructor(
    @Inject(RECEIPT_REPOSITORY)
    private readonly receiptRepository: IReceiptRepository,
  ) {}

  async create(createReceiptDto: CreateReceiptsDTO) {
    if (createReceiptDto.tareWeight >= createReceiptDto.grossWeight) {
      throw new BadRequestException(
        'O peso vazio deve ser menor que o peso bruto.',
      );
    }

    const newReceipt = await this.receiptRepository.create(createReceiptDto);
    return withNetWeight(newReceipt);
  }

  async findAll() {
    const receipts = await this.receiptRepository.findAll();
    return receipts.map(withNetWeight);
  }

  async findOne(id: string) {
    const receipt = await this.receiptRepository.findById(id);
    if (!receipt)
      throw new NotFoundException(`Recebimento com id ${id} não encontrado`);
    return withNetWeight(receipt);
  }

  async update(id: string, updateReceiptDto: UpdateReceiptsDTO) {
    await this.findOne(id);

    if (Object.keys(updateReceiptDto).length === 0) {
      throw new BadRequestException(
        'Informe ao menos um campo para atualizar.',
      );
    }

    const { grossWeight, tareWeight } = updateReceiptDto;
    if (
      grossWeight !== undefined &&
      tareWeight !== undefined &&
      tareWeight >= grossWeight
    ) {
      throw new BadRequestException(
        'O peso vazio deve ser menor que o peso bruto.',
      );
    }

    const updatedReceipt = await this.receiptRepository.update(
      id,
      updateReceiptDto,
    );
    return withNetWeight(updatedReceipt);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.receiptRepository.remove(id);
  }
}
