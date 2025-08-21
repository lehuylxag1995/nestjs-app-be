/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ShopQuanAoTheThao"."Users_CCCD_phone_email_name_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "ShopQuanAoTheThao"."Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Users_address_key" ON "ShopQuanAoTheThao"."Users"("address");

-- CreateIndex
CREATE INDEX "Users_CCCD_phone_idx" ON "ShopQuanAoTheThao"."Users"("CCCD", "phone");
