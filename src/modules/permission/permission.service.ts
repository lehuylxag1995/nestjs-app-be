import { PrismaService } from '@Modules/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return `This action returns all permission`;
  }

  async findOne(id: string) {
    const permission = await this.prismaService.permission.findUnique({
      where: { id },
    });
    if (!permission) throw new BadRequestException('Không tìm thấy quyền !');
    return permission;
  }

  async findPermissionOnRole(permissionId: string) {
    const permission = await this.prismaService.permission.findUnique({
      where: { id: permissionId },
      include: {
        Roles: true,
      },
    });
    if (!permission) throw new BadRequestException('Không tìm thấy quyền !');
    return permission;
  }

  create(createPermissionDto: CreatePermissionDto) {
    return 'This action adds a new permission';
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
