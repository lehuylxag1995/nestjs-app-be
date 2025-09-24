/*
  Warnings:

  - You are about to drop the `UserProvider` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."SocialType" AS ENUM ('FACEBOOK', 'GOOGLE');

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."UserProvider" DROP CONSTRAINT "UserProvider_userId_fkey";

-- DropTable
DROP TABLE "ShopQuanAoTheThao"."UserProvider";

-- DropEnum
DROP TYPE "ShopQuanAoTheThao"."ProviderType";

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."UserSocial" (
    "id" TEXT NOT NULL,
    "social" "ShopQuanAoTheThao"."SocialType" NOT NULL,
    "socialId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "avatarUrl" TEXT,

    CONSTRAINT "UserSocial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSocial_social_socialId_key" ON "ShopQuanAoTheThao"."UserSocial"("social", "socialId");

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."UserSocial" ADD CONSTRAINT "UserSocial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
