import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthUserType } from '../types';

export const AuthUser = createParamDecorator((_: unknown, context: ExecutionContext): AuthUserType => {
  const request = context.switchToHttp().getRequest();

  return request.user;
});
