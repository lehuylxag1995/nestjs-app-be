import { PrismaService } from '@Modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
import { createHash } from 'crypto';

@Injectable()
export class TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  sha256(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }

  async generateToken(payload: JwtPayloadUser) {
    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_ACCESS_TOKEN'),
      expiresIn: this.configService.get<string>('JWT_EXPIRE_IN_ACCESS_TOKEN'),
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN'),
      expiresIn: this.configService.get<string>('JWT_EXPIRE_IN_REFRESH_TOKEN'),
    });

    return { access_token, refresh_token };
  }

  async createToken(userId: string, refreshToken: string, device?: string) {
    try {
      //Mã hóa token bằng sha256 luôn 64 ký tự hex
      const tokenHash = this.sha256(refreshToken);

      // Thời hạn refresh_token là 7 ngày
      const expiresAt = new Date();
      const numberDate = this.configService.get<number>('JWT_EXPIRE_AT') ?? 7;
      expiresAt.setDate(expiresAt.getDate() + numberDate);

      const jwtDeviceNameDefault =
        this.configService.get<string>('JWT_DEVICE_NAME') ?? 'unknown';
      const deviceName = device || jwtDeviceNameDefault;

      return await this.prismaService.refreshToken.upsert({
        where: {
          userId_device: {
            device: deviceName,
            userId,
          },
        },
        update: {
          tokenHash,
          expiresAt,
        },
        create: {
          tokenHash,
          expiresAt,
          device: deviceName,
          userId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            `Lỗi: ${error.meta?.target} đã tồn tại trong DB !`,
          );
        }
      }
    }
  }

  async findTokenByUserAndToken(userId: string, refreshTokenHash: string) {
    const tokens = await this.prismaService.refreshToken.findMany({
      where: { userId },
    });

    for (const token of tokens) {
      const preHashVerify = this.sha256(refreshTokenHash);
      if (preHashVerify === token.tokenHash) {
        return token;
      }
    }
  }

  async findOne(id: string) {
    const data = await this.prismaService.refreshToken.findUnique({
      where: { id },
    });
    if (!data) throw new BadRequestException('Không tìm thấy token');
    return data;
  }

  async update(id: string, new_refresh_token: string) {
    await this.findOne(id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const tokenHash = this.sha256(new_refresh_token);

    return await this.prismaService.refreshToken.update({
      where: {
        id,
      },
      data: {
        tokenHash,
        expiresAt,
      },
    });
  }

  async deleteToken(userId: string, device: string) {
    try {
      return await this.prismaService.refreshToken.delete({
        where: {
          userId_device: {
            userId,
            device,
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new BadRequestException('Không tìm thấy userId và thiết bị');
        }
      }
      throw error;
    }
  }

  async deleteTokenAll(userId: string, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx ?? this.prismaService;
      return await prisma.refreshToken.deleteMany({
        where: { userId },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
