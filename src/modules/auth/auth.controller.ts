import { OtpPurposeEnum } from '@Enums/otp-purpose-type.enum';
import { RefresTokenDto } from '@Modules/auth/dto/refresh-token';
import { JwtAuthGuard } from '@Modules/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@Modules/auth/guards/local-auth.guard';
import { MailService } from '@Modules/mail/mail.service';
import { OtpService } from '@Modules/otp/otp.service';
import { CreateUserDto } from '@Modules/users/dto/create-user.dto';
import { UsersService } from '@Modules/users/users.service';
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
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
import { GetJwtPayloadUser } from 'src/common/decorators/get-user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard) //1./Tạo Guard để xác thực bằng passport-local
  async authen(@GetJwtPayloadUser() user: any, @Req() req: Request) {
    const device = req.headers['user-agent'];
    // 5./ Gọi hàm tạo JWT
    return await this.authService.login(user, device);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: CreateUserDto) {
    //Tạo User
    const user = await this.userService.create(body);

    // Tạo OTP: Email Verify cho User
    const otp = await this.otpService.createOtp(
      user.id,
      OtpPurposeEnum.EMAIL_VERIFY,
    );

    // Gửi mail xác thực
    // const result = await this.mailService.sendConfirmEmailRegister(
    //   user.email,
    //   user.name,
    //   otp,
    // );

    return {
      userId: user.id,
      otp_email_verify: otp,
    };
  }

  @Get('verify-email')
  async verifyEmail(
    @Query('otp-email-verify') otp: string,
    @Query('userId') userId: string,
    @Req() req: Request,
  ) {
    //Lấy thông tin thiết bị đang đăng nhập
    const device = req.headers['user-agent'];

    // Kiểm tra otp và login
    const user = (await this.otpService.verifyOtp(
      userId,
      otp,
      OtpPurposeEnum.EMAIL_VERIFY,
    )) as JwtPayloadUser;

    // Đăng nhập tài khoản
    return await this.authService.login(user, device);
  }

  @Throttle({ default: { ttl: 30000, limit: 3 } })
  @Post('resend-otp-email')
  async resendOtpEmailVerify(@Body('email') email: string) {
    // Tìm User
    const user = await this.userService.findUserByEmail(email);

    // Tạo Otp
    const otp = await this.otpService.createOtp(
      user.id,
      OtpPurposeEnum.EMAIL_VERIFY,
    );

    // Gửi mail xác thực
    // const result = await this.mailService.sendConfirmEmailRegister(
    //   user.email,
    //   user.name,
    //   otp,
    // );

    return {
      userId: user.id,
      otp_email_verify: otp,
    };
  }

  @Post('refresh')
  async reAuthen(@Body() body: RefresTokenDto) {
    return await this.authService.refreshToken(body);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async signOutByDevice(
    @GetJwtPayloadUser() user: JwtPayloadUser,
    @Req() req: Request,
  ) {
    const device = req.headers['user-agent'] || 'unknown';
    const result = await this.authService.revokeToken(user, device);
    if (result) return { message: 'Đăng xuất thành công' };
  }

  @Post('logout/all')
  @UseGuards(JwtAuthGuard)
  async signOutAllDevice(@GetJwtPayloadUser() user: JwtPayloadUser) {
    const result = await this.authService.revokeTokenAll(user);
    if (result) return { message: 'Đăng xuất thành công' };
  }
}
