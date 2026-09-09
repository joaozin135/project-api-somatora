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
                invoiceNumber: input.invoiceNumber,
                supplier: input.supplier,
                farm: input.farm,
                length: input.length,
                type: input.type,
                diameterClass: input.diameterClass,
                truckPlate: input.truckPlate,
                trailerPlate: input.trailerPlate,
                driver: input.driver,
                notes: input.notes,
                grossWeight: input.grossWeight,
                tareWeight: input.tareWeight,
            },
        });
        return created;
    }

    async findAll(): Promise<Receipt[]> {
        const rows = await this.prisma.receipt.findMany({
            orderBy: { createdAt: "desc" },
        });
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
                ...(input.invoiceNumber !== undefined && { invoiceNumber: input.invoiceNumber }),
                ...(input.supplier !== undefined && { supplier: input.supplier }),
                ...(input.farm !== undefined && { farm: input.farm }),
                ...(input.length !== undefined && { length: input.length }),
                ...(input.type !== undefined && { type: input.type }),
                ...(input.diameterClass !== undefined && { diameterClass: input.diameterClass }),
                ...(input.truckPlate !== undefined && { truckPlate: input.truckPlate }),
                ...(input.trailerPlate !== undefined && { trailerPlate: input.trailerPlate }),
                ...(input.driver !== undefined && { driver: input.driver }),
                ...(input.notes !== undefined && { notes: input.notes }),
                ...(input.grossWeight !== undefined && { grossWeight: input.grossWeight }),
                ...(input.tareWeight !== undefined && { tareWeight: input.tareWeight }),
            },
        });
        return updated;
    }

    async remove(id: string): Promise<void> {
        await this.prisma.receipt.delete({
            where: {
                id,
            },
        });
    }
}
