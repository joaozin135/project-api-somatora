-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Receipt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "farm" TEXT NOT NULL,
    "farmId" TEXT NOT NULL,
    "length" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "diameterClass" TEXT NOT NULL,
    "truckPlate" TEXT,
    "trailerPlate" TEXT,
    "weighedUnit" TEXT NOT NULL DEFAULT 'TRUCK',
    "driver" TEXT NOT NULL,
    "notes" TEXT,
    "grossWeight" REAL NOT NULL,
    "tareWeight" REAL NOT NULL,
    "trailerGrossWeight" REAL,
    "trailerTareWeight" REAL,
    "invoiceWeight" REAL,
    "pricePerTon" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "complementaryInvoiceId" TEXT,
    CONSTRAINT "Receipt_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Receipt_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "Farm" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Receipt_complementaryInvoiceId_fkey" FOREIGN KEY ("complementaryInvoiceId") REFERENCES "ComplementaryInvoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Receipt" ("complementaryInvoiceId", "createdAt", "diameterClass", "driver", "farm", "farmId", "grossWeight", "id", "invoiceNumber", "invoiceWeight", "length", "notes", "pricePerTon", "supplier", "supplierId", "tareWeight", "trailerGrossWeight", "trailerPlate", "trailerTareWeight", "truckPlate", "type") SELECT "complementaryInvoiceId", "createdAt", "diameterClass", "driver", "farm", "farmId", "grossWeight", "id", "invoiceNumber", "invoiceWeight", "length", "notes", "pricePerTon", "supplier", "supplierId", "tareWeight", "trailerGrossWeight", "trailerPlate", "trailerTareWeight", "truckPlate", "type" FROM "Receipt";
DROP TABLE "Receipt";
ALTER TABLE "new_Receipt" RENAME TO "Receipt";
UPDATE "Receipt" SET "weighedUnit" = 'TRUCK_AND_TRAILER' WHERE "trailerGrossWeight" IS NOT NULL;
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
