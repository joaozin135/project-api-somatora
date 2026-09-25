-- CreateTable
CREATE TABLE "Farm" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    CONSTRAINT "Farm_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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
    "farmId" TEXT,
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
    CONSTRAINT "Receipt_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Receipt_complementaryInvoiceId_fkey" FOREIGN KEY ("complementaryInvoiceId") REFERENCES "ComplementaryInvoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Receipt" ("complementaryInvoiceId", "createdAt", "diameterClass", "driver", "farm", "grossWeight", "id", "invoiceNumber", "invoiceWeight", "length", "notes", "pricePerTon", "supplier", "supplierId", "tareWeight", "trailerPlate", "truckPlate", "type") SELECT "complementaryInvoiceId", "createdAt", "diameterClass", "driver", "farm", "grossWeight", "id", "invoiceNumber", "invoiceWeight", "length", "notes", "pricePerTon", "supplier", "supplierId", "tareWeight", "trailerPlate", "truckPlate", "type" FROM "Receipt";
DROP TABLE "Receipt";
ALTER TABLE "new_Receipt" RENAME TO "Receipt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Farm_supplierId_name_key" ON "Farm"("supplierId", "name");
