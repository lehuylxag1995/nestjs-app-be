import { PrismaService } from '@Modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RolesName } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  async findAll(roleName?: string) {
    return `This action returns all roles`;
  }

  async findRoleByName(nameRole: RolesName) {
    const role = await this.prismaService.role.findUnique({
      where: { name: nameRole as RolesName },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!role) throw new BadRequestException('Không tìm thấy vai trò !');
    return role;
  }

  async findRole(id: string) {
    const role = await this.prismaService.role.findUnique({
      where: { id },
    });
    if (!role) throw new BadRequestException('Không tìm thấy vai trò !');
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

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
