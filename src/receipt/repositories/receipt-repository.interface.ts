import { DiameterClass, ReceiptType, WeighedUnit } from 'src/generated/prisma/enums';
import { CreateReceiptsDTO } from '../dto/create-receipts.dto';
import { UpdateReceiptsDTO } from '../dto/update-receipts.dto';

export const RECEIPT_REPOSITORY = Symbol('RECEIPT_REPOSITORY');

export type ComplementaryInvoiceSummary = {
  id: string;
  number: string;
  supplier: string;
  totalWeight: number;
  issueDate: Date;
};

export type Receipt = {
  id: string;
  invoiceNumber: string;
  supplier: string;
  supplierId: string;
  farm: string;
  farmId: string;
  length: number;
  type: ReceiptType;
  diameterClass: DiameterClass;
  truckPlate: string | null;
  trailerPlate: string | null;
  weighedUnit: WeighedUnit;
  driver: string;
  notes: string | null;
  grossWeight: number;
  tareWeight: number;
  trailerGrossWeight: number | null;
  trailerTareWeight: number | null;
  invoiceWeight: number | null;
  pricePerTon: number | null;
  createdAt: Date;
  complementaryInvoiceId: string | null;
  complementaryInvoice: ComplementaryInvoiceSummary | null;
};

export type CreateReceiptData = Omit<CreateReceiptsDTO, 'farmId' | 'newFarmName'> & {
  supplierName: string;
  farmId: string;
  farmName: string;
};
export type UpdateReceiptData = Omit<
  UpdateReceiptsDTO,
  'farmId' | 'newFarmName' | 'trailerGrossWeight' | 'trailerTareWeight'
> & {
  supplierName?: string;
  farmId?: string;
  farmName?: string;
  trailerGrossWeight?: number | null;
  trailerTareWeight?: number | null;
};

export interface IReceiptRepository {
  findById(id: string): Promise<Receipt | null>;
  findByIds(ids: string[]): Promise<Receipt[]>;
  findAll(): Promise<Receipt[]>;
  create(input: CreateReceiptData): Promise<Receipt>;
  update(id: string, input: UpdateReceiptData): Promise<Receipt>;
  remove(id: string): Promise<void>;
  unlinkComplementaryInvoice(id: string): Promise<Receipt>;
  countByComplementaryInvoiceId(complementaryInvoiceId: string): Promise<number>;
}
