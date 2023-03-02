-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "username" TEXT NOT NULL,
    "botLastRun" TIMESTAMP(3),
    "priceEmpireLastRun" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "waxpeerApiKey" TEXT,
    "waxpeerRateLimit" INTEGER NOT NULL DEFAULT 1,
    "priceEmpireApiKey" TEXT,
    "priceEmpireRateLimit" INTEGER NOT NULL DEFAULT 1,
    "source" TEXT NOT NULL DEFAULT 'buff',
    "undercutPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "undercutPercentage" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "undercutByPriceOrPercentage" TEXT NOT NULL DEFAULT 'price',
    "paused" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceRange" (
    "id" SERIAL NOT NULL,
    "settingsId" INTEGER NOT NULL,
    "sourcePriceMin" DOUBLE PRECISION NOT NULL,
    "sourcePriceMax" DOUBLE PRECISION NOT NULL,
    "priceRangeMin" DOUBLE PRECISION NOT NULL,
    "priceRangeMax" DOUBLE PRECISION NOT NULL,
    "priceRangePercentage" DOUBLE PRECISION NOT NULL,
    "whenNoOneToUndercutListUsing" TEXT NOT NULL,

    CONSTRAINT "PriceRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "item_id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourcePrice" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "undercutPrice" DOUBLE PRECISION NOT NULL,
    "undercutPercentage" DOUBLE PRECISION NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "undercutByPriceOrPercentage" TEXT NOT NULL,
    "priceRangeMin" DOUBLE PRECISION,
    "priceRangeMax" DOUBLE PRECISION,
    "priceRangePercentage" DOUBLE PRECISION,
    "whenNoOneToUndercutListUsing" TEXT,
    "botSuccess" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT NOT NULL DEFAULT 'Not started yet',
    "floatCondition" DOUBLE PRECISION,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "PriceRange" ADD CONSTRAINT "PriceRange_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "Settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
