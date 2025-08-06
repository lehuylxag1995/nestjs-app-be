/*
  Warnings:

  - Made the column `color` on table `Variants` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Variants" DROP CONSTRAINT "Variants_productId_fkey";

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Variants" ALTER COLUMN "color" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Variants" ADD CONSTRAINT "Variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
