import { PrismaService } from '@Modules/prisma/prisma.service';
import { RoleNotFoundException } from '@Modules/roles/exceptions/role-not-found.exception';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, RolesName } from '@prisma/client';

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

    if (!role) throw new RoleNotFoundException({ identity: nameRole });
    return role;
  }

  async findRole(id: string) {
    const role = await this.prismaService.role.findUnique({
      where: { id },
    });
    if (!role) throw new RoleNotFoundException({ identity: id });
    return role;
  }

  async findPermissionOnRole(roleId: string) {
    const role = await this.prismaService.role.findUnique({
      where: { id: roleId },
      include: {
        Permissions: true,
      },
    });
    if (!role) throw new BadRequestException('Không tìm thấy vai trò !');
    return role;
  }
}
