
import 'dotenv/config';

import Database from 'better-sqlite3';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from './src/generated/prisma/client';
import path from 'node:path';

async function main() {
  const sqlitePath = path.resolve(process.cwd(), 'dev.db');

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL não foi encontrada no arquivo .env');
  }

  console.log('Iniciando migração SQLite -> Neon PostgreSQL...\n');

  // Abre o SQLite somente para leitura.
  const sqlite = new Database(sqlitePath, {
    readonly: true,
    fileMustExist: true,
  });

  const adapter = new PrismaNeon({
    connectionString,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();

    console.log('Conexão com o Neon estabelecida.');

    // 1. Lê os dados do SQLite.
    const users = sqlite.prepare('SELECT * FROM User').all() as any[];

    const suppliers = sqlite
      .prepare('SELECT * FROM Supplier')
      .all() as any[];

    const farms = sqlite.prepare('SELECT * FROM Farm').all() as any[];

    const invoices = sqlite
      .prepare('SELECT * FROM ComplementaryInvoice')
      .all() as any[];

    const receipts = sqlite
      .prepare('SELECT * FROM Receipt')
      .all() as any[];

    const sourceCounts = {
      User: users.length,
      Supplier: suppliers.length,
      Farm: farms.length,
      ComplementaryInvoice: invoices.length,
      Receipt: receipts.length,
    };

    console.log('\nRegistros encontrados no SQLite:');
    console.table(sourceCounts);

    // 2. Verifica a integridade referencial do SQLite.
    const foreignKeyErrors = sqlite
      .prepare('PRAGMA foreign_key_check')
      .all();

    if (foreignKeyErrors.length > 0) {
      throw new Error(
        'Foram encontrados problemas de integridade referencial no SQLite.'
      );
    }

    // 3. Prepara os dados para o PostgreSQL.
    const preparedSuppliers = suppliers.map((supplier) => ({
      ...supplier,
      active: Boolean(supplier.active),
    }));

    const preparedInvoices = invoices.map((invoice) => ({
      ...invoice,
      issueDate: new Date(invoice.issueDate),
    }));

    const preparedReceipts = receipts.map((receipt) => ({
      ...receipt,
      createdAt: new Date(receipt.createdAt),
    }));

    // 4. Verifica se o banco de destino está vazio.
    const targetCounts = await Promise.all([
      prisma.user.count(),
      prisma.supplier.count(),
      prisma.farm.count(),
      prisma.complementaryInvoice.count(),
      prisma.receipt.count(),
    ]);

    const targetIsEmpty = targetCounts.every((count) => count === 0);

    if (!targetIsEmpty) {
      throw new Error(
        'O banco Neon não está vazio. Migração cancelada para evitar duplicações.'
      );
    }

    console.log('\nNeon verificado: nenhuma tabela possui registros.');

    // 5. Insere os registros respeitando a ordem dos relacionamentos.
    console.log('\nIniciando transferência dos registros...');

    await prisma.$transaction([
      prisma.user.createMany({
        data: users,
      }),

      prisma.supplier.createMany({
        data: preparedSuppliers,
      }),

      prisma.farm.createMany({
        data: farms,
      }),

      prisma.complementaryInvoice.createMany({
        data: preparedInvoices,
      }),

      prisma.receipt.createMany({
        data: preparedReceipts,
      }),
    ]);

    console.log('Transferência concluída.');

    // 6. Confere os registros inseridos no Neon.
    const finalCounts = {
      User: await prisma.user.count(),
      Supplier: await prisma.supplier.count(),
      Farm: await prisma.farm.count(),
      ComplementaryInvoice: await prisma.complementaryInvoice.count(),
      Receipt: await prisma.receipt.count(),
    };

    console.log('\nConferência final:');
    console.table(
      Object.keys(sourceCounts).map((table) => ({
        Tabela: table,
        SQLite: sourceCounts[table as keyof typeof sourceCounts],
        Neon: finalCounts[table as keyof typeof finalCounts],
        Resultado:
          sourceCounts[table as keyof typeof sourceCounts] ===
          finalCounts[table as keyof typeof finalCounts]
            ? 'OK'
            : 'DIVERGÊNCIA',
      }))
    );

    const allMatch = Object.keys(sourceCounts).every(
      (table) =>
        sourceCounts[table as keyof typeof sourceCounts] ===
        finalCounts[table as keyof typeof finalCounts]
    );

    if (!allMatch) {
      throw new Error(
        'A quantidade de registros entre SQLite e Neon não corresponde.'
      );
    }

    console.log('\nMigração finalizada e conferida com sucesso!');
  } finally {
    sqlite.close();
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const e = error as any;

  console.error('\nERRO DURANTE A MIGRAÇÃO:');
  console.error('Nome:', e?.name);
  console.error('Mensagem:', e?.message);
  console.error('Causa:', e?.cause);
  console.error('Erro interno:', e?.error);
  console.error('Stack:', e?.stack);

  console.error('\nPropriedades completas:');
  console.dir(e, { depth: 10 });

  if (e?.target) {
    console.error('\nDetalhes do WebSocket:');
    console.dir(e.target, { depth: 5 });
  }

  process.exitCode = 1;
});