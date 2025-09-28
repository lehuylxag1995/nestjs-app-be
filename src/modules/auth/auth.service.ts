import { OtpPurposeEnum } from '@Enums/otp-purpose-type.enum';
import { ChangePasswordDto } from '@Modules/auth/dto/change-password';
import { RefresTokenDto } from '@Modules/auth/dto/refresh-token';
import { ResetPasswordDto } from '@Modules/auth/dto/reset-password';
import { MailService } from '@Modules/mail/mail.service';
import { OtpService } from '@Modules/otp/otp.service';
import { PrismaService } from '@Modules/prisma/prisma.service';
import { RolesService } from '@Modules/roles/roles.service';
import { TokenService } from '@Modules/token/token.service';
import { CreateUserSocialDto } from '@Modules/user-provider/dto/create-user-social.dto';
import { UpdateUserSocialDto } from '@Modules/user-provider/dto/update-user-social.dto';
import { UserSocialBadRequestException } from '@Modules/user-provider/exceptions/user-sociala.exception';
import { UserSocialService } from '@Modules/user-provider/user-social.service';
import { CreateUserDto } from '@Modules/users/dto/create-user.dto';
import { UsersService } from '@Modules/users/users.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { SocialType } from '@prisma/client';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
import { UserFacebookResponse } from '@Types/user-facebook-response.type';
import { UserGoogleRespone } from '@Types/user-google-response.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSerivce: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly userSocialService: UserSocialService,
    private readonly roleService: RolesService,
  ) {}

  //4./ Hàm này để so sánh mật khẩu trong CSDL và trả kết quả
  async validateUser(username: string, password: string) {
    //Kiểm tra tài khoản có tồn tại ?
    const user = await this.userSerivce.findUserByUsername(username);
    if (!user) return null;

    //Kiểm tra mật khẩu đúng chưa ?
    if (!user.password)
      throw new BadRequestException('Tài khoản không có mật khẩu !');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _, ...result } = user;
    return result;
  }

  //6./ Hàm này nhận result của validateUser và tạo jwt
  async login(userJwtPayload: JwtPayloadUser, device = 'unknown') {
    try {
      // Tạo token
      const { access_token, refresh_token } =
        await this.tokenService.generateToken(userJwtPayload);

      // Lưu refresh token (đã hash) vào DB
      const tokenStored = await this.tokenService.createToken(
        userJwtPayload.userId,
        refresh_token,
        device,
      );
      if (!tokenStored) {
        throw new BadRequestException(
          'Không tạo được token cho tài khoản này !',
        );
      }

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async resendOtpEmailVerifyUser(email: string) {
    try {
      // Tìm User
      const user = await this.userSerivce.findUserByEmail(email);
      if (!user) throw new BadRequestException('Email Không tồn tại !');

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
    } catch (error) {
      throw error;
    }
  }

  async registerUser(body: CreateUserDto) {
    try {
      //Tạo User
      const user = await this.userSerivce.createUser(body);
      if (!user || !user.name)
        throw new BadRequestException('Đăng ký tài khoản bị lỗi !');

      // Tạo OTP: Email Verify cho User
      const otp = await this.otpService.createOtp(
        user.id,
        OtpPurposeEnum.EMAIL_VERIFY,
      );

      // Gửi mail xác thực
      // await this.mailService.sendConfirmEmailRegister(
      //   user.email,
      //   user.name,
      //   otp,
      // );

      return {
        userId: user.id,
        otp_email_verify: otp,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyEmailUser(device: string, otp: string, userId: string) {
    try {
      // Kiểm tra otp
      const otpDb = await this.otpService.verifyOtp(
        userId,
        otp,
        OtpPurposeEnum.EMAIL_VERIFY,
      );
      if (!otpDb) throw new BadRequestException('OTP không chính xác !');

      // Giao dịch toàn vẹn
      const data = await this.prismaService.$transaction(async (prisma) => {
        // Cập nhật trạng thái đã xác thực email cho tài khoản
        const user = await this.userSerivce.updateEmailVerify(
          otpDb.userId,
          prisma,
        );

        // Xóa otp đã xác thực
        await this.otpService.deleteAllOtp(
          userId,
          OtpPurposeEnum.EMAIL_VERIFY,
          prisma,
        );

        return user;
      });

      const result: JwtPayloadUser = {
        userId: data.id,
        roleId: data.roleId,
      };

      // Đăng nhập tài khoản
      return await this.login(result, device);
    } catch (error) {
      throw error;
    }
  }

  async refreshTokenLogin(data: RefresTokenDto) {
    try {
      // 1. Verify refresh token
      const payload = await this.jwtService.verifyAsync<JwtPayloadUser>(
        data.refresh_token,
        {
          secret: await this.configService.get<string>(
            'JWT_SECRET_REFRESH_TOKEN',
          ),
        },
      );

      // 2. Tìm token đã hash trong DB
      const storedToken = await this.tokenService.findTokenByUserAndToken(
        payload.userId,
        data.refresh_token,
      );
      if (!storedToken)
        throw new UnauthorizedException('Không tìm thấy Refresh Token !');

      // 3. Kiểm tra token đã hết hạn chưa
      if (storedToken.expiresAt < new Date() && storedToken.device) {
        // Xóa token hết hạn khỏi DB
        await this.tokenService.deleteToken(storedToken.id, storedToken.device);
        throw new UnauthorizedException(`refresh token này đã hết hạn`);
      }

      // 4. Lấy thông tin user
      const user = await this.userSerivce.findOne(payload.userId);
      if (!user) {
        throw new UnauthorizedException('Không tìm thấy tài khoản người dùng');
      }

      // 5. Tạo thông tin JWT
      const newPayload: JwtPayloadUser = {
        userId: user.id,
        roleId: user.roleId,
      };

      // 6. Tạo JWT Token mới
      const { access_token, refresh_token } =
        await this.tokenService.generateToken(newPayload);

      // 7. Cập nhật refresh token trong DB
      await this.tokenService.update(storedToken.id, refresh_token);

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  async revokeToken(user: JwtPayloadUser, device: string) {
    //Trường đăng xuất một thiết bị
    try {
      return await this.tokenService.deleteToken(user.userId, device);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async revokeTokenAll(user: JwtPayloadUser) {
    //Trường đăng xuất nhiều thiết bị
    try {
      return await this.tokenService.deleteTokenAll(user.userId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createOtpResetPassword(email: string) {
    try {
      // Kiểm tra tài khoản
      const user = await this.userSerivce.findUserByEmail(email);
      if (!user) {
        throw new BadRequestException('Không tìm thấy tài khoản của bạn !');
      }

      // Tạo OTP reset password và Lưu token vào DB
      const otp = await this.otpService.createOtp(
        user.id,
        OtpPurposeEnum.RESET_PASSWORD,
      );

      // Gửi mail để xác nhận qua trang cập nhật mật khẩu mới
      // const sendMail = await this.mailService.sendResetPassword(
      //   user.id,
      //   user.email,
      //   user.name,
      //   otp,
      // );

      // Trả về thông tin tài khoản cần mật khẩu mới
      return {
        userId: user.id,
        reset_password_otp: otp,
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyResetPassword(
    otp: string,
    userId: string,
    data: ResetPasswordDto,
    device?: string,
  ) {
    try {
      // Check OTP
      const otpDb = await this.otpService.verifyOtp(
        userId,
        otp,
        OtpPurposeEnum.RESET_PASSWORD,
      );
      if (!otpDb) throw new BadRequestException('OTP không chính xác !');

      const user = await this.prismaService.$transaction(async (prisma) => {
        // Tạo password mới và update mật khẩu cho tài khoản
        const password = await bcrypt.hash(data.reNewPassword, 10);

        // Cập nhật mật khẩu mới
        const userUpdated = await this.userSerivce.updatePassword(
          otpDb.userId,
          password,
        );

        // Xóa tất cả OTP của user
        await this.otpService.deleteAllOtp(
          otpDb.userId,
          OtpPurposeEnum.RESET_PASSWORD,
          prisma,
        );

        const result: JwtPayloadUser = {
          userId: userUpdated.id,
          roleId: userUpdated.roleId,
        };

        return result;
      });

      // Đăng nhập bằng mật khẩu mới
      return await this.login(user, device);
    } catch (error) {
      throw error;
    }
  }

  async changePasswordUser(
    user: JwtPayloadUser,
    data: ChangePasswordDto,
    device?: string,
  ) {
    // Lấy thông tin tài khoản
    const userDb = await this.userSerivce.findOne(user.userId);
    if (!userDb)
      throw new BadRequestException('Không tìm thấy thông tin tài khoản');

    // Kiểm tra mật khẩu cũ
    if (userDb.password) {
      const matchPassword = await bcrypt.compare(
        data.password,
        userDb.password,
      );
      if (!matchPassword)
        throw new BadRequestException('Mật khẩu cũ không chính xác !');
    } else throw new BadRequestException('Tài khoản này không có mật khẩu !');

    // Tạo mật khẩu mới
    const newPassword = await bcrypt.hash(data.reNewPassword, 10);

    const userJWTPayload = await this.prismaService.$transaction(
      async (prisma) => {
        // Cập nhật mật khẩu
        const userUpdated = await this.userSerivce.updatePassword(
          user.userId,
          newPassword,
          prisma,
        );

        // Xóa các token đăng nhập bằng mật khẩu cũ
        await this.tokenService.deleteTokenAll(user.userId, prisma);

        // Trả về jwt chung của app
        const result: JwtPayloadUser = {
          userId: userUpdated.id,
          roleId: userUpdated.roleId,
        };

        return result;
      },
    );

    return await this.login(userJWTPayload, device);
  }

  async craeteOrUpdateSocialFacebook(userFacebook: UserFacebookResponse) {
    // 1. Lấy role CUSTOMER mặc định
    const role = await this.roleService.findRoleByName('CUSTOMER');

    // 2. Tìm user theo email
    const user = await this.userSerivce.findUserByEmail(userFacebook.email);

    // 3. Nếu email chưa có thì tạo mới User và userSocial
    if (!user) {
      const result = await this.prismaService.$transaction(async (prisma) => {
        // 3.1 Tạo user
        const newUser = await prisma.user.create({
          data: {
            email: userFacebook.email,
            roleId: role.id,
          },
          select: { id: true, name: true, email: true, roleId: true },
        });
        if (!newUser)
          throw new BadRequestException('Tạo email người dùng thất bại !');

        // 3.2. Tạo user provider
        const reqSocialDto: CreateUserSocialDto = {
          social: SocialType.FACEBOOK,
          socialId: userFacebook.facebookId,
          displayName: userFacebook.displayName,
          userId: newUser.id,
          avatarUrl: userFacebook.picture,
        };
        const userSocial = await this.userSocialService.createSocial(
          reqSocialDto,
          prisma,
        );
        if (!userSocial)
          throw new BadRequestException('Tạo tài khoản xã hội thất bại !');

        // 3.3 Cập nhật luôn xác thực email
        await this.userSerivce.updateEmailVerify(newUser.id, prisma);

        return { newUser, userSocial };
      });

      return result.userSocial;
    }
    // 4. Nếu email đã tồn tại thì tạo userSocial
    else {
      let social: any = null;
      try {
        //4.1 Check social có tồn tại ?
        social = await this.userSocialService.findSocialUser(
          userFacebook.facebookId,
          SocialType.FACEBOOK,
        );
      } catch (error) {
        if (error instanceof UserSocialBadRequestException) {
          social = null; // Bỏ qua SpecialError(DomainError) để làm nghiệp vụ
        } else throw error;
      }

      // 4.2 Social không tồn tại
      if (!social) {
        const reqSocialDto: CreateUserSocialDto = {
          social: SocialType.FACEBOOK,
          socialId: userFacebook.facebookId,
          displayName: userFacebook.displayName,
          userId: user.id,
          avatarUrl: userFacebook.picture,
        };

        return await this.userSocialService.createSocial(reqSocialDto);
      }
      // 4.3 Social tồn tại thì chỉ update
      else {
        const data: UpdateUserSocialDto = {
          //update
          displayName: userFacebook.displayName,
          avatarUrl: userFacebook.picture,
          //where
          social: SocialType.FACEBOOK,
          socialId: userFacebook.facebookId,
          userId: user.id,
        };
        return await this.userSocialService.updateSocial(social.id, data);
      }
    }
  }

  async craeteOrUpdateSocialGoogle(userGoogle: UserGoogleRespone) {
    // Kiểm tra email có tồn tại trong CSDL
    const userDb = await this.userSerivce.findUserByEmail(userGoogle.email);

    // Trường hợp email không tồn tại
    if (!userDb) {
      return await this.prismaService.$transaction(async (prisma) => {
        // Lấy quyền mặc định cho tài khoản
        const role = await this.roleService.findRoleByName('CUSTOMER', prisma);

        // Tạo mới user
        const newUser = await prisma.user.create({
          data: {
            email: userGoogle.email,
            roleId: role.id,
          },
          select: {
            id: true,
          },
        });

        if (!newUser)
          throw new BadRequestException('Không tạo được thông tin tài khoản !');

        // Tạo mới social
        const userSocialDto: CreateUserSocialDto = {
          userId: newUser.id,
          avatarUrl: userGoogle.photo,
          displayName: userGoogle.displayName,
          social: SocialType.GOOGLE,
          socialId: userGoogle.googleId,
        };
        const social = await this.userSocialService.createSocial(
          userSocialDto,
          prisma,
        );
        if (!social)
          throw new BadRequestException(
            'Không tạo được tài khoản mạng xã hội !',
          );

        // Cập nhật xác thực email
        await this.userSerivce.updateEmailVerify(newUser.id, prisma);

        return social;
      });
    }
    // Trường hợp email tồn tại
    else {
      let social: any = null;
      try {
        // Kiểm tra social có tồn tại ?
        social = await this.userSocialService.findSocialUser(
          userGoogle.googleId,
          SocialType.GOOGLE,
        );
      } catch (error) {
        if (error instanceof UserSocialBadRequestException) {
          // Bỏ qua SpecialError(DomainError) để làm nghiệp vụ
        } else throw error;
      }

      // Social không tồn tại thì tạo mới
      if (!social) {
        // Tạo mới
        const userSocialDto: CreateUserSocialDto = {
          userId: userDb.id,
          avatarUrl: userGoogle.photo,
          displayName: userGoogle.displayName,
          social: SocialType.GOOGLE,
          socialId: userGoogle.googleId,
        };
        return await this.userSocialService.createSocial(userSocialDto);
      }
      // Social tồn tại thì cập nhật
      else {
        // Cập nhật thông tin mới
        const userSocialDto: UpdateUserSocialDto = {
          userId: userDb.id,
          avatarUrl: userGoogle.photo,
          displayName: userGoogle.displayName,
          social: SocialType.GOOGLE,
          socialId: userGoogle.googleId,
        };
        return await this.userSocialService.updateSocial(
          social.id,
          userSocialDto,
        );
      }
    }
  }
}
