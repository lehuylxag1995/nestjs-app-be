import { permittedFieldsOf } from '@casl/ability/extra';
import { accessibleBy } from '@casl/prisma';
import { Action, CaslAbilityFactory } from '@Modules/casl/casl-ability.factory';
import { PrismaService } from '@Modules/prisma/prisma.service';
import { RolesService } from '@Modules/roles/roles.service';
import { PaginationUserDto } from '@Modules/users/dto/pagination-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';
import { createPrismaSelect } from 'src/common/utils/casl-prisma.helper';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly roleService: RolesService,
    private readonly prismaService: PrismaService, // readonly chỉ để dùng không được gán lại.
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Tìm role mặc định là customer cho tài khoản
      const roleCustomer = await this.roleService.findRoleByName('CUSTOMER');
      createUserDto.roleId = roleCustomer.id;

      // Tạo mật khẩu cho tài khoản
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);
      createUserDto.password = hash;

      // Tạo mã xác thực email
      const tokenEmailVerify = uuidv4();

      // Tạo tài khoản
      return await this.prismaService.user.create({
        data: {
          ...createUserDto,
          tokenEmailVerify,
        },
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
          throw new BadRequestException(`${error.meta?.target} đã tồn tại`);
        }
      } else console.error(error);
    }
  }

  async findAll(paginationUserDto: PaginationUserDto, user: any) {
    const userWithRole = await this.findUserWithPermissionOnRole(user.id);
    // Where theo casl
    const ability = this.caslAbilityFactory.createForUser(userWithRole);
    const caslWhere = accessibleBy(ability).User;

    // Select theo casl
    const allowedFields = permittedFieldsOf(ability, Action.Read, 'User', {
      fieldsFrom: (rule) =>
        rule.fields || Object.keys(Prisma.UserScalarFieldEnum),
    });
    const selectFields = createPrismaSelect<User>(allowedFields);

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

    const finalWhere: Prisma.UserWhereInput = {
      AND: [caslWhere, searchWhere],
    };

    const [data, totalItems] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: finalWhere,
        select: selectFields,
      }),
      this.prismaService.user.count({ where: finalWhere }),
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
        roleId: true,
        emailVerified: true,
      },
    });

    return user;
  }

  async findUserByTokenEmail(token: string) {
    return await this.prismaService.user.findFirst({
      where: {
        tokenEmailVerify: token,
      },
    });
  }

  async updateActiveEmailVerify(id: string) {
    return await this.prismaService.user.update({
      where: { id },
      data: {
        emailVerified: true,
        tokenEmailVerify: null,
      },
    });
  }

  async updateIsActiveById(id: string) {
    const user = await this.findOne(id);

    return await this.prismaService.user.update({
      where: { id },
      data: {
        isActive: !user.isActive,
      },
    });
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
          roleId: true,
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
        roleId: true,
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
          roleId: true,
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
          roleId: true,
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

  async findUserWithPermissionOnRole(userId: string) {
    const user = await this.prismaService.user.findUnique({
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
    if (!user) throw new BadRequestException('Không tìm thấy tài khoản !');

    return user;
  }
}
