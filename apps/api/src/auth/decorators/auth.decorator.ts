import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';

import { USER_ROLE } from '@modules/users';

import { COOKIE_KEY } from '../constants';
import { JwtAuthGuard, RefreshExpirationGuard, RolesGuard, TFAGuard } from '../guards';

export const Auth = (roles?: USER_ROLE[], withTFAStep: boolean = true): PropertyDecorator => {
  const guards: Function[] = [RefreshExpirationGuard, JwtAuthGuard, RolesGuard];

  if (withTFAStep) {
    guards.push(TFAGuard);
  }

  return applyDecorators(
    SetMetadata('roles', roles && roles.length ? roles : Object.values(USER_ROLE)),
    UseGuards(...guards),
    ApiBearerAuth(),
    ApiCookieAuth(COOKIE_KEY.ACCESS_TOKEN),
  );
};
