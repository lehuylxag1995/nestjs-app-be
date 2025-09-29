import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTokenDto {
  @IsNotEmpty({ message: 'Bạn chưa nhập token hash !' })
  @IsString({ message: 'Token hash phải là chuỗi !' })
  tokenHash: string;

  @IsOptional()
  @IsString({ message: 'Device phải là chuỗi !' })
  device?: string;

  @IsNotEmpty({ message: 'Bạn chưa nhập userId' })
  @IsString({ message: 'userId phải là chuỗi !' })
  userId: string;
}
