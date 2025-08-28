import { PrismaService } from '@modules/prisma/prisma.service';
import { PaginationUserDto } from '@modules/users/dto/pagination-user.dto';
import { UserRole } from '@modules/users/types/user.type';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
      createUserDto.password = hash;

      return await this.prismaService.user.create({
        data: createUserDto,
        omit: {
          createdAt: true,
          updatedAt: true,
          isActive: true,
          role: true,
          password: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(`${error.meta?.target} đã tồn tại`);
        }
      }
    }
  }

  async findAll(paginationUserDto: PaginationUserDto) {
    const { page, pageSize, keyword } = paginationUserDto;

    const where: Prisma.UserWhereInput = keyword
      ? {
          OR: [
            { name: { contains: keyword, mode: 'insensitive' } },
            { email: { contains: keyword, mode: 'insensitive' } },
            { phone: { contains: keyword, mode: 'insensitive' } },
            { CCCD: { contains: keyword, mode: 'insensitive' } },
          ],
        }
      : {};
    const [data, totalItems] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        omit: {
          createdAt: true,
          updatedAt: true,
          isActive: true,
          role: true,
          password: true,
        },
      }),
      this.prismaService.user.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        pageSize,
        totalItems,
        totalPage: Math.ceil(totalItems / pageSize),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      omit: {
        createdAt: true,
        updatedAt: true,
        isActive: true,
        role: true,
        password: true,
      },
    });
    if (!user) throw new BadRequestException('Không tìm thấy tài khoản');
    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        password: true,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.findOne(id);

      if (updateUserDto.password) {
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(updateUserDto.password, saltOrRounds);
        updateUserDto.password = hash;
      }

      return await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
        omit: {
          createdAt: true,
          updatedAt: true,
          isActive: true,
          role: true,
          password: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(`${error.meta?.target} đã tồn tại`);
        }
      }
    }
  }

  async remove(id: string) {
    await this.findOne(id);

    return await this.prismaService.user.delete({
      where: { id },
      omit: {
        createdAt: true,
        updatedAt: true,
        isActive: true,
        role: true,
        password: true,
      },
    });
  }

  async updateCCCD(id: string, CCCD: string) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: { CCCD },
        omit: {
          createdAt: true,
          updatedAt: true,
          isActive: true,
          role: true,
          password: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(`${error.meta?.target} đã tồn tại`);
        }
      }
    }
  }

  async updateActive(id: string, isActive: boolean) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: { isActive },
        omit: {
          createdAt: true,
          updatedAt: true,
          role: true,
          password: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(`${error.meta?.target} đã tồn tại`);
        }
      }
    }
  }

  async updateRole(id: string, role: UserRole) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: { role },
        omit: {
          createdAt: true,
          updatedAt: true,
          isActive: true,
          password: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(`${error.meta?.target} đã tồn tại`);
        }
      }
    }
  }

  async findUserRoleById(id: string): Promise<Pick<User, 'id' | 'role'>> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
      },
    });
    if (!user) throw new BadRequestException('Không tìm thấy tài khoản');
    return user;
  }
}
