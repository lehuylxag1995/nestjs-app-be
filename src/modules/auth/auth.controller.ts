import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@modules/auth/guards/local-auth.guard';
import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard) //1./Tạo Guard để xác thực bằng passport-local
  async login(@Req() req) {
    // 5./ Gọi hàm tạo JWT
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
