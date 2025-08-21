import { PaginationUserDto } from '@modules/users/dto/pagination-user.dto';
import { UserRole } from '@modules/users/types/user.type';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() params: PaginationUserDto) {
    return this.usersService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch(':id/CCCD/:cccd')
  updateCCCD(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('cccd') CCCD: string,
  ) {
    return this.usersService.updateCCCD(id, CCCD);
  }

  @Patch(':id/Active/:active')
  updateActive(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('active', ParseBoolPipe) isActive: boolean,
  ) {
    return this.usersService.updateActive(id, isActive);
  }

  @Patch(':id/Role/:role')
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('role', new ParseEnumPipe(UserRole)) role: UserRole,
  ) {
    return this.usersService.updateRole(id, role);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
