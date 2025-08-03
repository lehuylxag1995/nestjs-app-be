-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Product" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."ProductImage" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."ProductVariant" ALTER COLUMN "productId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ShopQuanAoTheThao"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
