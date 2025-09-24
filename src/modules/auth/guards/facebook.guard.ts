import { AuthGuard } from '@nestjs/passport';

// 2./ Tạo guard theo chuẩn đăng nhập passport-facebook
export class FacebookAuthGuard extends AuthGuard('facebook') {}
