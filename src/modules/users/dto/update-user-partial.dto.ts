import { UpdateUserDto } from '@Modules/users/dto/update-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserPartialDto extends PartialType(UpdateUserDto) {}
