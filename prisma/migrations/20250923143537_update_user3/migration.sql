/*
  Warnings:

  - Made the column `email` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Users" ALTER COLUMN "email" SET NOT NULL;
