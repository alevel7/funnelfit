import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { LoggedInUser } from '../../common/interface/jwt.interface';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.SECRET ?? '',
    });
  }

  async validate(payload: LoggedInUser) {
    return { id: payload.id, email: payload.email, role: payload.role };
  }
}
