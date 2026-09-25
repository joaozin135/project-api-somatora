import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ISupplierRepository, Supplier, SupplierContactFields } from './supplier-repository.interface';

const includeFarms = {
  farms: { orderBy: { name: 'asc' as const } },
} as const;

@Injectable()
export class SupplierRepository implements ISupplierRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Supplier[]> {
    return this.prisma.supplier.findMany({ orderBy: { name: 'asc' }, include: includeFarms });
  }

  async findById(id: string): Promise<Supplier | null> {
    return this.prisma.supplier.findUnique({ where: { id }, include: includeFarms });
  }

  async findByName(name: string): Promise<Supplier | null> {
    return this.prisma.supplier.findUnique({ where: { name }, include: includeFarms });
  }

  async create(
    input: { name: string; farmNames?: string[] } & SupplierContactFields,
  ): Promise<Supplier> {
    return this.prisma.supplier.create({
      data: {
        name: input.name,
        cnpj: input.cnpj,
        address: input.address,
        phone: input.phone,
        email: input.email,
        ...(input.farmNames &&
          input.farmNames.length > 0 && {
            farms: { create: input.farmNames.map((name) => ({ name })) },
          }),
      },
      include: includeFarms,
    });
  }

  async update(
    id: string,
    input: { name?: string; active?: boolean } & SupplierContactFields,
  ): Promise<Supplier> {
    return this.prisma.supplier.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.active !== undefined && { active: input.active }),
        ...(input.cnpj !== undefined && { cnpj: input.cnpj }),
        ...(input.address !== undefined && { address: input.address }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.email !== undefined && { email: input.email }),
      },
      include: includeFarms,
    });
  }
}
