import { PaginationUserDto } from '@modules/users/dto/pagination-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CheckPolicies } from '@decorators/check-policy.decorator';
import { PoliciesGuard } from '@guards/policy.guard';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { Action } from '@modules/casl/casl-ability.factory';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req, @Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(PoliciesGuard) // Tạo chính sách của user đăng nhập
  @CheckPolicies((ability) => ability.can(Action.Read, 'User')) // Tạo điều kiện cho phép
  findAll(@Query() params: PaginationUserDto, @Req() req) {
    return this.usersService.findAll(params, req.user);
  }

  @Get(':id')
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findOne(id);
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

  // @Patch(':id/Role/:role')
  // updateRole(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Param('role', new ParseEnumPipe(UserRole)) role: UserRole,
  // ) {
  //   return this.usersService.updateRole(id, role);
  // }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
