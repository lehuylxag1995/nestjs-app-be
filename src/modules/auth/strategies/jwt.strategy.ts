import { jwtConstands } from '@modules/auth/constands';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstands.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return { id: payload.id, name: payload.name };
  }
}
