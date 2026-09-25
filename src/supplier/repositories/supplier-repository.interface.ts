export const SUPPLIER_REPOSITORY = Symbol('SUPPLIER_REPOSITORY');

export type SupplierFarm = {
  id: string;
  name: string;
};

export type Supplier = {
  id: string;
  name: string;
  active: boolean;
  cnpj: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  farms: SupplierFarm[];
};

export type SupplierContactFields = {
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
};

export interface ISupplierRepository {
  findAll(): Promise<Supplier[]>;
  findById(id: string): Promise<Supplier | null>;
  findByName(name: string): Promise<Supplier | null>;
  create(
    input: { name: string; farmNames?: string[] } & SupplierContactFields,
  ): Promise<Supplier>;
  update(
    id: string,
    input: { name?: string; active?: boolean } & SupplierContactFields,
  ): Promise<Supplier>;
}
