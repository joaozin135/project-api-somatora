import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDTO } from './dto/create-supplier.dto';
import { UpdateSupplierDTO } from './dto/update-supplier.dto';
import { SUPPLIER_REPOSITORY } from './repositories/supplier-repository.interface';
import type { ISupplierRepository } from './repositories/supplier-repository.interface';

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  );
}

@Injectable()
export class SupplierService {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async findAll() {
    return this.supplierRepository.findAll();
  }

  async findOne(id: string) {
    const supplier = await this.supplierRepository.findById(id);
    if (!supplier)
      throw new NotFoundException(`Fornecedor com id ${id} não encontrado`);
    return supplier;
  }

  async create(dto: CreateSupplierDTO) {
    const farmNames = Array.from(
      new Set((dto.farmNames ?? []).map((name) => name.trim()).filter(Boolean)),
    );

    try {
      return await this.supplierRepository.create({ ...dto, farmNames });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(
          `Já existe um fornecedor cadastrado como "${dto.name}".`,
        );
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateSupplierDTO) {
    await this.findOne(id);

    try {
      return await this.supplierRepository.update(id, dto);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException(
          `Já existe um fornecedor cadastrado como "${dto.name}".`,
        );
      }
      throw error;
    }
  }
}
