/*
  Warnings:

  - Made the column `displayName` on table `UserProvider` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "ShopQuanAoTheThao"."Users_address_key";

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."UserProvider" ALTER COLUMN "displayName" SET NOT NULL;

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Users" ALTER COLUMN "username" DROP NOT NULL;
