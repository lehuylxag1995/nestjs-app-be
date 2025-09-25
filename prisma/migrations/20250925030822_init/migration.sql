-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."TransactionType" AS ENUM ('IMPORT', 'EXPORT', 'RESERVE', 'RELEASE', 'RETURN', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED');

-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."PurposeType" AS ENUM ('EMAIL_VERIFY', 'RESET_PASSWORD', 'TFA');

-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."PriorityType" AS ENUM ('High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."PurcharsOrderStatus" AS ENUM ('DRAFT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELED');

-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."PermissionActions" AS ENUM ('read', 'create', 'update', 'delete', 'manage');

-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."PermissionSubjects" AS ENUM ('User', 'Supplier', 'Category', 'Product', 'ProductVariant', 'Image', 'File', 'Order', 'OrderItem', 'PurcharsOrder', 'PurcharsOrderItem', 'PurchaseOrderItemReceipt', 'InventoryTransaction', 'Inventory');

-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."RolesName" AS ENUM ('STAFF', 'ADMIN', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."SnapshotType" AS ENUM ('IMPORT', 'EXPORT', 'ADJUSTMENT', 'DAILY');

-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."SocialType" AS ENUM ('FACEBOOK', 'GOOGLE');

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Files" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "originalName" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "extension" TEXT NOT NULL,
    "subtype" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Images" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "userId" TEXT,
    "originalName" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Inventories" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantityOnHand" BIGINT NOT NULL,
    "quantityReserved" BIGINT NOT NULL,
    "quantityAvaliable" BIGINT NOT NULL,
    "averageCostPrice" DECIMAL(13,3) NOT NULL,
    "totalCostValue" DECIMAL(13,3) NOT NULL,
    "minStock" INTEGER,
    "maxStock" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."InventoryTransactions" (
    "id" TEXT NOT NULL,
    "type" "ShopQuanAoTheThao"."TransactionType" NOT NULL DEFAULT 'ADJUSTMENT',
    "purcharsOrderId" TEXT,
    "purcharsOrderItemRecieptId" TEXT,
    "orderId" TEXT,
    "quantity" BIGINT NOT NULL DEFAULT 0,
    "listedPrice" DECIMAL(13,3) DEFAULT 0,
    "totalListedPrice" DECIMAL(13,3) DEFAULT 0,
    "costPrice" DECIMAL(13,3) DEFAULT 0,
    "taxRate" DECIMAL(5,3) DEFAULT 0,
    "taxAmount" DECIMAL(13,3) DEFAULT 0,
    "costPriceWithTax" DECIMAL(13,3) DEFAULT 0,
    "totalCostNotTax" DECIMAL(13,3) DEFAULT 0,
    "totalCostWithTax" DECIMAL(13,3) DEFAULT 0,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Orders" (
    "id" TEXT NOT NULL,
    "status" "ShopQuanAoTheThao"."OrderStatus" NOT NULL DEFAULT 'PENDING',
    "total" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."OrderItems" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "listedPrice" DECIMAL(13,3) NOT NULL,
    "totalListedPrice" DECIMAL(13,3) NOT NULL,
    "isProcessTransaction" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."OtpVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "purpose" "ShopQuanAoTheThao"."PurposeType" NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verify" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."PricingRules" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "productVariantId" TEXT,
    "categoryId" TEXT,
    "priority" "ShopQuanAoTheThao"."PriorityType",
    "margin" DECIMAL(5,2) NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingRules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT,
    "categoryId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."ProductVariants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "listedPrice" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "promotionalPrice" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "salePrice" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."PurcharsOrders" (
    "id" TEXT NOT NULL,
    "status" "ShopQuanAoTheThao"."PurcharsOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "supplierId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "expectedDeliveryDate" TIMESTAMP(3) NOT NULL,
    "totalNotTax" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "totalWithTax" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurcharsOrders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."PurchaseOrderItems" (
    "id" TEXT NOT NULL,
    "purcharsOrderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "orderQuantity" BIGINT NOT NULL,
    "totalReceivedQuantity" BIGINT NOT NULL DEFAULT 0,
    "unitCost" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "unitCostWithTax" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "totalCostNotTax" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "totalCostWithTax" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrderItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."PurchaseOrderItemReceipt" (
    "id" TEXT NOT NULL,
    "purcharsOrderItemId" TEXT NOT NULL,
    "receivedQuantity" BIGINT NOT NULL,
    "receivedById" TEXT NOT NULL,
    "receivedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "isProcessTransaction" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PurchaseOrderItemReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Role" (
    "id" TEXT NOT NULL,
    "name" "ShopQuanAoTheThao"."RolesName" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Permission" (
    "id" TEXT NOT NULL,
    "actions" "ShopQuanAoTheThao"."PermissionActions" NOT NULL,
    "subjects" "ShopQuanAoTheThao"."PermissionSubjects" NOT NULL,
    "allowed" BOOLEAN NOT NULL DEFAULT true,
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

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Snapshot" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "listedPrice" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "promotionalPrice" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "salePrice" DECIMAL(13,3) NOT NULL DEFAULT 0,
    "brand" TEXT,
    "categoryId" TEXT,
    "variantId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "quantityOnHand" BIGINT NOT NULL,
    "quantityReserved" BIGINT NOT NULL,
    "quantityAvailable" BIGINT NOT NULL,
    "averageCostPrice" DECIMAL(13,3),
    "costPrice" DECIMAL(13,3),
    "discountedPrice" DECIMAL(13,3),
    "totalPrice" DECIMAL(13,3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "taxId" TEXT,
    "bankName" TEXT,
    "bankAccount" TEXT,
    "note" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."RefreshToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "device" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."Users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "username" TEXT,
    "password" TEXT,
    "address" TEXT,
    "CCCD" TEXT,
    "emailVerify" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."UserSocial" (
    "id" TEXT NOT NULL,
    "social" "ShopQuanAoTheThao"."SocialType" NOT NULL,
    "socialId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSocial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categories_name_key" ON "ShopQuanAoTheThao"."Categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Files_filename_key" ON "ShopQuanAoTheThao"."Files"("filename");

-- CreateIndex
CREATE INDEX "Files_userId_idx" ON "ShopQuanAoTheThao"."Files"("userId");

-- CreateIndex
CREATE INDEX "Files_subtype_idx" ON "ShopQuanAoTheThao"."Files"("subtype");

-- CreateIndex
CREATE UNIQUE INDEX "Images_filename_key" ON "ShopQuanAoTheThao"."Images"("filename");

-- CreateIndex
CREATE INDEX "Images_productId_idx" ON "ShopQuanAoTheThao"."Images"("productId");

-- CreateIndex
CREATE INDEX "Images_userId_idx" ON "ShopQuanAoTheThao"."Images"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventories_variantId_key" ON "ShopQuanAoTheThao"."Inventories"("variantId");

-- CreateIndex
CREATE INDEX "Inventories_productId_idx" ON "ShopQuanAoTheThao"."Inventories"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventories_productId_variantId_key" ON "ShopQuanAoTheThao"."Inventories"("productId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryTransactions_purcharsOrderItemRecieptId_key" ON "ShopQuanAoTheThao"."InventoryTransactions"("purcharsOrderItemRecieptId");

-- CreateIndex
CREATE INDEX "InventoryTransactions_type_productId_variantId_userId_inven_idx" ON "ShopQuanAoTheThao"."InventoryTransactions"("type", "productId", "variantId", "userId", "inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "PricingRules_customerId_productVariantId_categoryId_key" ON "ShopQuanAoTheThao"."PricingRules"("customerId", "productVariantId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Products_name_key" ON "ShopQuanAoTheThao"."Products"("name");

-- CreateIndex
CREATE INDEX "Products_categoryId_idx" ON "ShopQuanAoTheThao"."Products"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariants_sku_key" ON "ShopQuanAoTheThao"."ProductVariants"("sku");

-- CreateIndex
CREATE INDEX "PurcharsOrders_supplierId_createdById_idx" ON "ShopQuanAoTheThao"."PurcharsOrders"("supplierId", "createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "ShopQuanAoTheThao"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_email_key" ON "ShopQuanAoTheThao"."Suppliers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_taxId_key" ON "ShopQuanAoTheThao"."Suppliers"("taxId");

-- CreateIndex
CREATE INDEX "Suppliers_taxId_idx" ON "ShopQuanAoTheThao"."Suppliers"("taxId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_device_key" ON "ShopQuanAoTheThao"."RefreshToken"("userId", "device");

-- CreateIndex
CREATE UNIQUE INDEX "Users_name_key" ON "ShopQuanAoTheThao"."Users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "ShopQuanAoTheThao"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "ShopQuanAoTheThao"."Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "ShopQuanAoTheThao"."Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_CCCD_key" ON "ShopQuanAoTheThao"."Users"("CCCD");

-- CreateIndex
CREATE INDEX "Users_CCCD_phone_idx" ON "ShopQuanAoTheThao"."Users"("CCCD", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "UserSocial_social_socialId_key" ON "ShopQuanAoTheThao"."UserSocial"("social", "socialId");

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Categories" ADD CONSTRAINT "Categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ShopQuanAoTheThao"."Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Files" ADD CONSTRAINT "Files_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Images" ADD CONSTRAINT "Images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Images" ADD CONSTRAINT "Images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Inventories" ADD CONSTRAINT "Inventories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Inventories" ADD CONSTRAINT "Inventories_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ShopQuanAoTheThao"."ProductVariants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ShopQuanAoTheThao"."ProductVariants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_purcharsOrderId_fkey" FOREIGN KEY ("purcharsOrderId") REFERENCES "ShopQuanAoTheThao"."PurcharsOrders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_purcharsOrderItemRecieptId_fkey" FOREIGN KEY ("purcharsOrderItemRecieptId") REFERENCES "ShopQuanAoTheThao"."PurchaseOrderItemReceipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ShopQuanAoTheThao"."Orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."InventoryTransactions" ADD CONSTRAINT "InventoryTransactions_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "ShopQuanAoTheThao"."Inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OrderItems" ADD CONSTRAINT "OrderItems_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ShopQuanAoTheThao"."Orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OrderItems" ADD CONSTRAINT "OrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OrderItems" ADD CONSTRAINT "OrderItems_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ShopQuanAoTheThao"."ProductVariants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OtpVerification" ADD CONSTRAINT "OtpVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PricingRules" ADD CONSTRAINT "PricingRules_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ShopQuanAoTheThao"."Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PricingRules" ADD CONSTRAINT "PricingRules_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ShopQuanAoTheThao"."ProductVariants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PricingRules" ADD CONSTRAINT "PricingRules_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Products" ADD CONSTRAINT "Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ShopQuanAoTheThao"."Categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."ProductVariants" ADD CONSTRAINT "ProductVariants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PurcharsOrders" ADD CONSTRAINT "PurcharsOrders_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "ShopQuanAoTheThao"."Suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PurcharsOrders" ADD CONSTRAINT "PurcharsOrders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PurchaseOrderItems" ADD CONSTRAINT "PurchaseOrderItems_purcharsOrderId_fkey" FOREIGN KEY ("purcharsOrderId") REFERENCES "ShopQuanAoTheThao"."PurcharsOrders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PurchaseOrderItems" ADD CONSTRAINT "PurchaseOrderItems_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PurchaseOrderItems" ADD CONSTRAINT "PurchaseOrderItems_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ShopQuanAoTheThao"."ProductVariants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PurchaseOrderItemReceipt" ADD CONSTRAINT "PurchaseOrderItemReceipt_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PurchaseOrderItemReceipt" ADD CONSTRAINT "PurchaseOrderItemReceipt_purcharsOrderItemId_fkey" FOREIGN KEY ("purcharsOrderItemId") REFERENCES "ShopQuanAoTheThao"."PurchaseOrderItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PermissionsOnRoles" ADD CONSTRAINT "PermissionsOnRoles_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "ShopQuanAoTheThao"."Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."PermissionsOnRoles" ADD CONSTRAINT "PermissionsOnRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "ShopQuanAoTheThao"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Snapshot" ADD CONSTRAINT "Snapshot_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ShopQuanAoTheThao"."Products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Snapshot" ADD CONSTRAINT "Snapshot_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "ShopQuanAoTheThao"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."UserSocial" ADD CONSTRAINT "UserSocial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
