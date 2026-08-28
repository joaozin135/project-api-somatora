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
}
