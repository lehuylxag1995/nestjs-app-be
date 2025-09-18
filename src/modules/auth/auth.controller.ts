import { VerifyEmailUserGuard } from '@Guards/veridy-email.guard';
import { RefresTokenDto } from '@Modules/auth/dto/refresh-token';
import { JwtAuthGuard } from '@Modules/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@Modules/auth/guards/local-auth.guard';
import { MailService } from '@Modules/mail/mail.service';
import { CreateUserDto } from '@Modules/users/dto/create-user.dto';
import { UsersService } from '@Modules/users/users.service';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard) //1./Tạo Guard để xác thực bằng passport-local
  async authen(@GetUser() user: any, @Req() req: Request) {
    const device = req.headers['user-agent'] || 'unknown';
    // 5./ Gọi hàm tạo JWT
    return await this.authService.login(user, device);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: CreateUserDto) {
    //Tạo User và token
    const user = (await this.userService.create(body)) as User;
    if (!user.tokenEmailVerify)
      throw new BadRequestException('Không tạo được mã token email !');

    // Gửi mail xác thực
    const isCheckSendMail =
      await this.mailService.sendConfirmEmailRegister(user);
    if (!isCheckSendMail)
      throw new BadRequestException('Không gửi được mail để xác thực');

    return {
      status: 'success',
      message: 'Đã gửi mail thành công !',
    };
  }

  @Post('verify-email')
  async verifyEmail(
    @Body('tokenEmailVerify', new ParseUUIDPipe())
    token: string,
    @Req() req: Request,
  ) {
    const device = req.headers['user-agent'] || 'unknown';

    // Kiểm tra token email và login
    const { access_token, refresh_token } =
      await this.authService.verifyTokenEmail(token, device);

    return { access_token, refresh_token };
  }

  @Post('refresh')
  async reAuthen(@Body() body: RefresTokenDto) {
    return await this.authService.refreshToken(body);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard, VerifyEmailUserGuard)
  async signOutByDevice(@GetUser() user: JwtPayloadUser, @Req() req: Request) {
    const device = req.headers['user-agent'] || 'unknown';
    const result = await this.authService.revokeToken(user, device);
    if (result) return { message: 'Đăng xuất thành công' };
  }

  @Post('logout/all')
  @UseGuards(JwtAuthGuard, VerifyEmailUserGuard)
  async signOutAllDevice(@GetUser() user: JwtPayloadUser) {
    const result = await this.authService.revokeTokenAll(user);
    if (result) return { message: 'Đăng xuất thành công' };
  }
}
