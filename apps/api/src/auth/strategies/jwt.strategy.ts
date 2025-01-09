import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { AUTH } from 'config';

import { COOKIE_KEY } from '../constants';
import { AuthUserType } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string => req?.cookies?.[COOKIE_KEY.ACCESS_TOKEN],
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: AUTH.ACCESS_JWT_SECRET,
    });
  }

  public validate(payload: { user: AuthUserType }): AuthUserType {
    return payload.user;
  }
}
