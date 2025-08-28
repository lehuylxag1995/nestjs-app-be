import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { CaslAbilityFactory } from '@modules/casl/casl-ability.factory';
import { PaginationUserDto } from '@modules/users/dto/pagination-user.dto';
import { UserRole } from '@modules/users/types/user.type';
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
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req, @Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.findUserRoleById(req.user.id);

    const ability = await this.caslAbilityFactory.createForUser(user);

    if (!ability.can('create', 'User'))
      throw new ForbiddenException('Bạn không có quyền');

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
