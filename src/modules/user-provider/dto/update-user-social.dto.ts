import { CreateUserSocialDto } from '@Modules/user-provider/dto/create-user-social.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserSocialDto extends PartialType(CreateUserSocialDto) {}
