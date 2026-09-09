export const COMPLEMENTARY_INVOICE_REPOSITORY = Symbol(
  'COMPLEMENTARY_INVOICE_REPOSITORY',
);

export type ComplementaryInvoice = {
  id: string;
  number: string;
  supplier: string;
  totalWeight: number;
  issueDate: Date;
};

export interface IComplementaryInvoiceRepository {
  findAll(): Promise<ComplementaryInvoice[]>;
  findById(id: string): Promise<ComplementaryInvoice | null>;
  createAndLinkReceipts(input: {
    number: string;
    supplier: string;
    totalWeight: number;
    receiptIds: string[];
  }): Promise<ComplementaryInvoice>;
}
