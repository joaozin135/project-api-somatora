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
import { SUPPLIER_REPOSITORY } from 'src/supplier/repositories/supplier-repository.interface';
import type { ISupplierRepository } from 'src/supplier/repositories/supplier-repository.interface';
import { FARM_REPOSITORY } from 'src/farm/repositories/farm-repository.interface';
import type { IFarmRepository, Farm } from 'src/farm/repositories/farm-repository.interface';

export function withNetWeight(receipt: Receipt) {
  const trailerNet =
    receipt.trailerGrossWeight !== null && receipt.trailerTareWeight !== null
      ? receipt.trailerGrossWeight - receipt.trailerTareWeight
      : 0;
  return {
    ...receipt,
    netWeight: receipt.grossWeight - receipt.tareWeight + trailerNet,
  };
}

function validateTrailerWeights(input: {
  trailerGrossWeight?: number;
  trailerTareWeight?: number;
  trailerPlate?: string | null;
}) {
  const hasTrailerGross = input.trailerGrossWeight !== undefined;
  const hasTrailerTare = input.trailerTareWeight !== undefined;

  if (hasTrailerGross !== hasTrailerTare) {
    throw new BadRequestException(
      'Informe o peso bruto e o peso vazio da julieta juntos, ou nenhum dos dois.',
    );
  }

  if (hasTrailerGross && hasTrailerTare) {
    if (!input.trailerPlate) {
      throw new BadRequestException(
        'Informe a placa da julieta para registrar o peso dela separadamente.',
      );
    }
    if (input.trailerTareWeight! >= input.trailerGrossWeight!) {
      throw new BadRequestException(
        'O peso vazio da julieta deve ser menor que o peso bruto da julieta.',
      );
    }
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}

@Injectable()
export class ReceiptService {
  constructor(
    @Inject(RECEIPT_REPOSITORY)
    private readonly receiptRepository: IReceiptRepository,
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: IFarmRepository,
  ) {}

  private async resolveActiveSupplier(supplierId: string) {
    const supplier = await this.supplierRepository.findById(supplierId);
    if (!supplier) {
      throw new NotFoundException(
        `Fornecedor com id ${supplierId} não encontrado`,
      );
    }
    if (!supplier.active) {
      throw new BadRequestException(
        `O fornecedor "${supplier.name}" está inativo e não pode ser usado em novas pesagens.`,
      );
    }
    return supplier;
  }

  private async resolveFarm(
    supplierId: string,
    input: { farmId?: string; newFarmName?: string },
  ): Promise<Farm> {
    if (input.farmId && input.newFarmName) {
      throw new BadRequestException(
        'Informe farmId ou newFarmName, não os dois.',
      );
    }

    if (input.farmId) {
      const farm = await this.farmRepository.findById(input.farmId);
      if (!farm) {
        throw new NotFoundException(
          `Fazenda com id ${input.farmId} não encontrada`,
        );
      }
      if (farm.supplierId !== supplierId) {
        throw new BadRequestException(
          'Essa fazenda não pertence ao fornecedor selecionado.',
        );
      }
      return farm;
    }

    if (input.newFarmName) {
      const name = input.newFarmName.trim();
      try {
        return await this.farmRepository.create(supplierId, name);
      } catch (error) {
        if (isUniqueConstraintError(error)) {
          const existing = await this.farmRepository.findBySupplier(supplierId);
          const match = existing.find((f) => f.name === name);
          if (match) return match;
        }
        throw error;
      }
    }

    throw new BadRequestException('Informe a fazenda (farmId ou newFarmName).');
  }

  async create(createReceiptDto: CreateReceiptsDTO) {
    if (createReceiptDto.tareWeight >= createReceiptDto.grossWeight) {
      throw new BadRequestException(
        'O peso vazio deve ser menor que o peso bruto.',
      );
    }

    validateTrailerWeights({
      trailerGrossWeight: createReceiptDto.trailerGrossWeight,
      trailerTareWeight: createReceiptDto.trailerTareWeight,
      trailerPlate: createReceiptDto.trailerPlate,
    });

    const supplier = await this.resolveActiveSupplier(
      createReceiptDto.supplierId,
    );
    const farm = await this.resolveFarm(createReceiptDto.supplierId, {
      farmId: createReceiptDto.farmId,
      newFarmName: createReceiptDto.newFarmName,
    });

    const newReceipt = await this.receiptRepository.create({
      ...createReceiptDto,
      supplierName: supplier.name,
      farmId: farm.id,
      farmName: farm.name,
    });
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
    const existing = await this.findOne(id);

    if (Object.keys(updateReceiptDto).length === 0) {
      throw new BadRequestException(
        'Informe ao menos um campo para atualizar.',
      );
    }

    const effectiveGrossWeight = updateReceiptDto.grossWeight ?? existing.grossWeight;
    const effectiveTareWeight = updateReceiptDto.tareWeight ?? existing.tareWeight;
    if (effectiveTareWeight >= effectiveGrossWeight) {
      throw new BadRequestException(
        'O peso vazio deve ser menor que o peso bruto.',
      );
    }

    validateTrailerWeights({
      trailerGrossWeight: updateReceiptDto.trailerGrossWeight ?? existing.trailerGrossWeight ?? undefined,
      trailerTareWeight: updateReceiptDto.trailerTareWeight ?? existing.trailerTareWeight ?? undefined,
      trailerPlate: updateReceiptDto.trailerPlate ?? existing.trailerPlate ?? undefined,
    });

    const isChangingSupplier =
      updateReceiptDto.supplierId !== undefined &&
      updateReceiptDto.supplierId !== existing.supplierId;

    if (isChangingSupplier && existing.complementaryInvoiceId) {
      throw new BadRequestException(
        'Essa pesagem já está vinculada a uma nota fiscal complementar — não é possível trocar o fornecedor. Se o fornecedor estiver errado, entre em contato com o suporte.',
      );
    }

    const isChangingFarm =
      updateReceiptDto.farmId !== undefined ||
      updateReceiptDto.newFarmName !== undefined;

    if (isChangingSupplier && !isChangingFarm) {
      throw new BadRequestException(
        'Ao trocar o fornecedor, informe também a fazenda (farmId ou newFarmName).',
      );
    }

    let supplierName: string | undefined;
    if (isChangingSupplier) {
      const supplier = await this.resolveActiveSupplier(
        updateReceiptDto.supplierId!,
      );
      supplierName = supplier.name;
    }

    let farmId: string | undefined;
    let farmName: string | undefined;
    if (isChangingFarm) {
      const effectiveSupplierId = updateReceiptDto.supplierId ?? existing.supplierId;
      const farm = await this.resolveFarm(effectiveSupplierId, {
        farmId: updateReceiptDto.farmId,
        newFarmName: updateReceiptDto.newFarmName,
      });
      farmId = farm.id;
      farmName = farm.name;
    }

    const updatedReceipt = await this.receiptRepository.update(id, {
      ...updateReceiptDto,
      supplierName,
      farmId,
      farmName,
    });
    return withNetWeight(updatedReceipt);
  }

  async remove(id: string) {
    const existing = await this.findOne(id);

    if (existing.complementaryInvoiceId) {
      throw new BadRequestException(
        'Essa pesagem já está vinculada a uma nota fiscal complementar — não é possível excluí-la. Se for necessário, entre em contato com o suporte.',
      );
    }

    await this.receiptRepository.remove(id);
  }
}
