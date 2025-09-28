import { ChangePasswordDto } from '@Modules/auth/dto/change-password';
import { RefresTokenDto } from '@Modules/auth/dto/refresh-token';
import { ResetPasswordDto } from '@Modules/auth/dto/reset-password';
import { FacebookAuthGuard } from '@Modules/auth/guards/facebook.guard';
import { GoogleAuthGuard } from '@Modules/auth/guards/google.guard';
import { JwtAuthGuard } from '@Modules/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@Modules/auth/guards/local-auth.guard';
import { CreateUserDto } from '@Modules/users/dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
import { GetJwtPayloadUserNoAuth } from 'src/common/decorators/get-user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
// @UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard) //1./Tạo Guard để xác thực bằng passport-local
  async authen(
    @GetJwtPayloadUserNoAuth() user: JwtPayloadUser,
    @Req() req: Request,
  ) {
    const device = req.headers['user-agent'];
    // 5./ Gọi hàm tạo JWT
    return await this.authService.login(user, device);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: CreateUserDto) {
    return await this.authService.registerUser(body);
  }

  @Get('verify-email')
  async verifyEmail(
    @Query('otp-email-verify') otp: string,
    @Query('userId') userId: string,
    @Req() req: Request,
  ) {
    const device = req.headers['user-agent'];
    return await this.authService.verifyEmailUser(device, otp, userId);
  }

  @Throttle({ default: { ttl: 30000, limit: 3 } })
  @Post('resend-otp-email')
  async resendOtpEmailVerify(@Body('email') email: string) {
    return await this.authService.resendOtpEmailVerifyUser(email);
  }

  @Post('refresh-token')
  async reAuthen(@Body() body: RefresTokenDto) {
    return await this.authService.refreshTokenLogin(body);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async signOutByDevice(
    @GetJwtPayloadUserNoAuth() user: JwtPayloadUser,
    @Body('device') device: string,
  ) {
    const result = await this.authService.revokeToken(user, device);
    if (result) return { message: 'Đăng xuất thành công' };
  }

  @Post('logout/all')
  @UseGuards(JwtAuthGuard)
  async signOutAllDevice(@GetJwtPayloadUserNoAuth() user: JwtPayloadUser) {
    const result = await this.authService.revokeTokenAll(user);
    if (result) return { message: 'Đăng xuất thành công' };
  }

  // @Throttle({ default: { ttl: 30000, limit: 3 } })
  @Post('forget-password')
  async createOtpResetPassword(@Body('email') email: string) {
    return await this.authService.createOtpResetPassword(email);
  }

  @Post('verify-otp-reset-password')
  async verifyOtpResetPassword(
    @Query('otp') otp: string,
    @Query('userId') userId: string,
    @Body() data: ResetPasswordDto,
    @Req() req: Request,
  ) {
    const device = req.headers['user-agent'];
    return await this.authService.verifyResetPassword(
      otp,
      userId,
      data,
      device,
    );
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @GetJwtPayloadUserNoAuth() user: JwtPayloadUser,
    @Body() data: ChangePasswordDto,
    @Req() req: Request,
  ) {
    // console.log(user);
    const device = req.headers['user-agent'];
    return await this.authService.changePasswordUser(user, data, device);
  }

  @Get('facebook')
  @UseGuards(FacebookAuthGuard) // 1. Chỉ định bảo vệ là gì ?
  async loginWithFacebook() {
    // Mở trình duyệt gõ localhost:3000/auth/facebook
    return HttpStatus.OK;
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async loginWithFacebookCallBack(
    @GetJwtPayloadUserNoAuth() user: JwtPayloadUser,
    @Req() req: Request,
  ) {
    const device = req.headers['user-agent'];
    return await this.authService.login(user, device);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogle() {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async loginWithGoogleCallback(
    @GetJwtPayloadUserNoAuth() user: JwtPayloadUser,
    @Req() req: Request,
  ) {
    const device = req.headers['user-agent'];
    return await this.authService.login(user, device);
  }
}
