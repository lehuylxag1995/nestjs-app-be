import { AuthService } from '@Modules/auth/auth.service';
import { UsersService } from '@Modules/users/users.service';
import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
import { UserGoogleRespone } from '@Types/user-google-response.type';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStartegy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const clientID = configService.get<string>('GOOGLE_APP_ID');
    const clientSecret = configService.get<string>('GOOGLE_APP_SECRET');
    const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL)
      throw new UnauthorizedException('Bạn chưa cấu hình google !');

    //Cấu hình theo google
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Mapping response của google -> type tự định nghĩa
    const profileGoogle: UserGoogleRespone = {
      googleId: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      photo: profile.photos[0].value,
    };

    //Liên kết hoặc tạo mới
    const social =
      await this.authService.craeteOrUpdateSocialGoogle(profileGoogle);

    // Lấy thông tin user
    const userDb = await this.userService.findOne(social.userId);
    if (!userDb) throw new BadGatewayException('');

    // Tạo mẫu jwt chung của app
    const data: JwtPayloadUser = {
      userId: userDb.id,
      roleId: userDb.roleId,
    };

    return data;
  }
}
