-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Users" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tokenEmailVerify" TEXT;
