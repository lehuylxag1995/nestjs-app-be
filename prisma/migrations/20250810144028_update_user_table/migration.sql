/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to alter the column `promotionalPrice` on the `Snapshot` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(13,3)`.
  - You are about to alter the column `salePrice` on the `Snapshot` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(13,3)`.
  - Added the required column `createdById` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Made the column `promotionalPrice` on table `Snapshot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `salePrice` on table `Snapshot` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."SnapshotType" AS ENUM ('IMPORT', 'EXPORT', 'ADJUSTMENT', 'DAILY');

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Snapshot" DROP CONSTRAINT "Snapshot_createdBy_fkey";

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Snapshot" DROP COLUMN "createdBy",
DROP COLUMN "reason",
ADD COLUMN     "createdById" TEXT NOT NULL,
ALTER COLUMN "listedPrice" SET DEFAULT 0,
ALTER COLUMN "promotionalPrice" SET NOT NULL,
ALTER COLUMN "promotionalPrice" SET DEFAULT 0,
ALTER COLUMN "promotionalPrice" SET DATA TYPE DECIMAL(13,3),
ALTER COLUMN "salePrice" SET NOT NULL,
ALTER COLUMN "salePrice" SET DEFAULT 0,
ALTER COLUMN "salePrice" SET DATA TYPE DECIMAL(13,3);

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Snapshot" ADD CONSTRAINT "Snapshot_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
