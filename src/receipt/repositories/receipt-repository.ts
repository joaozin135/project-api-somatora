import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateReceiptData, IReceiptRepository, Receipt, UpdateReceiptData } from "./receipt-repository.interface";

const includeComplementaryInvoice = {
    complementaryInvoice: true,
} as const;

@Injectable()
export class ReceiptRepository implements IReceiptRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(input: CreateReceiptData): Promise<Receipt> {
        const created = await this.prisma.receipt.create({
            data: {
                invoiceNumber: input.invoiceNumber,
                supplier: input.supplierName,
                supplierId: input.supplierId,
                farm: input.farmName,
                farmId: input.farmId,
                length: input.length,
                type: input.type,
                diameterClass: input.diameterClass,
                truckPlate: input.truckPlate,
                trailerPlate: input.trailerPlate,
                weighedUnit: input.weighedUnit,
                driver: input.driver,
                notes: input.notes,
                grossWeight: input.grossWeight,
                tareWeight: input.tareWeight,
                trailerGrossWeight: input.trailerGrossWeight,
                trailerTareWeight: input.trailerTareWeight,
                invoiceWeight: input.invoiceWeight,
                pricePerTon: input.pricePerTon,
            },
            include: includeComplementaryInvoice,
        });
        return created;
    }

    async findAll(): Promise<Receipt[]> {
        const rows = await this.prisma.receipt.findMany({
            include: includeComplementaryInvoice,
            orderBy: { createdAt: "desc" },
        });
        return rows;
    }

    async findById(id: string): Promise<Receipt | null> {
        const row = await this.prisma.receipt.findUnique({
            where: {
                id,
            },
            include: includeComplementaryInvoice,
        });
        return row;
    }

    async findByIds(ids: string[]): Promise<Receipt[]> {
        const rows = await this.prisma.receipt.findMany({
            where: {
                id: { in: ids },
            },
            include: includeComplementaryInvoice,
        });
        return rows;
    }

    async update(id: string, input: UpdateReceiptData): Promise<Receipt> {
        const updated = await this.prisma.receipt.update({
            where: {
                id,
            },
            data: {
                ...(input.invoiceNumber !== undefined && { invoiceNumber: input.invoiceNumber }),
                ...(input.supplierId !== undefined && {
                    supplierId: input.supplierId,
                    supplier: input.supplierName,
                }),
                ...(input.farmId !== undefined && {
                    farmId: input.farmId,
                    farm: input.farmName,
                }),
                ...(input.length !== undefined && { length: input.length }),
                ...(input.type !== undefined && { type: input.type }),
                ...(input.diameterClass !== undefined && { diameterClass: input.diameterClass }),
                ...(input.truckPlate !== undefined && { truckPlate: input.truckPlate }),
                ...(input.trailerPlate !== undefined && { trailerPlate: input.trailerPlate }),
                ...(input.weighedUnit !== undefined && { weighedUnit: input.weighedUnit }),
                ...(input.driver !== undefined && { driver: input.driver }),
                ...(input.notes !== undefined && { notes: input.notes }),
                ...(input.grossWeight !== undefined && { grossWeight: input.grossWeight }),
                ...(input.tareWeight !== undefined && { tareWeight: input.tareWeight }),
                ...(input.trailerGrossWeight !== undefined && { trailerGrossWeight: input.trailerGrossWeight }),
                ...(input.trailerTareWeight !== undefined && { trailerTareWeight: input.trailerTareWeight }),
                ...(input.invoiceWeight !== undefined && { invoiceWeight: input.invoiceWeight }),
                ...(input.pricePerTon !== undefined && { pricePerTon: input.pricePerTon }),
            },
            include: includeComplementaryInvoice,
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

    async unlinkComplementaryInvoice(id: string): Promise<Receipt> {
        const updated = await this.prisma.receipt.update({
            where: {
                id,
            },
            data: {
                complementaryInvoiceId: null,
            },
            include: includeComplementaryInvoice,
        });
        return updated;
    }

    async countByComplementaryInvoiceId(complementaryInvoiceId: string): Promise<number> {
        return this.prisma.receipt.count({
            where: {
                complementaryInvoiceId,
            },
        });
    }
}
