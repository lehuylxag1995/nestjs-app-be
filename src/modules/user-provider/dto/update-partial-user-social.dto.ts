import { UpdateUserSocialDto } from '@Modules/user-provider/dto/update-user-social.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePartialUserSocialDto extends PartialType(
  UpdateUserSocialDto,
) {}
