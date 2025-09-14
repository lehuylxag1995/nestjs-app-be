import { RefresTokenDto } from '@Modules/auth/dto/refresh-token';
import { JwtAuthGuard } from '@Modules/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@Modules/auth/guards/local-auth.guard';
import { CreateUserDto } from '@Modules/users/dto/create-user.dto';
import { UsersService } from '@Modules/users/users.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard) //1./Tạo Guard để xác thực bằng passport-local
  async authen(@GetUser() user: any, @Req() req: Request) {
    const device = req.headers['user-agent'] || 'unknown';
    // 5./ Gọi hàm tạo JWT
    return await this.authService.login(user, device);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const user = (await this.userService.create(body)) as JwtPayloadUser;
    const access_token = await this.authService.createJwt(user);
    return { access_token };
  }

  @Post('refresh')
  async reAuthen(@Body() body: RefresTokenDto) {
    return await this.authService.refreshToken(body);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async signOutByDevice(@GetUser() user: JwtPayloadUser, @Req() req: Request) {
    const device = req.headers['user-agent'] || 'unknown';
    const result = await this.authService.revokeToken(user, device);
    if (result) return { message: 'Đăng xuất thành công' };
  }

  @Post('logout/all')
  @UseGuards(JwtAuthGuard)
  async signOutAllDevice(@GetUser() user: JwtPayloadUser) {
    const result = await this.authService.revokeTokenAll(user);
    if (result) return { message: 'Đăng xuất thành công' };
  }
}
