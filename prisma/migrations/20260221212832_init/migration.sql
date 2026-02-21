-- CreateEnum
CREATE TYPE "ItchPeriod" AS ENUM ('MORNING', 'AFTERNOON', 'NIGHT', 'FLARE');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'SNACK', 'DINNER');

-- CreateEnum
CREATE TYPE "FoodCategory" AS ENUM ('REFINED_CARB', 'WHOLE_GRAIN', 'LEGUME', 'FERMENTED', 'FRIED', 'SWEET', 'VEGETABLE', 'FRUIT', 'PROTEIN');

-- CreateTable
CREATE TABLE "ItchLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "period" "ItchPeriod" NOT NULL,
    "intensity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItchLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SleepLog" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "bedtime" TIMESTAMP(3) NOT NULL,
    "wakeTime" TIMESTAMP(3) NOT NULL,
    "sleepQuality" INTEGER NOT NULL,
    "awakenings" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SleepLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealLog" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mealType" "MealType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "portion" TEXT NOT NULL,
    "category" "FoodCategory" NOT NULL,
    "mealLogId" TEXT NOT NULL,

    CONSTRAINT "MealItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MealItem" ADD CONSTRAINT "MealItem_mealLogId_fkey" FOREIGN KEY ("mealLogId") REFERENCES "MealLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
