import { SocialType } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateUserSocialDto {
  @Transform(({ value }) => value?.toUpperCase()) // ép về UPPERCASE
  @IsEnum(SocialType)
  social: SocialType;

  @IsString()
  @IsNotEmpty({ message: 'Bạn chưa nhập socialId !' })
  socialId: string;

  @IsString()
  @IsNotEmpty({ message: 'Bạn chưa nhập displayName !' })
  displayName: string;

  @IsUUID('4', { message: 'userId là UUIDv4' })
  @IsNotEmpty({ message: 'Bạn chưa nhập userId !' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Bạn chưa nhập avatarUrl !' })
  avatarUrl: string;
}
