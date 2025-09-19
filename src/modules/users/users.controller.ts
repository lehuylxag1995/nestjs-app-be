import { PaginationUserDto } from '@Modules/users/dto/pagination-user.dto';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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

import { GetJwtPayloadUser } from '@Decorators/get-user.decorator';
import { JwtAuthGuard } from '@Modules/auth/guards/jwt-auth.guard';
import { Action } from '@Modules/casl/casl-ability.factory';
import { User } from '@prisma/client';
import { CheckPolicies } from 'src/common/decorators/check-policy.decorator';
import { PoliciesGuard } from 'src/common/guards/policy.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, PoliciesGuard) // PoliciesGuard: Tạo ability theo DB
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CheckPolicies((ability) => ability.can(Action.Create, 'User'))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @CheckPolicies((ability) => ability.can(Action.Read, 'User')) // Tạo điều kiện cho phép
  findAll(@Query() params: PaginationUserDto, @Req() req) {
    return this.usersService.findAll(params, req.user);
  }

  @Get(':id')
  @CheckPolicies((ability) => ability.can(Action.Read, 'User'))
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @GetJwtPayloadUser() currentUser: User, // Lấy user hiện tại từ JWT token
  ) {
    // Kiểm tra xem id được ysêu cầu có phải là của user hiện tại không
    if (id !== currentUser.id) {
      throw new ForbiddenException(
        'Bạn chỉ có thể truy cập thông tin của chính mình',
      );
    }

    const user = await this.usersService.findOne(id);

    return user;
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
