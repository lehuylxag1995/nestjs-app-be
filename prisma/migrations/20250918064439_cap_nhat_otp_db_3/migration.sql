/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `Users` table. All the data in the column will be lost.
  - You are about to drop the column `tokenEmailVerify` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Users" DROP COLUMN "emailVerified",
DROP COLUMN "tokenEmailVerify";
