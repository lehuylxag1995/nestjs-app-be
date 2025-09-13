import { IsNotEmpty, IsString } from 'class-validator';

export class RefresTokenDto {
  @IsString({ message: 'Token phải là dạng chuỗi' })
  @IsNotEmpty({ message: 'Bạn chưa nhập token' })
  refresh_token: string;
}
