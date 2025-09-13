import { LogoutAuthDto } from '@Modules/auth/dto/logout-auth';
import { RefresTokenDto } from '@Modules/auth/dto/refresh-token';
import { TokenService } from '@Modules/token/token.service';
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
  ) {}

  //4./ Hàm này để so sánh mật khẩu trong CSDL và trả kết quả
  async validateUser(username: string, password: string) {
    const user = await this.userSerivce.findUserByUsername(username);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _, ...result } = user;
    return result;
  }

  //6./ Hàm này nhận result của validateUser và tạo jwt
  async login(user: JwtPayloadUser, req?: Request) {
    const payload = {
      name: user.name,
      id: user.id,
      roleId: user.roleId,
    };

    // Tạo token
    const access_token = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '30s',
    });

    const refresh_token = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    let device = 'unknown';
    if (req) {
      const userAgent = req.headers['user-agent'] || 'unknown';
      device = userAgent;
    }

    // Lưu refresh token (đã hash) vào DB
    const tokenStored = await this.tokenService.create(
      user.id,
      refresh_token,
      device,
    );
    if (!tokenStored) {
      throw new BadRequestException('Tạo token bị lỗi !');
    }

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(data: RefresTokenDto) {
    try {
      // 1. Verify refresh token
      const payload = await this.jwtService.verifyAsync(data.refresh_token, {
        secret: await this.configService.get<string>('JWT_REFRESH_SECRET'),
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

      // 5. Tạo access token mới
      const newPayload = { name: user.name, id: user.id, roleId: user.roleId };
      const new_access_token = await this.jwtService.signAsync(newPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '30s',
      });

      // 6. Tùy chọn: Tạo refresh token mới (rotation strategy)
      const new_refresh_token = await this.jwtService.signAsync(newPayload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      });

      // 7. Cập nhật refresh token trong DB
      await this.tokenService.update(storedToken.id, new_refresh_token);

      return {
        access_token: new_access_token,
        refresh_token: new_refresh_token,
      };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }

  async createJwt(user: JwtPayloadUser) {
    if (!user) throw new BadRequestException('Tài khoản không tồn tại !');
    const payload = { id: user.id, name: user.name, role: user.roleId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async revokeToken(req: LogoutAuthDto) {
    //Trường đăng xuất một thiết bị hoặc nhiều thiết bị
    if (req.device)
      return await this.tokenService.deleteToken(req.userId, req.device);
    else return await this.tokenService.deleteTokenAll(req.userId);
  }
}
