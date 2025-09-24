import { AuthService } from '@Modules/auth/auth.service';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private autheService: AuthService) {
    super();
  }

  // 3./ triển khai validate ( bắt buộc ). Gọi Kiểm tra người dùng
  async validate(username: string, password: string) {
    const user = await this.autheService.validateUser(username, password);

    if (!user)
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng !');

    if (!user.emailVerify)
      throw new ForbiddenException('Email của bạn chưa được kích hoạt');

    // Trả về jwt chung của app
    const result: JwtPayloadUser = {
      userId: user.id,
      roleId: user.roleId,
    };
    return result;
  }
}
