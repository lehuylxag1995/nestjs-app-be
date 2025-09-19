import { OtpPurposeEnum } from '@Enums/otp-purpose-type.enum';
import { PrismaService } from '@Modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
      const time =
        this.configService.get<number>('OTP_EXPIRE_EMAIL_VERIFY') ?? 5;
      // const expiresAt = new Date(Date.now() + 1000 * 60 * time);
      const expiresAt = new Date(Date.now() + 1000 * 10);

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

      const result = await this.prismaService.$transaction(async (prisma) => {
        //Cập nhật trạng thái xác thực cho tài khoản
        const user = await prisma.user.update({
          where: { id: otpDb.userId },
          data: { emailVerify: true },
        });

        // Xóa otp đã gửi
        await prisma.otpVerification.deleteMany({
          where: {
            userId,
            purpose,
          },
        });

        return { user };
      });

      if (!result)
        throw new BadRequestException('Quy trình xác thực OTP có lỗi !');

      return result.user;
    } catch (error) {
      throw error;
    }
  }
}
