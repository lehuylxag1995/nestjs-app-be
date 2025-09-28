-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OtpVerification" DROP CONSTRAINT "OtpVerification_userId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "ShopQuanAoTheThao"."UserSocial" DROP CONSTRAINT "UserSocial_userId_fkey";

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."OtpVerification" ADD CONSTRAINT "OtpVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopQuanAoTheThao"."UserSocial" ADD CONSTRAINT "UserSocial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ShopQuanAoTheThao"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
