import { IsComparePassword } from '@Decorators/validations/compare-password.decorator';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Bạn chưa nhập mật khẩu cũ !' })
  password: string;

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
  @IsNotEmpty({ message: 'Bạn chưa nhập mật khẩu mới' })
  newPassword: string;

  @IsComparePassword('newPassword', {
    message: 'Mật khẩu mới không giống nhau',
  })
  @IsNotEmpty({ message: 'Bạn chưa nhập lại mật khẩu mới' })
  reNewPassword: string;
}
