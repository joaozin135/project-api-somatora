-- CreateTable
CREATE TABLE "ComplementaryInvoice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "totalWeight" REAL NOT NULL,
    "issueDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Receipt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceNumber" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
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
    CONSTRAINT "Receipt_complementaryInvoiceId_fkey" FOREIGN KEY ("complementaryInvoiceId") REFERENCES "ComplementaryInvoice" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Receipt" ("createdAt", "diameterClass", "driver", "farm", "grossWeight", "id", "invoiceNumber", "length", "notes", "supplier", "tareWeight", "trailerPlate", "truckPlate", "type") SELECT "createdAt", "diameterClass", "driver", "farm", "grossWeight", "id", "invoiceNumber", "length", "notes", "supplier", "tareWeight", "trailerPlate", "truckPlate", "type" FROM "Receipt";
DROP TABLE "Receipt";
ALTER TABLE "new_Receipt" RENAME TO "Receipt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
