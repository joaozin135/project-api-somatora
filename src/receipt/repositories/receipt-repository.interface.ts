import { DiameterClass, ReceiptType } from 'src/generated/prisma/enums';
import { CreateReceiptsDTO } from '../dto/create-receipts.dto';
import { UpdateReceiptsDTO } from '../dto/update-receipts.dto';

export const RECEIPT_REPOSITORY = Symbol('RECEIPT_REPOSITORY');

export type Receipt = {
  id: string;
  invoiceNumber: string;
  supplier: string;
  farm: string;
  length: number;
  type: ReceiptType;
  diameterClass: DiameterClass;
  truckPlate: string;
  trailerPlate: string | null;
  driver: string;
  notes: string | null;
  grossWeight: number;
  tareWeight: number;
  createdAt: Date;
};

export interface IReceiptRepository {
  findById(id: string): Promise<Receipt | null>;
  findAll(): Promise<Receipt[]>;
  create(input: CreateReceiptsDTO): Promise<Receipt>;
  update(id: string, input: UpdateReceiptsDTO): Promise<Receipt>;
  remove(id: string): Promise<void>;
}
