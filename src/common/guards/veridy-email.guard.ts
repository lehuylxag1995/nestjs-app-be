import { UsersService } from '@Modules/users/users.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class VerifyEmailUserGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    // Lấy thông tin người dùng qua JWT
    const req = context.switchToHttp().getRequest();
    const userJWT = req.user;
    if (!userJWT) {
      throw new UnauthorizedException('Bạn chưa đăng nhập tài khoản !');
    }

    const dbUser = await this.userService.findOne(userJWT.id);

    return true;
  }
}
