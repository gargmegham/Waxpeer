-- CreateTable
CREATE TABLE "PriceEmpireResponseCache" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "response" TEXT NOT NULL,
    "lastUpdated" DATETIME NOT NULL
);
