import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @IsNotEmpty({ message: 'Bạn chưa nhập tài khoản' })
  username: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Mật khẩu tối thiểu 8 ký tự, trong đó gồm số, viết hoa, ký tự đặc biệt',
    },
  )
  @IsString({ message: 'Mật khẩu phải là kiểu chuỗi' })
  @IsNotEmpty({ message: 'Bạn chưa nhập mật khẩu' })
  password: string;
}
