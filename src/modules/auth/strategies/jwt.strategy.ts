import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayloadUser } from '@Types/jwt-payload.type';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        configService.get<string>('JWT_SECRET_ACCESS_TOKEN') ??
        'default_secret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // Trả về jwt chung của app
    const result: JwtPayloadUser = {
      userId: payload.userId,
      roleId: payload.roleId,
    };
    return result;
  }
}
