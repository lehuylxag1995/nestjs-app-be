/*
  Warnings:

  - A unique constraint covering the columns `[CCCD]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `Users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "ShopQuanAoTheThao"."Users_CCCD_phone_idx";

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Users" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_CCCD_key" ON "ShopQuanAoTheThao"."Users"("CCCD");

-- CreateIndex
CREATE INDEX "Users_CCCD_phone_email_name_idx" ON "ShopQuanAoTheThao"."Users"("CCCD", "phone", "email", "name");
