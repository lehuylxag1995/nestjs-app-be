import { PaginationUserDto } from '@Modules/users/dto/pagination-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { GetJwtPayloadUserNoAuth } from '@Decorators/get-user.decorator';
import { JwtAuthGuard } from '@Modules/auth/guards/jwt-auth.guard';
import { UpdateUserPartialDto } from '@Modules/users/dto/update-user-partial.dto';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAll(
    @Query() params: PaginationUserDto,
    @GetJwtPayloadUserNoAuth() user: JwtPayloadUser,
  ) {
    return this.usersService.findAll(params, user);
  }

  @Get('me')
  async findMe(@GetJwtPayloadUserNoAuth() user: JwtPayloadUser) {
    const userDb = await this.usersService.findOne(user.userId);
    return userDb;
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const user = await this.usersService.findOne(id);
    return user;
  }

  @Patch('me')
  async updatePartial(
    @GetJwtPayloadUserNoAuth() user: JwtPayloadUser,
    @Body() updateUserPartialDto: UpdateUserPartialDto,
  ) {
    return this.usersService.updatePartial(user.userId, updateUserPartialDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.usersService.remove(id);
  }
}
