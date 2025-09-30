import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';

@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.createPermission(createPermissionDto);
  }

  @Get()
  async findAll() {
    return await this.permissionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.permissionService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionService.updatePermission(
      id,
      updatePermissionDto,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.permissionService.removePermission(id);
  }
}
