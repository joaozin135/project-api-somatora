import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Farm, IFarmRepository } from './farm-repository.interface';

@Injectable()
export class FarmRepository implements IFarmRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Farm | null> {
    return this.prisma.farm.findUnique({ where: { id } });
  }

  async findBySupplier(supplierId: string): Promise<Farm[]> {
    return this.prisma.farm.findMany({ where: { supplierId }, orderBy: { name: 'asc' } });
  }

  async create(supplierId: string, name: string): Promise<Farm> {
    return this.prisma.farm.create({ data: { supplierId, name } });
  }

  async countReceipts(farmId: string): Promise<number> {
    return this.prisma.receipt.count({ where: { farmId } });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.farm.delete({ where: { id } });
  }
}
