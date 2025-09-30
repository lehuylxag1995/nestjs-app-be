import { PermissionActions, PermissionSubjects } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { camelCase, upperFirst } from 'lodash';

export class CreatePermissionDto {
  @Transform(({ value }) => (value as string).toLowerCase())
  @IsEnum(PermissionActions, { message: 'Action không hợp lệ !' })
  actions: PermissionActions;

  @Transform(({ value }) => {
    const valueNew = upperFirst(camelCase(value)) as string;

    const key = Object.values(PermissionSubjects).find(
      (subject) => subject.toLowerCase() === valueNew.toLowerCase(),
    );

    return key ?? value;
  })
  @IsEnum(PermissionSubjects, { message: 'Subject không hợp lệ !' })
  subjects: PermissionSubjects;

  @IsBoolean()
  @IsOptional() // vì có default = true
  allowed?: boolean = true;

  @IsArray()
  @IsString({ each: true }) // mỗi phần tử trong array phải là string
  @IsOptional()
  fields?: string[];

  @IsOptional()
  conditions?: Record<string, any>; // JSON tự do, có thể validate bằng cách tạo cấu trúc json mong muốn
}
