import { CaslAbilityFactory } from '@Modules/casl/casl-ability.factory';
import { PrismaService } from '@Modules/prisma/prisma.service';
import { RolesService } from '@Modules/roles/roles.service';
import { PaginationUserDto } from '@Modules/users/dto/pagination-user.dto';
import { UpdateUserPartialDto } from '@Modules/users/dto/update-user-partial.dto';
import { UserConflictException } from '@Modules/users/exceptions/user-conflict.exception';
import { UserNotFoundException } from '@Modules/users/exceptions/user-not-found.exception';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly roleService: RolesService,
    private readonly prismaService: PrismaService, // readonly chỉ để dùng không được gán lại.
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      // Tìm role mặc định là customer cho tài khoản
      const roleCustomer = await this.roleService.findRoleByName('CUSTOMER');
      createUserDto.roleId = roleCustomer.id;

      // Tạo mật khẩu cho tài khoản
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
      createUserDto.password = hash;

      // Tạo tài khoản
      return await this.prismaService.user.create({
        data: createUserDto,
        omit: {
          username: true,
          password: true,
          isActive: true,
          updatedAt: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UserConflictException({
            field: error.meta?.target as string,
            code: 'CREATE_USER_UNIQUE',
          });
        }
      }
      throw error; // để service throw ra luôn
    }
  }

  async findUserByEmail(email: string, tx?: Prisma.TransactionClient) {
    const prisma = tx ?? this.prismaService;

    const result = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
      },
    });

    if (!result) throw new UserNotFoundException({ field: email });
    return result;
  }

  async findAll(paginationUserDto: PaginationUserDto, user: JwtPayloadUser) {
    const { page, pageSize, keyword } = paginationUserDto;
    const searchWhere: Prisma.UserWhereInput = keyword
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
        where: searchWhere,
      }),
      this.prismaService.user.count({ where: searchWhere }),
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

  async findOne(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;

    const user = await prisma.user.findUnique({
      where: { id },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new UserNotFoundException({ field: id });

    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        password: true,
        emailVerify: true,
        roleId: true,
      },
    });

    if (!user) throw new UserNotFoundException({ field: username });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.findOne(id);

      return await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
        omit: {
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UserConflictException({
            field: error.meta?.target as string,
          });
        }
      }
    }
  }

  async updatePartial(id: string, updateUserDto: UpdateUserPartialDto) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UserConflictException({
            field: error.meta?.target as string,
          });
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
        roleId: true,
        password: true,
      },
    });
  }

  async updateEmailVerify(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx ?? this.prismaService;

    const user = await this.findOne(id, prisma);

    return await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerify: !user.emailVerify,
      },
    });
  }

  async findUserWithPermissionOnRole(
    userId: string,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx || this.prismaService;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        Role: {
          include: {
            Permissions: {
              include: { Permission: true },
            },
          },
        },
      },
    });

    if (!user) throw new UserNotFoundException({ field: userId });
    return user;
  }

  async updatePassword(
    id: string,
    password: string,
    tx?: Prisma.TransactionClient,
  ) {
    const prisma = tx ?? this.prismaService;
    const user = await this.findOne(id, prisma);

    return await prisma.user.update({
      where: { id: user.id },
      data: {
        password,
      },
    });
  }
}
