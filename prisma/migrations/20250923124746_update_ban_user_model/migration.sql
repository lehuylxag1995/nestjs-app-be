-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."Users" ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ShopQuanAoTheThao"."UserProvider" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,

    CONSTRAINT "UserProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProvider_provider_providerId_key" ON "ShopQuanAoTheThao"."UserProvider"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."UserProvider" ADD CONSTRAINT "UserProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
