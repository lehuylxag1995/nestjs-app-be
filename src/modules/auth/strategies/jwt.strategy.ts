import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_SECRET') || 'default_secret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    const result = {
      id: payload.id,
      name: payload.name,
      roleId: payload.roleId,
    };
    return result;
  }
}
