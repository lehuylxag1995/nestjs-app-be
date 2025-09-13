import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class LogoutAuthDto {
  @IsUUID(4, { message: 'UserId phải là UUIDv4' })
  @IsNotEmpty({ message: 'Bạn chưa nhập userId' })
  userId: string;

  @IsString({ message: 'Tên thiết bị phải là dạng chuỗi' })
  @IsOptional()
  device?: string;
}
