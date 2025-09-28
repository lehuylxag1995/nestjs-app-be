import { AuthService } from '@Modules/auth/auth.service';
import { AuthBadRequestException } from '@Modules/auth/exceptions/auth-notfound.exception';
import { UsersService } from '@Modules/users/users.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
import { UserFacebookResponse } from '@Types/user-facebook-response.type';
import { Strategy } from 'passport-facebook';

// 3./ Triển khai validate facebook
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
    const clientID = configService.get<string>('FACEBOOK_APP_ID');
    const clientSecret = configService.get<string>('FACEBOOK_APP_SECRET');
    const callbackURL = configService.get<string>('FACEBOOK_CALLBACK_URL');

    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error(
        'Facebook App ID và App Secret hoặc AppCallbackUrl chưa được cấu hình trong file .env',
      );
    }

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'public_profile'], // Tên quyền trong bảng Quyền và tính năng
      profileFields: ['id', 'displayName', 'email', 'picture'], // Yêu cầu thông tin đăng nhập của user từ facebook
    });
  }

  //4./ Chạy sau khi facebook xác thực thành công
  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, displayName, emails, photos } = profile;

    const userFacebook = {
      facebookId: id,
      displayName,
      email: emails[0].value,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    } as UserFacebookResponse;

    // Liên kết hoặc Tạo mới tài khoản
    const userSocial =
      await this.authService.craeteOrUpdateSocialFacebook(userFacebook);
    if (!userSocial)
      throw new AuthBadRequestException({
        message: 'Tạo liên kết mạng xã hội thất bại !',
      });

    //Lấy thông tin để tạo Jwt trong App
    const user = await this.userService.findOne(userSocial.userId);
    if (!user)
      throw new AuthBadRequestException({
        message: 'Không tìm thấy tài khoản sau khi liên kết',
      });

    // Trả về jwt chung của app
    const result: JwtPayloadUser = {
      userId: user.id,
      roleId: user.roleId,
    };

    return result;
  }
}
