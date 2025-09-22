import { OtpPurposeEnum } from '@Enums/otp-purpose-type.enum';
import { RefresTokenDto } from '@Modules/auth/dto/refresh-token';
import { ResetPasswordDto } from '@Modules/auth/dto/reset-password';
import { MailService } from '@Modules/mail/mail.service';
import { OtpService } from '@Modules/otp/otp.service';
import { PrismaService } from '@Modules/prisma/prisma.service';
import { TokenService } from '@Modules/token/token.service';
import { CreateUserDto } from '@Modules/users/dto/create-user.dto';
import { UsersService } from '@Modules/users/users.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
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
  ) {}

  //4./ Hàm này để so sánh mật khẩu trong CSDL và trả kết quả
  async validateUser(username: string, password: string) {
    //Kiểm tra tài khoản có tồn tại ?
    const user = await this.userSerivce.findUserByUsername(username);
    if (!user) return null;

    //Kiểm tra mật khẩu đúng chưa ?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _, ...result } = user;
    return result;
  }

  //6./ Hàm này nhận result của validateUser và tạo jwt
  async login(user: JwtPayloadUser, device = 'unknown') {
    try {
      const payload = {
        name: user.name,
        id: user.id,
        roleId: user.roleId,
      };

      // Tạo token
      const { access_token, refresh_token } =
        await this.tokenService.generateToken(payload);

      // Lưu refresh token (đã hash) vào DB
      const tokenStored = await this.tokenService.createToken(
        user.id,
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
      const user = await this.userSerivce.create(body);

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
      const user = (await this.prismaService.$transaction(async (prisma) => {
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
      })) as JwtPayloadUser;

      // Đăng nhập tài khoản
      return await this.login(user, device);
    } catch (error) {
      throw error;
    }
  }

  async refreshTokenLogin(data: RefresTokenDto) {
    try {
      // 1. Verify refresh token
      const payload = await this.jwtService.verifyAsync(data.refresh_token, {
        secret: await this.configService.get<string>(
          'JWT_SECRET_REFRESH_TOKEN',
        ),
      });

      // 2. Tìm token đã hash trong DB
      const storedToken = await this.tokenService.findTokenByUserAndToken(
        payload.id,
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
      const user = await this.userSerivce.findOne(payload.id);
      if (!user) {
        throw new UnauthorizedException('Không tìm thấy tài khoản người dùng');
      }

      // 5. Tạo thông tin JWT
      const newPayload = { name: user.name, id: user.id, roleId: user.roleId };

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
      return await this.tokenService.deleteToken(user.id, device);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async revokeTokenAll(user: JwtPayloadUser) {
    //Trường đăng xuất nhiều thiết bị
    try {
      return await this.tokenService.deleteTokenAll(user.id);
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
        const user = (await this.userSerivce.updatePassword(
          otpDb.userId,
          password,
        )) as JwtPayloadUser;

        // Xóa tất cả OTP của user
        await this.otpService.deleteAllOtp(
          otpDb.userId,
          OtpPurposeEnum.RESET_PASSWORD,
          prisma,
        );

        return user;
      });

      // Đăng nhập bằng mật khẩu mới
      return await this.login(user, device);
    } catch (error) {
      throw error;
    }
  }
}
