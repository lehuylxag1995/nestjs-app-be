import { OtpPurposeEnum } from '@Enums/otp-purpose-type.enum';
import { PrismaService } from '@Modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
@Injectable()
export class OtpService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createOtp(userId: string, purpose: OtpPurposeEnum) {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otp, 10);

      let expiresAt = new Date();
      switch (purpose) {
        case OtpPurposeEnum.EMAIL_VERIFY:
          const timeVerifyEmail =
            this.configService.get<number>('OTP_EXPIRE_EMAIL_VERIFY') ?? 1;
          expiresAt = new Date(Date.now() + 1000 * 60 * timeVerifyEmail);
          break;
        case OtpPurposeEnum.RESET_PASSWORD:
          const timeResetPassword =
            this.configService.get<number>('OTP_EXPIRE_RESET_PASSWORD') ?? 1;
          expiresAt = new Date(Date.now() + 1000 * 60 * timeResetPassword);
        default:
          break;
      }

      // const expiresAt = new Date(Date.now() + 1000 * 10);

      const result = await this.prismaService.otpVerification.create({
        data: {
          otpHash,
          expiresAt,
          userId,
          purpose,
        },
      });

      if (!result) throw new BadRequestException('Tạo OTP thất bại !');

      return otp;
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(userId: string, otp: string, purpose: OtpPurposeEnum) {
    try {
      const otpDb = await this.prismaService.otpVerification.findFirst({
        where: {
          userId,
          purpose,
          verify: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!otpDb) throw new BadRequestException('OTP không tồn tại !');

      if (otpDb.expiresAt < new Date())
        throw new BadRequestException('OTP đã hết hạn !');

      const match = await bcrypt.compare(otp, otpDb.otpHash);
      if (!match) throw new BadRequestException('OTP không đúng !');

      return otpDb;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteOtp(id: string) {
    try {
      return await this.prismaService.otpVerification.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteAllOtp(
    userId: string,
    purpose: OtpPurposeEnum,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx ?? this.prismaService;
      return await prisma.otpVerification.deleteMany({
        where: {
          userId,
          purpose,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

//Logic verify Email
// const result = await this.prismaService.$transaction(async (prisma) => {
//   //Cập nhật trạng thái xác thực cho tài khoản
//   const user = await prisma.user.update({
//     where: { id: otpDb.userId },
//     data: { emailVerify: true },
//   });

//   // Xóa otp đã gửi
//   await prisma.otpVerification.deleteMany({
//     where: {
//       userId,
//       purpose,
//     },
//   });

//   return { user };
// });
