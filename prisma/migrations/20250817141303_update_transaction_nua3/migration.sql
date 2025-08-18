/*
  Warnings:

  - You are about to drop the column `costPrice` on the `OrderItems` table. All the data in the column will be lost.
  - You are about to drop the column `totalCostPrice` on the `OrderItems` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."OrderItems" DROP COLUMN "costPrice",
DROP COLUMN "totalCostPrice";
