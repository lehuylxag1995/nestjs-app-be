/*
  Warnings:

  - You are about to drop the `Uploads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Uploads" DROP CONSTRAINT "Uploads_productId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Uploads" DROP CONSTRAINT "Uploads_userId_fkey";

-- DropTable
DROP TABLE "ShopQuanAoTheThao"."Uploads";

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Files" (
    "id" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "extension" TEXT NOT NULL,
    "subtype" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Images" (
    "id" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "altText" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "subtype" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT,
    "userId" TEXT,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Files_filename_key" ON "ShopQuanAoTheThao"."Files"("filename");

-- CreateIndex
CREATE INDEX "Files_userId_idx" ON "ShopQuanAoTheThao"."Files"("userId");

-- CreateIndex
CREATE INDEX "Files_subtype_idx" ON "ShopQuanAoTheThao"."Files"("subtype");

-- CreateIndex
CREATE UNIQUE INDEX "Images_filename_key" ON "ShopQuanAoTheThao"."Images"("filename");

-- CreateIndex
CREATE INDEX "Images_productId_idx" ON "ShopQuanAoTheThao"."Images"("productId");

-- CreateIndex
CREATE INDEX "Images_userId_idx" ON "ShopQuanAoTheThao"."Images"("userId");

-- CreateIndex
CREATE INDEX "Images_subtype_idx" ON "ShopQuanAoTheThao"."Images"("subtype");

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Files" ADD CONSTRAINT "Files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Images" ADD CONSTRAINT "Images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Images" ADD CONSTRAINT "Images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
