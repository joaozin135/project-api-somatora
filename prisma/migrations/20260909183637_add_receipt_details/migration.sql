/*
  Warnings:

  - Added the required column `driver` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `farm` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grossWeight` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceNumber` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tareWeight` to the `Receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `truckPlate` to the `Receipt` table without a default value. This is not possible if the table is not empty.

*/
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Receipt" ("createdAt", "diameterClass", "id", "type") SELECT "createdAt", "diameterClass", "id", "type" FROM "Receipt";
DROP TABLE "Receipt";
ALTER TABLE "new_Receipt" RENAME TO "Receipt";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
