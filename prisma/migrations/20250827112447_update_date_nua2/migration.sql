/*
  Warnings:

  - Changed the type of `name` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."RolesName" AS ENUM ('STAFF', 'ADMIN', 'CUSTOMER');

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Role" DROP COLUMN "name",
ADD COLUMN     "name" "ShopQuanAoTheThao"."RolesName" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "ShopQuanAoTheThao"."Role"("name");
