/*
  Warnings:

  - A unique constraint covering the columns `[variantId]` on the table `OrderItems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrderItems_variantId_key" ON "OrderItems"("variantId");
