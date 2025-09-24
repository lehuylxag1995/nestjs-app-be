/*
  Warnings:

  - Changed the type of `provider` on the `UserProvider` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."ProviderType" AS ENUM ('FACEBOOK', 'GOOGLE');

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."UserProvider" DROP COLUMN "provider",
ADD COLUMN     "provider" "ShopQuanAoTheThao"."ProviderType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserProvider_provider_providerId_key" ON "ShopQuanAoTheThao"."UserProvider"("provider", "providerId");
