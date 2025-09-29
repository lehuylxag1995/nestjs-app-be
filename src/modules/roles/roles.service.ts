import { PrismaService } from '@Modules/prisma/prisma.service';
import { CreateRoleDto } from '@Modules/roles/dto/create-role.dto';
import { UpdateRoleDto } from '@Modules/roles/dto/update-role.dto';
import { RoleConflictException } from '@Modules/roles/exceptions/role-conflict.exception';
import { RoleNotFoundException } from '@Modules/roles/exceptions/role-not-found.exception';
import { Injectable } from '@nestjs/common';
import { Prisma, RolesName } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findRoleByName(nameRole: RolesName, tx?: Prisma.TransactionClient) {
    const prisma = tx ?? this.prismaService;

    const role = await prisma.role.findUnique({
      where: { name: nameRole as RolesName },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!role) throw new RoleNotFoundException({ field: nameRole });
    return role;
  }

  async findRole(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;

    const role = await prisma.role.findUnique({
      where: { id },
    });
    if (!role) throw new RoleNotFoundException({ field: id });
    return role;
  }

  async findPermissionOnRole(roleId: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;

    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        Permissions: true,
      },
    });

    if (!role) throw new RoleNotFoundException({ field: roleId });
    return role;
  }

  async createRole(data: CreateRoleDto, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      return await prisma.role.create({
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new RoleConflictException({
            field: error.meta?.target as string,
          });
        }
      }
    }
  }

  async updateRole(
    id: string,
    data: UpdateRoleDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      const role = await this.findRole(id, prisma);

      return await prisma.role.update({
        where: { id: role.id },
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new RoleConflictException({
            field: error.meta?.target as string,
          });
        }
      }
      throw error;
    }
  }

  async deleteRole(id: string, tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;

    const role = await this.findRole(id, prisma);

    try {
      return await prisma.role.delete({
        where: { id: role.id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new RoleConflictException({
            message: `Role đang là khóa ngoại của nhiều bảng !`,
          });
        }
      }
      throw error;
    }
  }

  async findAll(tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;

    return await prisma.role.findMany();
  }
}
