import { PurposeType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { snakeCase } from 'lodash';

export class CreateOtpDto {
  @IsUUID('4', { message: 'userId là UUIDv4' })
  @IsNotEmpty({ message: 'Bạn chưa nhập OTP !' })
  userId: string;

  @Transform(({ value }) => (snakeCase(value) as string).toUpperCase() ?? value)
  @IsEnum(PurposeType)
  purpose: PurposeType;

  @IsString({ message: 'OTP hash phải là kiểu string' })
  @IsOptional()
  otpHash?: string;
}
