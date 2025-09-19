/*
  Warnings:

  - Changed the type of `purpose` on the `OtpVerification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShopQuanAoTheThao"."PurposeType" AS ENUM ('EMAIL_VERIFY', 'RESET_PASSWORD', 'TFA');

-- AlterTable
ALTER TABLE "ShopQuanAoTheThao"."OtpVerification" DROP COLUMN "purpose",
ADD COLUMN     "purpose" "ShopQuanAoTheThao"."PurposeType" NOT NULL;
