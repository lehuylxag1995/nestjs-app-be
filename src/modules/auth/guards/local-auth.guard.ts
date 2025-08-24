import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 2./ Chọn chiến lược xác thực bằng local ( passport - local)
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
