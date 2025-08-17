/*
  Warnings:

  - A unique constraint covering the columns `[productId,variantId]` on the table `Inventories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Inventories_productId_variantId_key" ON "ShopQuanAoTheThao"."Inventories"("productId", "variantId");
