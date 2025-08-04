/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Product" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "priceSale" DROP NOT NULL,
ALTER COLUMN "brand" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "ShopQuanAoTheThao"."Product"("name");
