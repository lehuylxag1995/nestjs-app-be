import { CreateOtpDto } from '@Modules/otp/dto/create-otp.dto';
import { UpdateOtpDto } from '@Modules/otp/dto/update-otp.dto';
import { OtpBadRequestException } from '@Modules/otp/exceptions/otp-badrequest.exception';
import { OtpConflictException } from '@Modules/otp/exceptions/otp-conflict.exception';
import { OtpNotFoundException } from '@Modules/otp/exceptions/otp-notfound.exception';
import { PrismaService } from '@Modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PurposeType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
@Injectable()
export class OtpService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createOtp(data: CreateOtpDto, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      const { purpose, userId } = data;

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpHash = await bcrypt.hash(otp, 10);

      let expiresAt = new Date();
      switch (purpose) {
        case 'EMAIL_VERIFY':
          const timeVerifyEmail =
            this.configService.get<number>('OTP_EXPIRE_EMAIL_VERIFY') ?? 1;
          expiresAt = new Date(Date.now() + 1000 * 60 * timeVerifyEmail);
          break;
        case 'RESET_PASSWORD':
          const timeResetPassword =
            this.configService.get<number>('OTP_EXPIRE_RESET_PASSWORD') ?? 1;
          expiresAt = new Date(Date.now() + 1000 * 60 * timeResetPassword);
        default:
          break;
      }

      // const expiresAt = new Date(Date.now() + 1000 * 10);

      const result = await prisma.otpVerification.create({
        data: {
          otpHash,
          expiresAt,
          userId,
          purpose,
        },
      });

      if (!result)
        throw new OtpBadRequestException({ message: 'Tạo OTP thất bại !' });

      return otp;
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(
    userId: string,
    otp: string,
    purpose: PurposeType,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      const otpDb = await prisma.otpVerification.findFirst({
        where: {
          userId,
          purpose,
          verify: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!otpDb) throw new OtpNotFoundException({ field: [userId, purpose] });

      if (otpDb.expiresAt < new Date())
        throw new OtpBadRequestException({ message: 'OTP đã hết hạn !' });

      const match = await bcrypt.compare(otp, otpDb.otpHash);
      if (!match)
        throw new OtpBadRequestException({
          message: 'OTP so sánh không chính xác !',
        });

      return otpDb;
    } catch (error) {
      throw error;
    }
  }

  async deleteOtp(id: string, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      return await prisma.otpVerification.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new OtpNotFoundException({ field: id });
        }
      }
    }
  }

  async deleteAllOtp(
    userId: string,
    purpose: PurposeType,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;
      return await prisma.otpVerification.deleteMany({
        where: {
          userId,
          purpose,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;
    const data = await prisma.otpVerification.findUnique({
      where: { id },
    });
    if (!data) throw new OtpNotFoundException({ field: id });
    return data;
  }

  async findAll(tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;
    return await prisma.otpVerification.findMany();
  }

  async updateOtp(
    id: string,
    data: UpdateOtpDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;
      let otpHash = '';
      if (data.otpHash) {
        otpHash = await bcrypt.hash(data.otpHash, 10);
      } else {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpHash = await bcrypt.hash(otp, 10);
      }

      data.otpHash = otpHash;

      return await prisma.otpVerification.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new OtpConflictException({
            field: error.meta?.target as string,
          });
      }
    }
  }
}
