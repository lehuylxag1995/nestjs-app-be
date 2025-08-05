/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Inventory" DROP CONSTRAINT "Inventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Inventory" DROP CONSTRAINT "Inventory_variantId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransaction" DROP CONSTRAINT "InventoryTransaction_productId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransaction" DROP CONSTRAINT "InventoryTransaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransaction" DROP CONSTRAINT "InventoryTransaction_variantId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."ProductImage" DROP CONSTRAINT "ProductImage_productId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropTable
DROP TABLE "ShopQuanAoTheThao"."Category";

-- DropTable
DROP TABLE "ShopQuanAoTheThao"."Inventory";

-- DropTable
DROP TABLE "ShopQuanAoTheThao"."InventoryTransaction";

-- DropTable
DROP TABLE "ShopQuanAoTheThao"."Order";

-- DropTable
DROP TABLE "ShopQuanAoTheThao"."OrderItem";

-- DropTable
DROP TABLE "ShopQuanAoTheThao"."Product";

-- DropTable
DROP TABLE "ShopQuanAoTheThao"."ProductImage";

-- DropTable
DROP TABLE "ShopQuanAoTheThao"."ProductVariant";

-- DropTable
DROP TABLE "ShopQuanAoTheThao"."User";

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Inventories" (
    "id" TEXT NOT NULL,
    "quantity" BIGINT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,

    CONSTRAINT "Inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."InventoryTransactions" (
    "id" TEXT NOT NULL,
    "type" "ShopQuanAoTheThao"."TransactionType" NOT NULL,
    "quantity" BIGINT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "InventoryTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Orders" (
    "id" TEXT NOT NULL,
    "status" "ShopQuanAoTheThao"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "total" DECIMAL(13,3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."OrderItems" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(13,3) NOT NULL,
    "total" DECIMAL(13,3) NOT NULL,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(13,3) NOT NULL,
    "priceSale" DECIMAL(13,3),
    "brand" TEXT,
    "categoryId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Uploads" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "subtype" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "extension" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "productId" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "CCCD" TEXT,
    "role" "ShopQuanAoTheThao"."Role" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Variants" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT,

    CONSTRAINT "Variants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "ShopQuanAoTheThao"."Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Inventories_variantId_key" ON "ShopQuanAoTheThao"."Inventories"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "Products_name_key" ON "ShopQuanAoTheThao"."Products"("name");

-- CreateIndex
CREATE INDEX "Uploads_productId_idx" ON "ShopQuanAoTheThao"."Uploads"("productId");

-- CreateIndex
CREATE INDEX "Uploads_userId_idx" ON "ShopQuanAoTheThao"."Uploads"("userId");

-- CreateIndex
CREATE INDEX "Uploads_type_subtype_idx" ON "ShopQuanAoTheThao"."Uploads"("type", "subtype");

-- CreateIndex
CREATE UNIQUE INDEX "Users_name_key" ON "ShopQuanAoTheThao"."Users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "ShopQuanAoTheThao"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Variants_sku_key" ON "ShopQuanAoTheThao"."Variants"("sku");

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Categories" ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ShopQuanAoTheThao"."Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Inventories" ADD CONSTRAINT "Inventories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Inventories" ADD CONSTRAINT "Inventories_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ShopQuanAoTheThao"."Variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ShopQuanAoTheThao"."Variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OrderItems" ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ShopQuanAoTheThao"."Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OrderItems" ADD CONSTRAINT "OrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ShopQuanAoTheThao"."Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Uploads" ADD CONSTRAINT "Uploads_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Uploads" ADD CONSTRAINT "Uploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Variants" ADD CONSTRAINT "Variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
