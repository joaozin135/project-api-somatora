import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UserPublic } from './user-repository.interface';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { Role } from 'src/generated/prisma/enums';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateUserDTO): Promise<UserPublic> {
    const created = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role,
      },
    });
    return this.toWithoutPasswordUser(created);
  }

  async findById(id: string): Promise<UserPublic | null> {
    const row = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!row) return null;
    return this.toWithoutPasswordUser(row);
  }

  async findByEmail(email: string): Promise<UserPublic | null> {
    const row = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!row) return null;
    return this.toWithoutPasswordUser(row);
  }

  async findAllWithoutPassword(): Promise<UserPublic[]> {
    const rows = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return rows.map(this.toWithoutPasswordUser);
  }

  async update(id: string, input: UpdateUserDTO): Promise<UserPublic> {
    const row = await this.prisma.user.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.password !== undefined && { password: input.password }),
        ...(input.role !== undefined && { role: input.role }),
      },
    });
    return this.toWithoutPasswordUser(row);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private toWithoutPasswordUser(row: {
    id: string;
    name: string;
    email: string;
    role: string;
  }): UserPublic {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role as Role,
    };
  }
}
