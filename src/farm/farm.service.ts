import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFarmDTO } from './dto/create-farm.dto';
import { FARM_REPOSITORY } from './repositories/farm-repository.interface';
import type { IFarmRepository } from './repositories/farm-repository.interface';
import { SUPPLIER_REPOSITORY } from 'src/supplier/repositories/supplier-repository.interface';
import type { ISupplierRepository } from 'src/supplier/repositories/supplier-repository.interface';

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}

@Injectable()
export class FarmService {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: IFarmRepository,
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async create(supplierId: string, dto: CreateFarmDTO) {
    const supplier = await this.supplierRepository.findById(supplierId);
    if (!supplier) {
      throw new NotFoundException(
        `Fornecedor com id ${supplierId} não encontrado`,
      );
    }

    try {
      return await this.farmRepository.create(supplierId, dto.name);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(
          `O fornecedor "${supplier.name}" já tem uma fazenda cadastrada como "${dto.name}".`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    const farm = await this.farmRepository.findById(id);
    if (!farm) {
      throw new NotFoundException(`Fazenda com id ${id} não encontrada`);
    }

    const receiptsCount = await this.farmRepository.countReceipts(id);
    if (receiptsCount > 0) {
      throw new ConflictException(
        `A fazenda "${farm.name}" já está sendo usada em pesagens e não pode ser removida.`,
      );
    }

    await this.farmRepository.remove(id);
  }
}
