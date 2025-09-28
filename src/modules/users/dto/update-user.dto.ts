import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @MaxLength(20, { message: 'Tên tài khoản tối đa 20 ký tự' })
  @MinLength(6, { message: 'Độ dài tối thiểu của tài khoản là 6 ký tự' })
  @IsNotEmpty({ message: 'Bạn chưa nhập tên tài khoản' })
  name: string;

  @IsEmail(
    {
      host_whitelist: ['gmail.com'],
    },
    { message: 'Chỉ chấp nhận Gmail' },
  )
  @IsNotEmpty({ message: 'Bạn chưa nhập email' })
  email: string;

  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng VN' })
  @IsNotEmpty({ message: 'Bạn chưa nhập số điện thoại' })
  phone: string;

  @IsString({ message: 'Địa chỉ phải là dạng chuỗi' })
  @IsNotEmpty({ message: 'Bạn chưa nhập địa chỉ' })
  address: string;

  @Matches(/^[0-9]{12}$/, { message: 'CCCD phải đủ 12 ký tự và là ký tự số' })
  @IsOptional()
  CCCD: string;
}
