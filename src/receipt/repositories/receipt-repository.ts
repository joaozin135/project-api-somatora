import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateReceiptsDTO } from "../dto/create-receipts.dto";
import { IReceiptRepository, Receipt } from "./receipt-repository.interface";

@Injectable()
export class ReceiptRepository implements IReceiptRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(input: CreateReceiptsDTO): Promise<Receipt> {
        const created = await this.prisma.receipt.create({
            data: {
                type: input.type,
                diameterClass: input.diameterClass,
            },
        });
        return created;
    }

    async findAll(): Promise<Receipt[]> {
        const rows = await this.prisma.receipt.findMany();
        return rows;
    }

    async findById(id: string): Promise<Receipt | null> {
        const row = await this.prisma.receipt.findUnique({
            where: {
                id,
            },
        });
        return row;
    }

    async update(id: string, input: Partial<CreateReceiptsDTO>): Promise<Receipt> {
        const updated = await this.prisma.receipt.update({
            where: {
                id,
            },
            data: {
                ...(input.type !== undefined && { type: input.type }),
                ...(input.diameterClass !== undefined && { diameterClass: input.diameterClass }),
            },
        });
        return updated;
    }

    async remove(id: string): Promise<void> {
        const deleted = await this.prisma.receipt.delete({
            where: {
                id,
            },
        });
    }
}
