/*
  Warnings:

  - You are about to drop the column `role` on the `Users` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."PermissionActions" AS ENUM ('read', 'create', 'update', 'delete', 'manage');

-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."PermissionSubjects" AS ENUM ('User', 'Supplier', 'Category', 'Product', 'ProductVariant', 'Image', 'File', 'Order', 'OrderItem', 'PurcharsOrder', 'PurcharsOrderItem', 'PurchaseOrderItemReceipt', 'InventoryTransaction', 'Inventory');

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Users" DROP COLUMN "role",
ADD COLUMN     "roleId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ShopQuanAoTheThao"."Role";

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Permission" (
    "id" TEXT NOT NULL,
    "actions" "ShopQuanAoTheThao"."PermissionActions" NOT NULL,
    "subjects" "ShopQuanAoTheThao"."PermissionSubjects" NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT false,
    "fields" TEXT[],
    "conditions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."PermissionsOnRoles" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermissionsOnRoles_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "ShopQuanAoTheThao"."Role"("name");

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PermissionsOnRoles" ADD CONSTRAINT "PermissionsOnRoles_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "ShopQuanAoTheThao"."Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PermissionsOnRoles" ADD CONSTRAINT "PermissionsOnRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "ShopQuanAoTheThao"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "ShopQuanAoTheThao"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
