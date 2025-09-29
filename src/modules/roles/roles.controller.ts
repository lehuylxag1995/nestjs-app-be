import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.createRole(createRoleDto);
  }

  @Get()
  async findAll() {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rolesService.findRole(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return await this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.rolesService.deleteRole(id);
  }
}
