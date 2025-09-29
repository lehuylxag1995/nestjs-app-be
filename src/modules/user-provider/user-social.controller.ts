import { CreateUserSocialDto } from '@Modules/user-provider/dto/create-user-social.dto';
import { UpdateUserSocialDto } from '@Modules/user-provider/dto/update-user-social.dto';
import { UserSocialService } from '@Modules/user-provider/user-social.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { SocialType } from '@prisma/client';

@Controller('user-social')
export class UserSocialController {
  constructor(private readonly userSocialService: UserSocialService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateUserSocialDto) {
    return await this.userSocialService.createSocial(data);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() data: UpdateUserSocialDto,
  ) {
    return await this.userSocialService.updateSocial(id, data);
  }

  @Patch(':id')
  async updatePartial(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    data: UpdateUserSocialDto,
  ) {
    return await this.userSocialService.updatePartialSocial(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return await this.userSocialService.deleteSocial(id);
  }

  @Get()
  async findAll() {
    return await this.userSocialService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userSocialService.findOne(id);
  }

  @Get('socialId/:socialId/social/:social')
  async findOneBySocial(
    @Param('socialId') socialId: string,
    @Param('social', new ParseEnumPipe(SocialType)) social: SocialType,
  ) {
    return await this.userSocialService.findOneBySocial(socialId, social);
  }
}
