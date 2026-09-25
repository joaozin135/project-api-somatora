export const FARM_REPOSITORY = Symbol('FARM_REPOSITORY');

export type Farm = {
  id: string;
  name: string;
  supplierId: string;
};

export interface IFarmRepository {
  findById(id: string): Promise<Farm | null>;
  findBySupplier(supplierId: string): Promise<Farm[]>;
  create(supplierId: string, name: string): Promise<Farm>;
  countReceipts(farmId: string): Promise<number>;
  remove(id: string): Promise<void>;
}
