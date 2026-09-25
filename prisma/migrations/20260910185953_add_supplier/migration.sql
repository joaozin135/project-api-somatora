/*
  Warnings:

  - Added the required column `supplierId` to the `Receipt` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Receipt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "farm" TEXT NOT NULL,
    "length" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "diameterClass" TEXT NOT NULL,
    "truckPlate" TEXT NOT NULL,
    "trailerPlate" TEXT,
    "driver" TEXT NOT NULL,
    "notes" TEXT,
    "grossWeight" REAL NOT NULL,
    "tareWeight" REAL NOT NULL,
    "invoiceWeight" REAL,
    "pricePerTon" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "complementaryInvoiceId" TEXT,
    CONSTRAINT "Receipt_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Receipt_complementaryInvoiceId_fkey" FOREIGN KEY ("complementaryInvoiceId") REFERENCES "ComplementaryInvoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Receipt" ("complementaryInvoiceId", "createdAt", "diameterClass", "driver", "farm", "grossWeight", "id", "invoiceNumber", "invoiceWeight", "length", "notes", "pricePerTon", "supplier", "tareWeight", "trailerPlate", "truckPlate", "type") SELECT "complementaryInvoiceId", "createdAt", "diameterClass", "driver", "farm", "grossWeight", "id", "invoiceNumber", "invoiceWeight", "length", "notes", "pricePerTon", "supplier", "tareWeight", "trailerPlate", "truckPlate", "type" FROM "Receipt";
DROP TABLE "Receipt";
ALTER TABLE "new_Receipt" RENAME TO "Receipt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");
