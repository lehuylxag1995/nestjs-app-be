import { PrismaService } from '@Modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { createHash } from 'crypto';

@Injectable()
export class TokenService {
  constructor(private readonly prismaService: PrismaService) {}

  sha256(input: string): string {
    return createHash('sha256').update(input).digest('hex');
  }

  async create(userId: string, refreshToken: string, device?: string) {
    try {
      //Mã hóa token bằng sha256 luôn 64 ký tự hex
      const tokenHash = this.sha256(refreshToken);

      // Thời hạn refresh_token là 7 ngày
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const deviceName = device || 'unknown';

      return await this.prismaService.refreshToken.create({
        data: {
          tokenHash,
          expiresAt,
          device: deviceName,
          userId,
        },
      });
    } catch (error) {
      console.log(error);
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

  async deleteTokenAll(userId: string) {
    return await this.prismaService.refreshToken.deleteMany({
      where: { userId },
    });
  }
}
