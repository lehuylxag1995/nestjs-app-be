import { PrismaService } from '@Modules/prisma/prisma.service';
import { CreateUserSocialDto } from '@Modules/user-provider/dto/create-user-social.dto';
import { UpdatePartialUserSocialDto } from '@Modules/user-provider/dto/update-partial-user-social.dto';
import { UpdateUserSocialDto } from '@Modules/user-provider/dto/update-user-social.dto';
import { UserSocialBadRequestException } from '@Modules/user-provider/exceptions/user-social-badrequest.exception';
import { UserSocialConflictException } from '@Modules/user-provider/exceptions/user-social-conflict.exception';
import { UserSocialNotFoundException } from '@Modules/user-provider/exceptions/user-social-notfound.exception';
import { Injectable } from '@nestjs/common';
import { Prisma, SocialType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserSocialService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSocial(data: CreateUserSocialDto, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;
      return await prisma.userSocial.create({
        data,
      });
    } catch (error) {
      //Bắt lỗi xung đột khi thêm
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new UserSocialConflictException({
            field: error.meta?.target as string,
          });
      }

      // Các lỗi khác thì lên GlobalException xử lý
      throw error;
    }
  }

  async updateSocial(
    id: string,
    data: UpdateUserSocialDto,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prismaService;

    if (!data.social || !data.socialId)
      throw new UserSocialBadRequestException({
        message: 'Yêu cầu phải có social và socialId',
        // code: 'REQUIRED_FIELDS_SOCIAL_SOCIALID',
      });

    return await prisma.userSocial.update({
      where: { id },
      data,
    });
  }

  async updatePartialSocial(
    id: string,
    data: UpdatePartialUserSocialDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      return await prisma.userSocial.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UserSocialConflictException({
            field: error.meta?.target as string,
          });
        }
      }
    }
  }

  async deleteSocial(id: string) {
    return await this.prismaService.userSocial.delete({
      where: { id },
    });
  }

  async findOne(id: string) {
    const result = await this.prismaService.userSocial.findUnique({
      where: {
        id,
      },
    });

    if (!result) throw new UserSocialNotFoundException({ field: id });

    return result;
  }

  async findOneBySocial(socialId: string, social: SocialType) {
    const result = await this.prismaService.userSocial.findUnique({
      where: {
        social_socialId: { social, socialId },
      },
    });

    if (!result)
      throw new UserSocialBadRequestException({ field: [social, socialId] });

    return result;
  }

  async findAll() {
    return await this.prismaService.userSocial.findMany();
  }
}
