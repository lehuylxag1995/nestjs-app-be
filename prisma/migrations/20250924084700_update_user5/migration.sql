/*
  Warnings:

  - Added the required column `updateAt` to the `UserSocial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."UserSocial" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
