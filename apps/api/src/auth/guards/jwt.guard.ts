import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

import { UnauthorizedError } from '@modules/core/exceptions';

import { AUTH_ERROR } from '../constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: unknown, user: unknown, info: unknown, context: ExecutionContext, status?: unknown): any {
    if (info instanceof TokenExpiredError) {
      throw new UnauthorizedError(AUTH_ERROR.ACCESS_TOKEN_EXPIRED);
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
