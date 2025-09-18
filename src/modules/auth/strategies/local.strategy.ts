import { AuthService } from '@Modules/auth/auth.service';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private autheService: AuthService) {
    super();
  }

  // 3./ Gọi Kiểm tra người dùng
  async validate(username: string, password: string) {
    const user = await this.autheService.validateUser(username, password);

    if (!user)
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng !');
    else if (!user.emailVerified)
      throw new ForbiddenException(
        'Bạn chưa kích hoạt Email đăng ký tài khoản !',
      );

    return user;
  }
}
