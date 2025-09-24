import { PrismaService } from '@Modules/prisma/prisma.service';
import { CreateUserSocialDto } from '@Modules/user-provider/dto/create-user-social.dto';
import { UpdateUserSocialDto } from '@Modules/user-provider/dto/update-user-social.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, SocialType } from '@prisma/client';

@Injectable()
export class UserSocialService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSocial(data: CreateUserSocialDto, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx ?? this.prismaService;
      return await prisma.userSocial.create({
        data,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateSocial(data: UpdateUserSocialDto, tx?: Prisma.TransactionClient) {
    const prisma = tx ?? this.prismaService;

    if (!data.social || !data.socialId)
      throw new BadRequestException('social và socialId là bắt buộc !');

    return await prisma.userSocial.update({
      where: {
        social_socialId: {
          social: data.social,
          socialId: data.socialId,
        },
      },
      data: {
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
      },
    });
  }

  async findSocialUserOrThrow(socialId: string, social: SocialType) {
    try {
      const result = await this.prismaService.userSocial.findUnique({
        where: {
          social_socialId: { social, socialId },
        },
      });

      if (!result)
        throw new BadRequestException('Không tìm thấy mạng xã hội với Id !');

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findSocialUser(socialId: string, social: SocialType) {
    return await this.prismaService.userSocial.findUnique({
      where: {
        social_socialId: { social, socialId },
      },
    });
  }
}
