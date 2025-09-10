import { PrismaService } from '@modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { PermissionActions, PermissionSubjects } from '@prisma/client';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prismaService: PrismaService) {}

  async findPermissionOnRole(
    roleId: string, // Role của user hiện tại
    action: string, // 'read', 'create', 'update', 'delete', 'manage'
    subject: string, // 'User',...
    context?: { userId?: string; targetId?: string },
  ) {
    const permission = await this.prismaService.permissionsOnRoles.findFirst({
      where: {
        roleId,
        Permission: {
          actions: action as PermissionActions,
          subjects: subject as PermissionSubjects,
        },
      },
      include: {
        Permission: true,
      },
    });

    // console.dir(permission);

    // if (!permission || !permission.Permission.allowed) return false;

    // const conditions = permission.Permission.conditions;
    // if (conditions) {
    //   // Ví dụ condition = { id: "${user.id}" }
    //   for (const [field, value] of Object.entries(conditions)) {
    //     if (value === '${user.id}' && context?.userId) {
    //       if (context.targetId !== context.userId) {
    //         return false; // customer đang đọc user khác
    //       }
    //     }
    //   }
    // }
    return true;
  }

  create(createPermissionDto: CreatePermissionDto) {
    return 'This action adds a new permission';
  }

  findAll() {
    return `This action returns all permission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
