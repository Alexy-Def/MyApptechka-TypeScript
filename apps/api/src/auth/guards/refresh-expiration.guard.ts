import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenExpiredError, verify } from 'jsonwebtoken';

import { UnauthorizedError } from '@modules/core/exceptions';
import { AUTH } from 'config';

import { AUTH_ERROR, COOKIE_KEY } from '../constants';

@Injectable()
export class RefreshExpirationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request?.cookies?.[COOKIE_KEY.REFRESH_TOKEN];

    if (!refreshToken) {
      return true;
    }

    try {
      verify(refreshToken, AUTH.REFRESH_JWT_SECRET);
    } catch (err: unknown) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedError(AUTH_ERROR.REFRESH_TOKEN_EXPIRED);
      }
    }

    return true;
  }
}
