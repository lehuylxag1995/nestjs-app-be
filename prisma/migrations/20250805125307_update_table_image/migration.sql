/*
  Warnings:

  - You are about to drop the column `altText` on the `Images` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `Images` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Images` table. All the data in the column will be lost.
  - You are about to drop the column `subtype` on the `Images` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Images` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ShopQuanAoTheThao"."Images_subtype_idx";

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Images" DROP COLUMN "altText",
DROP COLUMN "extension",
DROP COLUMN "height",
DROP COLUMN "subtype",
DROP COLUMN "width";
