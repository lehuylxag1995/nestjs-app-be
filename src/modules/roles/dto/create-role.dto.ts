import { RolesName } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';

export class CreateRoleDto {
  @Transform(({ value }) => (value as string).toUpperCase())
  @IsEnum(RolesName)
  name: RolesName;
}
