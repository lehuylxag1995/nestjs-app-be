import { PermissionConflictException } from '@Modules/permission/exceptions/permission-conflict.exception';
import { PermissionNotFoundException } from '@Modules/permission/exceptions/permission-notfound.exception';
import { PrismaService } from '@Modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(id: string) {
    const permission = await this.prismaService.permission.findUnique({
      where: { id },
    });

    if (!permission) throw new PermissionNotFoundException({ field: id });

    return permission;
  }

  async findPermissionOnRole(permissionId: string) {
    const permission = await this.prismaService.permission.findUnique({
      where: { id: permissionId },
      include: {
        Roles: true,
      },
    });

    if (!permission)
      throw new PermissionNotFoundException({
        field: `permissionId: ${permissionId}`,
      });

    return permission;
  }

  async findAll(tx?: Prisma.TransactionClient) {
    const prisma = tx || this.prismaService;
    return await prisma.permission.findMany();
  }

  async createPermission(
    data: CreatePermissionDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      return await prisma.permission.create({
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new PermissionConflictException({
            field: error.meta?.target as string,
          });
        }
      }
    }
  }

  async updatePermission(
    id: string,
    data: UpdatePermissionDto,
    tx?: Prisma.TransactionClient,
  ) {
    try {
      const prisma = tx || this.prismaService;

      return await prisma.permission.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new PermissionConflictException({
            field: error.meta?.target as string,
          });
        }
      }
    }
  }

  async removePermission(id: string, tx?: Prisma.TransactionClient) {
    try {
      const prisma = tx || this.prismaService;

      return await prisma.permission.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new PermissionConflictException({
            message: `Permission đang có liên quan đến khóa ngoại !`,
          });
        }
      }
    }
  }
}
